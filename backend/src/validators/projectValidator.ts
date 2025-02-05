import { ProjectInput } from '../types/project';

export function validateProjectInput(data: ProjectInput): string | null {
  if (!data.customer_id) {
    return '顧客IDは必須です';
  }

  if (!data.project_name || data.project_name.trim().length === 0) {
    return '案件名は必須です';
  }

  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    if (startDate > endDate) {
      return '開始日は終了日より前である必要があります';
    }
  }

  if (data.contract_amount !== undefined && data.contract_amount < 0) {
    return '契約金額は0以上である必要があります';
  }

  if (data.profit_margin !== undefined && (data.profit_margin < 0 || data.profit_margin > 100)) {
    return '利益率は0から100の間である必要があります';
  }

  return null;
} 