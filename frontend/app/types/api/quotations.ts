import { Quotation } from '../models/quotation';
import { BaseResponse, BaseCreateRequest, BaseUpdateRequest } from '../common/api';

export type QuotationResponse = BaseResponse<Pick<Quotation, 'validUntil'>>;
export type CreateQuotationRequest = BaseCreateRequest<Quotation>;
export type UpdateQuotationRequest = BaseUpdateRequest<Quotation>; 