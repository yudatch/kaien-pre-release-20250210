import { Router, Request, Response } from 'express';
import {
  getQuotationPreview,
  getInvoicePreview,
  updateQuotation,
  updateInvoice,
  createQuotation,
  createInvoice,
  deleteQuotation,
  deleteInvoice,
  getInvoiceList,
  getQuotationList
} from '../controllers/documentController';

const router = Router();

// 見積書関連のエンドポイント
router.get('/quotations', (req: Request, res: Response) => {
  void getQuotationList(req, res);
});

router.get('/quotations/:projectId', (req: Request, res: Response) => {
  void getQuotationPreview(req, res);
});

router.post('/quotations', (req: Request, res: Response) => {
  void createQuotation(req, res);
});

router.put('/quotations/:projectId', (req: Request, res: Response) => {
  void updateQuotation(req, res);
});

router.delete('/quotations/:quotationId', (req: Request, res: Response) => {
  void deleteQuotation(req, res);
});

// 請求書関連のエンドポイント
router.get('/invoices', (req: Request, res: Response) => {
  void getInvoiceList(req, res);
});

router.get('/invoices/:projectId', (req: Request, res: Response) => {
  void getInvoicePreview(req, res);
});

router.post('/invoices', (req: Request, res: Response) => {
  void createInvoice(req, res);
});

router.put('/invoices/:projectId', (req: Request, res: Response) => {
  void updateInvoice(req, res);
});

router.delete('/invoices/:invoiceId', (req: Request, res: Response) => {
  void deleteInvoice(req, res);
});

export default router; 