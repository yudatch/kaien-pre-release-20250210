// 共通のAPIレスポンス型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ページネーション用のパラメータ
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}

// ページネーション用のレスポンス型
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// エラーレスポンスの型
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export interface ApiClient {
  get<T>(url: string, params?: any): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: any): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: any): Promise<ApiResponse<T>>;
  delete<T>(url: string): Promise<ApiResponse<T>>;
}

export type BaseResponse<T> = {
  id: string;
  documentNumber: string;
  issueDate: Date;
  totalAmount: number;
  status: string;
  projectName: string;
  customerName: string;
} & T;

export type BaseCreateRequest<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type BaseUpdateRequest<T> = Partial<BaseCreateRequest<T>>; 