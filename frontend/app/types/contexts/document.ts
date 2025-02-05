import { DocumentType } from '@/app/constants/document';

export interface DocumentTypeContextType {
  documentType: DocumentType;
  setDocumentType: (type: DocumentType) => void;
} 