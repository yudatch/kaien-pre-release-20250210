export const ENDPOINTS = {
  DASHBOARD: {
    BASE: '/api/dashboard',
  },
  PROJECTS: {
    BASE: '/api/projects',
    DETAIL: (id: string) => `/api/projects/${id}`,
  },
  CUSTOMERS: {
    BASE: '/api/customers',
    DETAIL: (id: string) => `/api/customers/${id}`,
  },
  CONSTRUCTIONS: {
    BASE: '/api/constructions',
    DETAIL: (id: string) => `/api/constructions/${id}`,
    DETAILS: {
      BASE: '/api/construction-details',
      LIST: '/api/construction-details',
      GET: (id: number) => `/api/construction-details/${id}`,
      CREATE: '/api/construction-details',
      UPDATE: (id: number) => `/api/construction-details/${id}`,
      DELETE: (id: number) => `/api/construction-details/${id}`,
    },
  },
  PURCHASES: {
    BASE: '/api/purchases',
    DETAIL: (id: string) => `/api/purchases/${id}`,
    STATUS: (id: string) => `/api/purchases/${id}/status`,
    DELIVERY: (orderId: string, itemId: string) => `/api/purchases/${orderId}/items/${itemId}/delivery`,
    MASTER: {
      PRODUCTS: '/api/purchases/master/products',
      SUPPLIERS: '/api/purchases/master/suppliers',
    },
  },
  DOCUMENTS: {
    QUOTATIONS: {
      BASE: '/api/documents/quotations',
      LIST: '/api/documents/quotations',
      GET: (projectId: number) => `/api/documents/quotations/${projectId}`,
      CREATE: '/api/documents/quotations',
      UPDATE: (projectId: number) => `/api/documents/quotations/${projectId}`,
      DELETE: (quotationId: number) => `/api/documents/quotations/${quotationId}`,
    },
    INVOICES: {
      BASE: '/api/documents/invoices',
      LIST: '/api/documents/invoices',
      GET: (projectId: number) => `/api/documents/invoices/${projectId}`,
      CREATE: '/api/documents/invoices',
      UPDATE: (projectId: number) => `/api/documents/invoices/${projectId}`,
      DELETE: (invoiceId: number) => `/api/documents/invoices/${invoiceId}`,
    },
  },
  EXPENSES: {
    BASE: '/api/expenses',
    LIST: '/api/expenses',
    GET: (id: number) => `/api/expenses/${id}`,
    CREATE: '/api/expenses',
    UPDATE: (id: number) => `/api/expenses/${id}`,
    DELETE: (id: number) => `/api/expenses/${id}`,
    APPROVE: (id: number) => `/api/expenses/${id}/approve`,
    REJECT: (id: number) => `/api/expenses/${id}/reject`,
    PENDING: '/api/expenses/pending',
  },
}; 