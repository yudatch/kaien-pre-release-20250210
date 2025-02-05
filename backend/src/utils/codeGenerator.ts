import Project from '../models/Project';
import Customer from '../models/Customer';
import { Op } from 'sequelize';

export async function generateProjectCode(): Promise<string> {
  const today = new Date();
  const year = today.getFullYear().toString().slice(-2);
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const prefix = `PJ${year}${month}`;

  // 同じ月の最後の案件コードを取得
  const lastProject = await Project.findOne({
    where: {
      project_code: {
        [Op.like]: `${prefix}%`
      }
    },
    order: [['project_code', 'DESC']]
  });

  let sequence = 1;
  if (lastProject) {
    // 既存の案件コードから連番を取得して+1
    const lastSequence = parseInt(lastProject.project_code.slice(-3));
    sequence = lastSequence + 1;
  }

  // 3桁の連番を生成（001, 002, ...）
  const sequenceStr = sequence.toString().padStart(3, '0');
  return `${prefix}${sequenceStr}`;
}

export async function generateCustomerCode(): Promise<string> {
  const today = new Date();
  const year = today.getFullYear().toString().slice(-2);
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const prefix = `CS${year}${month}`;

  // 同じ月の最後の顧客コードを取得
  const lastCustomer = await Customer.findOne({
    where: {
      customer_code: {
        [Op.like]: `${prefix}%`
      }
    },
    order: [['customer_code', 'DESC']]
  });

  let sequence = 1;
  if (lastCustomer) {
    // 既存の顧客コードから連番を取得して+1
    const lastSequence = parseInt(lastCustomer.customer_code.slice(-3));
    sequence = lastSequence + 1;
  }

  // 3桁の連番を生成（001, 002, ...）
  const sequenceStr = sequence.toString().padStart(3, '0');
  return `${prefix}${sequenceStr}`;
} 