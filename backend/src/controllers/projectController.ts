import { Request, Response } from 'express';
import { Model, Op } from 'sequelize';
import Project from '../models/Project';
import Customer from '../models/Customer';
import Quotation from '../models/Quotation';
import Invoice from '../models/Invoice';
import { ProjectInput, ProjectStatus } from '../types/project';
import { generateProjectCode } from '../utils/codeGenerator';
import sequelize from '../config/database';
import ProjectContactHistory from '../models/ProjectContactHistory';
import { ValidationError } from 'sequelize';

// プロジェクト一覧取得
export const getProjectList = async (req: Request, res: Response) => {
  try {
    const projects = await Project.findAll({
      include: [{ 
        model: Customer, 
        as: 'Customer',
        required: true,
        attributes: ['name', 'customer_id'] 
      }],
      order: [['created_at', 'DESC']],
    });
    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'プロジェクト一覧の取得に失敗しました。'
    });
  }
};

// プロジェクト詳細取得
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'Customer',
          attributes: ['customer_id', 'name']
        },
        {
          model: ProjectContactHistory,
          as: 'contact_histories',
          attributes: ['contact_id', 'contact_date', 'contact_time', 'contact_method', 'contact_person', 'contact_content']
        }
      ]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: '案件が見つかりません。'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(500).json({
      success: false,
      message: '案件の取得中にエラーが発生しました。'
    });
  }
};

// プロジェクト作成
export const createProject = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  
  try {
    const projectData: ProjectInput = req.body;
    const contactHistories = projectData.contact_histories || [];
    delete projectData.contact_histories;
    
    // 案件コードの生成
    const projectCode = await generateProjectCode();
    const project = await Project.create({
      ...projectData,
      project_code: projectCode,
    }, { transaction: t });

    // 見積書の作成
    const quotationNumber = `QT${new Date().toISOString().slice(0,10).replace(/-/g,'')}${Math.floor(Math.random() * 1000)}`;
    const quotation = await Quotation.create({
      quotation_number: quotationNumber,
      project_id: project.project_id,
      issue_date: new Date(),
      valid_until: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1ヶ月後を有効期限とする
      subtotal: 0,
      tax_amount: 0,
      total_amount: 0,
      status: 'draft',
      notes: '',
      created_by: 1 // TODO: 認証ユーザーIDを使用
    }, { transaction: t });

    // 請求書の作成
    const invoiceNumber = `IV${new Date().toISOString().slice(0,10).replace(/-/g,'')}${Math.floor(Math.random() * 1000)}`;
    const invoice = await Invoice.create({
      invoice_number: invoiceNumber,
      project_id: project.project_id,
      quotation_id: quotation.quotation_id,
      issue_date: new Date(),
      due_date: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1ヶ月後を支払期限とする
      subtotal: 0,
      tax_amount: 0,
      total_amount: 0,
      status: 'draft',
      notes: '',
      created_by: 1 // TODO: 認証ユーザーIDを使用
    }, { transaction: t });

    // コンタクト履歴の作成
    const validContactHistories = contactHistories.filter((history: any) => {
      return history.contact_date !== "" && 
             history.contact_time !== "" && 
             history.contact_method !== "" && 
             history.contact_person !== "" && 
             history.contact_content !== "";
    });

    if (validContactHistories.length > 0) {
      await ProjectContactHistory.bulkCreate(
        validContactHistories.map((history: any) => ({
          project_id: project.project_id,
          contact_date: history.contact_date,
          contact_time: history.contact_time,
          contact_method: history.contact_method,
          contact_person: history.contact_person,
          contact_content: history.contact_content,
          created_by: req.user?.user_id,
          updated_by: req.user?.user_id
        })),
        { transaction: t }
      );
    }

    await t.commit();

    res.status(201).json({
      success: true,
      data: {
        project,
        quotation,
        invoice
      },
      message: '案件を作成しました。'
    });
  } catch (error) {
    await t.rollback();

    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        message: '入力内容に誤りがあります。',
        errors: error.errors
      });
    }

    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: '案件の作成中にエラーが発生しました。'
    });
  }
};

// プロジェクト更新
export const updateProject = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const projectData: Partial<ProjectInput> = req.body;
    const contactHistories = projectData.contact_histories || [];
    delete projectData.contact_histories;

    const project = await Project.findByPk(id);
    if (!project) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: '案件が見つかりません。'
      });
    }

    // プロジェクトの更新
    await project.update(projectData, { transaction: t });

    // 既存のコンタクト履歴を削除
    await ProjectContactHistory.destroy({
      where: { project_id: id },
      transaction: t
    });

    // 新しいコンタクト履歴を作成（空でない場合のみ）
    const validContactHistories = contactHistories.filter((history: any) => {
      return history.contact_date !== "" && 
             history.contact_time !== "" && 
             history.contact_method !== "" && 
             history.contact_person !== "" && 
             history.contact_content !== "";
    });

    if (validContactHistories.length > 0) {
      await ProjectContactHistory.bulkCreate(
        validContactHistories.map((history: any) => ({
          project_id: project.project_id,
          contact_date: history.contact_date,
          contact_time: history.contact_time,
          contact_method: history.contact_method,
          contact_person: history.contact_person,
          contact_content: history.contact_content,
          created_by: req.user?.user_id,
          updated_by: req.user?.user_id
        })),
        { transaction: t }
      );
    }

    await t.commit();

    // 更新後のプロジェクト情報を取得
    const updatedProject = await Project.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'Customer',
          attributes: ['customer_id', 'name']
        },
        {
          model: ProjectContactHistory,
          as: 'contact_histories',
          attributes: ['contact_id', 'contact_date', 'contact_time', 'contact_method', 'contact_person', 'contact_content']
        }
      ]
    });

    res.json({
      success: true,
      data: updatedProject,
      message: '案件を更新しました。'
    });
  } catch (error) {
    await t.rollback();

    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        message: '入力内容に誤りがあります。',
        errors: error.errors
      });
    }

    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: '案件の更新中にエラーが発生しました。'
    });
  }
};

// プロジェクト削除
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'プロジェクトが見つかりません。'
      });
    }

    await project.destroy();
    res.json({
      success: true,
      message: 'プロジェクトを削除しました。'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    
    // 外部キー制約違反エラーの場合
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'このプロジェクトに紐づく見積書が存在するため削除できません。先に見積書を削除してください。'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'プロジェクトの削除に失敗しました。'
    });
  }
}; 