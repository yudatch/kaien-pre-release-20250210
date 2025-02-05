/**
 * 数値を通貨形式（円）にフォーマットします
 * @param amount - フォーマットする金額
 * @returns フォーマットされた金額文字列。金額が無効な場合は空文字列を返します。
 */
export const formatMoney = (amount: number | string | null | undefined): string => {
  if (amount === null || amount === undefined || amount === '') return '';
  
  try {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '';
    
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(num);
  } catch {
    return '';
  }
}; 