/**
 * 金額を通貨形式（円）にフォーマットします
 */
export const formatCurrency = (amount: number | string | undefined): string => {
  if (amount === undefined) return '¥0';
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '¥0';
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0
  }).format(numAmount);
}; 