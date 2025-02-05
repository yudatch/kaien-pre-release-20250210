import { Invoice } from '../models/invoice';
import { BaseResponse, BaseCreateRequest, BaseUpdateRequest } from '../common/api';

export type InvoiceResponse = BaseResponse<Pick<Invoice, 'dueDate' | 'projectId'>>;
export type CreateInvoiceRequest = BaseCreateRequest<Invoice>;
export type UpdateInvoiceRequest = BaseUpdateRequest<Invoice>; 