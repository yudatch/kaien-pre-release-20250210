/**
 * 日付を指定されたフォーマットで文字列に変換します
 * @param date - フォーマットする日付（文字列またはDate型）
 * @returns フォーマットされた日付文字列。日付が無効な場合は空文字列を返します。
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    
    return d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return '';
  }
}; 