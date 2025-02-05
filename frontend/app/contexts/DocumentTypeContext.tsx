"use client";

import React, { createContext, useContext, useState } from 'react';

type DocumentType = 'quotation' | 'invoice' | 'purchase_order' | 'expense' | null;

interface DocumentTypeContextType {
  documentType: DocumentType;
  setDocumentType: (type: DocumentType) => void;
}

const DocumentTypeContext = createContext<DocumentTypeContextType | undefined>(undefined);

export function DocumentTypeProvider({ children }: { children: React.ReactNode }) {
  const [documentType, setDocumentType] = useState<DocumentType>(null);

  return (
    <DocumentTypeContext.Provider value={{ documentType, setDocumentType }}>
      {children}
    </DocumentTypeContext.Provider>
  );
}

export function useDocumentType() {
  const context = useContext(DocumentTypeContext);
  if (context === undefined) {
    throw new Error('useDocumentType must be used within a DocumentTypeProvider');
  }
  return context;
} 