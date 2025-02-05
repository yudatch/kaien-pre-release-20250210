import { CreateCustomerData } from '../types/customer';
import { CreateProjectData } from '../types/project';
import { Document, DocumentDetail } from '../types/models/document';
import { CreateConstructionDetailRequest } from '../types/api/constructions';

// 基本的なバリデーション関数
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9-]{10,}$/;
  return phoneRegex.test(phone);
};

export const isValidPostalCode = (postalCode: string): boolean => {
  const postalCodeRegex = /^\d{3}-?\d{4}$/;
  return postalCodeRegex.test(postalCode);
};

// 顧客バリデーション
export const validateCustomer = (data: Partial<CreateCustomerData>) => {
  const errors: Partial<Record<keyof CreateCustomerData, string>> = {};

  if (!isRequired(data.name)) {
    errors.name = '顧客名は必須です';
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'メールアドレスの形式が正しくありません';
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = '電話番号の形式が正しくありません';
  }

  if (data.postal_code && !isValidPostalCode(data.postal_code)) {
    errors.postal_code = '郵便番号の形式が正しくありません';
  }

  return errors;
};

// 案件バリデーション
export const validateProject = (data: Partial<CreateProjectData>) => {
  const errors: Partial<Record<keyof CreateProjectData, string>> = {};

  if (!isRequired(data.project_name)) {
    errors.project_name = '案件名は必須です';
  }

  if (!isRequired(data.customer_id)) {
    errors.customer_id = '顧客は必須です';
  }

  return errors;
};

// 書類バリデーション
export const validateDocument = (data: Partial<Document>) => {
  const errors: Record<string, string> = {};

  // 基本情報のバリデーション
  if (!isRequired(data.project_id)) {
    errors.project_id = '案件は必須です';
  }

  if (!isRequired(data.issue_date)) {
    errors.issue_date = '発行日は必須です';
  }

  // 明細のバリデーション
  if (!data.details || data.details.length === 0) {
    errors.details = '少なくとも1つの明細が必要です';
  } else {
    let totalAmount = 0;
    data.details.forEach((detail: DocumentDetail, index: number) => {
      if (!isRequired(detail.productName)) {
        errors[`details.${index}.productName`] = '品目名は必須です';
      }

      if (!isRequired(detail.quantity) || detail.quantity <= 0) {
        errors[`details.${index}.quantity`] = '数量は0より大きい値を指定してください';
      }

      if (!isRequired(detail.unitPrice) || detail.unitPrice < 0) {
        errors[`details.${index}.unitPrice`] = '単価は0以上を指定してください';
      }

      // 金額の検証
      const calculatedAmount = detail.quantity * detail.unitPrice;
      if (Math.abs(detail.amount - calculatedAmount) > 1) {
        errors[`details.${index}.amount`] = '金額が不正です（数量×単価と一致しません）';
      }

      totalAmount += calculatedAmount;
    });

    // 合計金額が0の場合のエラー
    if (totalAmount <= 0) {
      errors.total_amount = '合計金額は0より大きい値を指定してください';
    }
  }

  // 合計金額のバリデーション
  if (data.details && data.details.length > 0) {
    const detailsTotal = data.details.reduce((sum, detail) => sum + detail.amount, 0);
    const isInternalTax = data.tax_calculation_type === '内税';

    if (isInternalTax) {
      // 内税の場合
      const total_amount = detailsTotal;
      const subtotal = Math.floor(total_amount / 1.1);
      const tax_amount = total_amount - subtotal;

      if (data.subtotal !== undefined && Math.abs(data.subtotal - subtotal) > 1) {
        errors.subtotal = '小計が不正です（内税計算と一致しません）';
      }

      if (data.tax_amount !== undefined && Math.abs(data.tax_amount - tax_amount) > 1) {
        errors.tax_amount = '消費税が不正です（内税計算と一致しません）';
      }

      if (data.total_amount !== undefined && Math.abs(data.total_amount - total_amount) > 1) {
        errors.total_amount = '合計金額が不正です（明細合計と一致しません）';
      }
    } else {
      // 外税の場合
      const subtotal = detailsTotal;
      const tax_amount = Math.floor(subtotal * 0.1);
      const total_amount = subtotal + tax_amount;

      if (data.subtotal !== undefined && Math.abs(data.subtotal - subtotal) > 1) {
        errors.subtotal = '小計が不正です（明細の合計と一致しません）';
      }

      if (data.tax_amount !== undefined && Math.abs(data.tax_amount - tax_amount) > 1) {
        errors.tax_amount = '消費税が不正です（小計の10%と一致しません）';
      }

      if (data.total_amount !== undefined && Math.abs(data.total_amount - total_amount) > 1) {
        errors.total_amount = '合計金額が不正です（小計＋消費税と一致しません）';
      }
    }

    // 合計金額（税込）が0の場合のエラー
    if (data.total_amount !== undefined && data.total_amount <= 0) {
      errors.total_amount = '合計金額（税込）は0より大きい値を指定してください';
    }
  }

  return errors;
};

export const validateConstructionDetail = (data: Partial<CreateConstructionDetailRequest>) => {
  const errors: Partial<Record<keyof CreateConstructionDetailRequest, string>> = {};

  if (!isRequired(data.project_id)) {
    errors.project_id = 'プロジェクトは必須です';
  }

  if (!isRequired(data.contractor_id)) {
    errors.contractor_id = '業者は必須です';
  }

  if (data.progress !== undefined && (data.progress < 0 || data.progress > 100)) {
    errors.progress = '進捗は0から100の間で入力してください';
  }

  if (data.unit_price !== undefined && data.unit_price < 0) {
    errors.unit_price = '単価は0以上を入力してください';
  }

  return errors;
}; 