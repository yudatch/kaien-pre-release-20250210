import { Request, Response } from 'express';
import ConstructionDetail from '../models/ConstructionDetail';
import { ConstructionDetailInput } from '../types/constructionDetail';
import { CONSTRUCTION_STATUSES } from '../types/enums';
import { ValidationError } from 'sequelize';
import Project from '../models/Project';
import Supplier from '../models/Supplier';
import User from '../models/User';

// 工事詳細一覧取得
export const getConstructionDetailList = async (req: Request, res: Response) => {
  try {
    const constructionDetails = await ConstructionDetail.findAll({
      include: [
        {
          model: Project,
          as: 'Project',
          attributes: ['project_id', 'project_name', 'project_code']
        },
        {
          model: Supplier,
          as: 'Contractor',
          attributes: ['supplier_id', 'name']
        },
        {
          model: User,
          as: 'ConstructionCreator',
          attributes: ['user_id', 'username']
        },
        {
          model: User,
          as: 'ConstructionUpdater',
          attributes: ['user_id', 'username']
        }
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({
      success: true,
      data: constructionDetails,
    });
  } catch (error) {
    console.error('Error fetching construction details:', error);
    res.status(500).json({
      success: false,
      message: '工事詳細一覧の取得に失敗しました。'
    });
  }
};

// 工事詳細取得
export const getConstructionDetailById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const constructionDetail = await ConstructionDetail.findByPk(id, {
      include: [
        {
          model: Project,
          as: 'Project',
          attributes: ['project_id', 'project_name', 'project_code']
        },
        {
          model: Supplier,
          as: 'Contractor',
          attributes: ['supplier_id', 'name']
        },
        {
          model: User,
          as: 'ConstructionCreator',
          attributes: ['user_id', 'username']
        },
        {
          model: User,
          as: 'ConstructionUpdater',
          attributes: ['user_id', 'username']
        }
      ]
    });

    if (!constructionDetail) {
      return res.status(404).json({
        success: false,
        message: '工事詳細が見つかりません。'
      });
    }

    res.json({
      success: true,
      data: constructionDetail,
    });
  } catch (error) {
    console.error('Error fetching construction detail:', error);
    res.status(500).json({
      success: false,
      message: '工事詳細の取得に失敗しました。'
    });
  }
};

// 入力バリデーション
const validateConstructionDetail = (data: ConstructionDetailInput) => {
  const errors: string[] = [];

  if (!data.project_id) {
    errors.push('プロジェクトは必須です。');
  }

  if (!data.contractor_id) {
    errors.push('業者は必須です。');
  }

  if (data.unit_price && data.unit_price < 0) {
    errors.push('単価は0以上の数値を入力してください。');
  }

  if (data.status && !CONSTRUCTION_STATUSES.includes(data.status)) {
    errors.push('無効なステータスです。');
  }

  if (data.progress !== undefined && (data.progress < 0 || data.progress > 100)) {
    errors.push('進捗は0から100の間で入力してください。');
  }

  return errors;
};

// 工事詳細作成
export const createConstructionDetail = async (req: Request, res: Response) => {
  try {
    const constructionDetailData: ConstructionDetailInput = req.body;
    
    // バリデーション
    const validationErrors = validateConstructionDetail(constructionDetailData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors
      });
    }

    const constructionDetail = await ConstructionDetail.create(constructionDetailData);
    
    // 関連データを含めて再取得
    const createdDetail = await ConstructionDetail.findByPk(constructionDetail.construction_id, {
      include: [
        {
          model: Project,
          as: 'Project',
          attributes: ['project_id', 'project_name', 'project_code']
        },
        {
          model: Supplier,
          as: 'Contractor',
          attributes: ['supplier_id', 'name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: createdDetail,
      message: '工事詳細が作成されました'
    });
  } catch (error) {
    console.error('Error creating construction detail:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        message: 'バリデーションエラー',
        errors: error.errors.map(err => err.message)
      });
    }

    res.status(500).json({ 
      success: false,
      message: '工事詳細の作成に失敗しました'
    });
  }
};

// 工事詳細更新
export const updateConstructionDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const constructionDetailData: Partial<ConstructionDetailInput> = req.body;

    // バリデーション
    const validationErrors = validateConstructionDetail(constructionDetailData as ConstructionDetailInput);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors
      });
    }

    const constructionDetail = await ConstructionDetail.findByPk(id);
    if (!constructionDetail) {
      return res.status(404).json({
        success: false,
        message: '工事詳細が見つかりません。'
      });
    }

    await constructionDetail.update(constructionDetailData);

    // 関連データを含めて再取得
    const updatedDetail = await ConstructionDetail.findByPk(id, {
      include: [
        {
          model: Project,
          as: 'Project',
          attributes: ['project_id', 'project_name', 'project_code']
        },
        {
          model: Supplier,
          as: 'Contractor',
          attributes: ['supplier_id', 'name']
        }
      ]
    });

    res.json({
      success: true,
      data: updatedDetail,
      message: '工事詳細が更新されました'
    });
  } catch (error) {
    console.error('Error updating construction detail:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        message: 'バリデーションエラー',
        errors: error.errors.map(err => err.message)
      });
    }

    res.status(500).json({ 
      success: false,
      message: '工事詳細の更新に失敗しました'
    });
  }
};

// 工事詳細削除
export const deleteConstructionDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const constructionDetail = await ConstructionDetail.findByPk(id);
    
    if (!constructionDetail) {
      return res.status(404).json({
        success: false,
        message: '工事詳細が見つかりません。'
      });
    }

    await constructionDetail.destroy();
    res.json({
      success: true,
      message: '工事詳細が削除されました'
    });
  } catch (error) {
    console.error('Error deleting construction detail:', error);
    res.status(500).json({ 
      success: false,
      message: '工事詳細の削除に失敗しました'
    });
  }
}; 