import { Document, DocumentDetail } from '../types/models/document';

/**
 * 金額を通貨形式（円）にフォーマットします
 */
export const formatDocumentAmount = (amount: number | string | undefined): string => {
  if (amount === undefined) return '0';
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '0';
  return new Intl.NumberFormat('ja-JP', { maximumFractionDigits: 0 }).format(numAmount);
};

/**
 * 明細の金額を計算します
 */
export const calculateDetailAmount = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

/**
 * 小計を計算します
 */
export const calculateSubtotal = (details: DocumentDetail[]): number => {
  return details.reduce((sum, detail) => sum + Number(detail.amount), 0);
};

/**
 * 消費税を計算します
 */
export const calculateTaxAmount = (subtotal: number, isInternalTax: boolean = false): number => {
  const taxRate = 0.1;
  if (isInternalTax) {
    // 内税の場合は合計金額から逆算
    return Math.floor(subtotal - (subtotal / (1 + taxRate)));
  } else {
    // 外税の場合は単純に税率を掛ける
    return Math.floor(subtotal * taxRate);
  }
};

/**
 * 合計金額を計算します
 */
export const calculateTotalAmount = (subtotal: number, taxAmount: number, isInternalTax: boolean = false): number => {
  if (isInternalTax) {
    return subtotal + taxAmount;
  } else {
    return subtotal + taxAmount;
  }
};

/**
 * ドキュメントの全金額を再計算します
 */
export const recalculateDocumentAmounts = (document: Document): Document => {
  const isInternalTax = document.tax_calculation_type === '内税';
  const detailsTotal = calculateSubtotal(document.details);

  if (isInternalTax) {
    // 内税の場合
    const total_amount = detailsTotal;
    const subtotal = Math.floor(total_amount / 1.1);
    const tax_amount = total_amount - subtotal;

    return {
      ...document,
      subtotal,
      tax_amount,
      total_amount
    };
  } else {
    // 外税の場合
    const subtotal = detailsTotal;
    const tax_amount = calculateTaxAmount(subtotal, false);
    const total_amount = subtotal + tax_amount;

    return {
      ...document,
      subtotal,
      tax_amount,
      total_amount
    };
  }
};

/**
 * 新規明細の雛形を作成します
 */
export const createNewDetail = (): DocumentDetail => ({
  product_id: 0,
  productName: '',
  quantity: 1,
  unit: '個',
  unitPrice: 1,
  amount: 1
}); 