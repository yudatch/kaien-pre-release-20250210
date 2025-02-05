import { CreateExpenseRequest, UpdateExpenseRequest, ExpenseResponse, ExpenseListResponse, ApproveExpenseRequest, RejectExpenseRequest } from '@/app/types/api/expenses';
import { UploadOptions } from '@/app/types/components/features/expenses/forms';
import { api } from './client';
import { ENDPOINTS } from './endpoints';

export const expensesApi = {
  // 経費一覧の取得
  getExpenses: async (page: number = 1, perPage: number = 10) => {
    return api.get<ExpenseListResponse>(`${ENDPOINTS.EXPENSES.LIST}?page=${page}&perPage=${perPage}`);
  },

  // 経費詳細の取得
  getExpense: async (id: number) => {
    return api.get<ExpenseResponse>(ENDPOINTS.EXPENSES.GET(id));
  },

  // 経費の新規作成
  createExpense: async (data: CreateExpenseRequest, options?: UploadOptions) => {
    console.log('\n=== 経費作成APIリクエスト ===');
    console.log('リクエストデータ:', data);
    
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'receipt_image' && value instanceof File) {
          console.log('画像ファイル:', {
            name: value.name,
            type: value.type,
            size: `${(value.size / 1024).toFixed(2)}KB`
          });
          formData.append('receipt_image', value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    try {
      const response = await api.post<ExpenseResponse>(ENDPOINTS.EXPENSES.CREATE, formData, {
        onUploadProgress: options?.onUploadProgress
      });
      console.log('レスポンス:', response.data);
      return response;
    } catch (error) {
      console.error('経費作成エラー:', error);
      throw error;
    }
  },

  // 経費の更新
  updateExpense: async (data: UpdateExpenseRequest, options?: UploadOptions) => {
    console.log('\n=== 経費更新APIリクエスト ===');
    console.log('受信データ:', {
      ...data,
      receipt_image: data.receipt_image instanceof File 
        ? { name: data.receipt_image.name, type: data.receipt_image.type, size: `${(data.receipt_image.size / 1024).toFixed(2)}KB` }
        : data.receipt_image,
      receipt_image_url: data.receipt_image_url
    });
    
    const formData = new FormData();
    const { id, ...requestData } = data;

    // 必須フィールドを追加
    if (requestData.expense_date) {
      formData.append('expense_date', requestData.expense_date);
    }
    if (requestData.receipt_date) {
      formData.append('receipt_date', requestData.receipt_date);
    }
    if (requestData.invoice_number) {
      formData.append('invoice_number', requestData.invoice_number);
    }
    formData.append('category', requestData.category);
    formData.append('amount', String(requestData.amount));
    formData.append('payment_method', requestData.payment_method);
    formData.append('description', requestData.description || '');
    formData.append('purpose', requestData.purpose);

    // 画像ファイルの処理
    if (requestData.receipt_image instanceof File) {
      console.log('\n=== 画像ファイル情報 ===');
      console.log({
        name: requestData.receipt_image.name,
        type: requestData.receipt_image.type,
        size: `${(requestData.receipt_image.size / 1024).toFixed(2)}KB`
      });
      formData.append('receipt_image', requestData.receipt_image);
    }

    // receipt_image_urlの処理
    // 画像を削除する場合は明示的に'null'を送信
    if (requestData.receipt_image_url === null) {
      formData.append('receipt_image_url', 'null');
      console.log('\n=== 画像URL情報 ===');
      console.log('receipt_image_url: null');
    }

    console.log('\n=== 送信するFormDataの内容 ===');
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key}:`, {
          name: value.name,
          type: value.type,
          size: `${(value.size / 1024).toFixed(2)}KB`
        });
      } else {
        console.log(`${key}:`, value);
      }
    });

    try {
      const response = await api.put<ExpenseResponse>(ENDPOINTS.EXPENSES.UPDATE(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: options?.onUploadProgress
      });
      console.log('\n=== レスポンス ===');
      console.log(response.data);
      return response;
    } catch (error) {
      console.error('\n=== エラー ===');
      console.error('経費更新エラー:', error);
      throw error;
    }
  },

  // 経費の削除
  deleteExpense: async (id: number) => {
    return api.delete(ENDPOINTS.EXPENSES.DELETE(id));
  },

  // 経費の承認
  approveExpense: async (data: ApproveExpenseRequest) => {
    return api.post<ExpenseResponse>(ENDPOINTS.EXPENSES.APPROVE(data.id), data);
  },

  // 経費の否認
  rejectExpense: async (data: RejectExpenseRequest) => {
    return api.post<ExpenseResponse>(ENDPOINTS.EXPENSES.REJECT(data.id), data);
  },

  // 承認待ち経費一覧の取得
  getPendingExpenses: async (page: number = 1, perPage: number = 10) => {
    return api.get<ExpenseListResponse>(`${ENDPOINTS.EXPENSES.PENDING}?page=${page}&perPage=${perPage}`);
  }
}; 