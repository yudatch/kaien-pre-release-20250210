"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Box, Button, ButtonGroup, Stack, Container, Typography, ToggleButton, ToggleButtonGroup, Snackbar, Alert, CircularProgress } from '@mui/material';
import { DocumentPreview } from './DocumentPreview';
import { ArrowBack, PictureAsPdf, Edit, Save, Download, Cancel } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useDocumentType } from '../../contexts/DocumentTypeContext';
import { Document, DocumentUpdateData, DocumentFormData, DocumentDetailData, QuotationUpdateData, InvoiceUpdateData, UpdateDocumentDetail } from '@/app/types/models/document';
import { documentsApi } from '@/app/api/documents';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DocumentResponse, QuotationResponse, InvoiceResponse } from '../../types/api/documents';
import { DocumentStatus } from '../../constants/document';
import { FeedbackMessage } from '@/app/components/core/feedback/FeedbackMessage';

// APIに送信する明細データの型を定義
interface ApiDocumentDetail {
  detailId: number;
  productId: number;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  '& .MuiToggleButton-root': {
    height: '36.5px',
    textTransform: 'none',
    borderColor: '#1976d2',
    color: '#1976d2',
    '&.Mui-selected': {
      backgroundColor: '#1976d2',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#1565c0',
      }
    },
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
    }
  }
}));

interface DocumentPreviewPageProps {
  type: '見積書' | '請求書';
  formatData: (responseData: any) => Document;
  fetchDocument: (id: string) => Promise<any>;
}

export function DocumentPreviewPage({ type, formatData, fetchDocument }: DocumentPreviewPageProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id ? (typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '') : '';
  const router = useRouter();
  const theme = useTheme();
  const { documentType, setDocumentType } = useDocumentType();
  const [data, setData] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(searchParams?.get('edit') === 'true');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, documentType]);

  useEffect(() => {
    setDocumentType(type);
  }, [type, setDocumentType]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      try {
        let response = await fetchDocument(id);
        console.log('=== APIレスポンス ===', response);

        // APIレスポンスの構造を確認
        if (!response || !response.data) {
          throw new Error('無効なAPIレスポンス');
        }

        // 請求書で、かつ明細データが存在しない場合
        if (type === '請求書' && (!response.data.details || response.data.details.length === 0)) {
          try {
            // 同じプロジェクトの見積書データを取得
            const quotationResponse = await documentsApi.getQuotation(id);
            if (quotationResponse?.data?.details && quotationResponse.data.details.length > 0) {
              // 見積書の明細データを請求書用にフォーマット
              const quotationDetails: UpdateDocumentDetail[] = quotationResponse.data.details.map(detail => ({
                detailId: undefined,
                productId: detail.product_id,
                productName: detail.productName,
                quantity: detail.quantity,
                unit: '個',
                unitPrice: detail.unitPrice,
                amount: detail.amount
              }));

              // 請求書を更新
              const invoiceUpdateData: InvoiceUpdateData = {
                invoiceId: Number(id),
                details: quotationDetails,
                taxAmount: quotationResponse.data.tax_amount,
                totalAmount: quotationResponse.data.total_amount,
                notes: quotationResponse.data.notes
              };

              await documentsApi.updateInvoice(id, invoiceUpdateData);
              
              // 更新後のデータを再取得
              response = await fetchDocument(id);
              setSnackbarMessage('見積書から明細データをコピーしました');
              setOpenSnackbar(true);
            }
          } catch (quotationError) {
            console.error('見積書データの取得に失敗しました:', quotationError);
          }
        }

        // レスポンスデータを正しい形式に変換
        const formattedData = {
          ...formatData(response.data),
          project_id: response.data.project_id || 1,
        };

        setData(formattedData);
      } catch (error: any) {
        // 404エラーの場合、または書類は存在するが明細データがない場合は新規作成
        if (error.response?.status === 404 || (error.response?.data && !error.response.data.details?.length)) {
          // 現在の書類から必要なデータを取得
          const currentDetails = data?.details?.map(detail => ({
            detailId: -1,  // 新規明細として扱う
            productId: detail.product_id,
            productName: detail.productName,
            quantity: detail.quantity,
            unit: detail.unit,
            unitPrice: detail.unitPrice,
            amount: detail.amount
          })) || [];

          const createData: DocumentFormData = {
            project_id: Number(id),
            type: type === '見積書' ? '見積書' : '請求書',
            document_number: `${type === '見積書' ? 'QT' : 'IV'}-${new Date().getTime()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            issue_date: new Date(),
            subtotal: data?.subtotal || 0,
            tax_amount: data?.tax_amount || 0,
            total_amount: data?.total_amount || 0,
            status: 'draft',
            details: currentDetails
          };

          const createResponse = await (type === '見積書'
            ? documentsApi.createQuotation(createData)
            : documentsApi.createInvoice(createData));

          if (!createResponse) {
            throw new Error('書類の作成に失敗しました');
          }

          // 作成したデータを取得
          const newResponse = await fetchDocument(id);
          if (!newResponse) {
            throw new Error('作成した書類の取得に失敗しました');
          }

          const formattedData = {
            ...formatData(newResponse.data),
            project_id: Number(newResponse.projectId || newResponse.project_id || 1),
            project: data?.project || {
              name: '',
              customer: {
                name: '',
                postal_code: '',
                address: ''
              }
            }
          };

          setData(formattedData);
          setSnackbarMessage('新しい書類を作成しました');
          setOpenSnackbar(true);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('=== データ取得エラー ===');
      console.error('Error details:', error);
      setError('データの取得中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedData: Document) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('=== 保存処理開始（親コンポーネント） ===');
      console.log('受け取ったデータ:', updatedData);
      console.log('現在のドキュメントタイプ:', documentType);

      // 必須フィールドの検証
      if (!updatedData.project_id || updatedData.project_id === 0) {
        throw new Error('無効なproject_id');
      }

      // detailsの検証
      if (!updatedData.details || updatedData.details.length === 0) {
        throw new Error('明細が存在しません');
      }

      // 更新用のデータを準備
      const formattedDetails = updatedData.details.map(detail => {
        // 基本の明細データ
        const baseDetail = {
          productId: detail.product_id || 0,
          productName: detail.productName,
          quantity: Number(detail.quantity),
          unit: detail.unit || '個',
          unitPrice: Number(detail.unitPrice),
          amount: Number(detail.quantity) * Number(detail.unitPrice)
        };

        // 既存明細の場合のみdetailIdを追加
        if (detail.detail_id && detail.detail_id > 0) {
          return {
            ...baseDetail,
            detailId: detail.detail_id
          };
        }
        
        // 新規明細の場合はdetailIdを含めない
        return baseDetail;
      });

      console.log('=== API送信データ ===');

      if (documentType === '見積書') {
        const quotationData = {
          quotationId: Number(id),
          details: formattedDetails,
          taxAmount: updatedData.tax_amount,
          totalAmount: updatedData.total_amount,
          notes: updatedData.notes === null ? undefined : updatedData.notes
        };
        console.log('見積書の更新を実行');
        console.log('送信データ:', JSON.stringify(quotationData, null, 2));
        await documentsApi.updateQuotation(id, quotationData);
      } else {
        const invoiceData = {
          invoiceId: Number(id),
          details: formattedDetails,
          taxAmount: updatedData.tax_amount,
          totalAmount: updatedData.total_amount,
          notes: updatedData.notes === null ? undefined : updatedData.notes
        };
        console.log('請求書の更新を実行');
        console.log('送信データ:', JSON.stringify(invoiceData, null, 2));
        await documentsApi.updateInvoice(id, invoiceData);
      }

      // 保存成功後の処理
      setSnackbarMessage('保存が完了しました');
      setOpenSnackbar(true);
      setIsEditing(false);

      // データを再取得
      await fetchData();

    } catch (error) {
      console.error('保存エラー:', error);
      setError('保存中にエラーが発生しました');
      setSnackbarMessage('保存に失敗しました');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDownloadPDF = async () => {
    if (!data || !previewRef.current) return;

    try {
      setIsGeneratingPDF(true);

      const originalElement = previewRef.current;
      
      // プレビュー要素のクローンを作成
      const element = originalElement.cloneNode(true) as HTMLElement;
      document.body.appendChild(element);
      
      // クローンしたプレビュー要素のスタイルを調整
      element.style.position = 'fixed';
      element.style.top = '-9999px';
      element.style.backgroundColor = '#FFFFFF';
      element.style.padding = '5mm';
      element.style.width = '210mm';
      element.style.height = '297mm';
      element.style.margin = '0';
      element.style.boxShadow = 'none';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: 793.7,
        windowHeight: 1122.5,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
      });

      // クローンした要素を削除
      document.body.removeChild(element);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      
      // キャンバスのアスペクト比を維持しながらPDFに配置
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        210,
        297,
        undefined,
        'FAST'
      );
      
      // 日付をフォーマット
      const today = new Date();
      const dateStr = today.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '');
      
      // 顧客名を取得（なければ'無名'）
      const customerName = data.project?.customer?.name || '無名';
      
      // 書類種別を取得
      const docType = documentType === '見積書' ? '見積書' : '請求書';
      
      // ファイル名を構築（会社名_書類種別_日付）
      const fileName = [customerName, docType, dateStr].join('_') + '.pdf';

      pdf.save(fileName);
      setSnackbarMessage('PDFのダウンロードが完了しました');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('PDF generation error:', error);
      setError('PDFの生成中にエラーが発生しました。');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleTypeChange = async (event: React.MouseEvent<HTMLElement>, newType: '見積書' | '請求書' | null) => {
    if (newType !== null && newType !== documentType && data) {
      try {
        setIsLoading(true);
        setError(null);

        // 新しいパスを構築
        const newPath = `/projects/${id}/${newType === '見積書' ? 'quotation-preview' : 'invoice-preview'}`;
        router.push(newPath);

        // 新しい種類のドキュメントを取得
        const response = await (newType === '見積書' 
          ? documentsApi.getQuotation(id)
          : documentsApi.getInvoice(id));

        if (response) {
          // レスポンスデータを正しい形式に変換
          const formattedData = {
            ...formatData(response.data),
            project_id: response.data.project_id || data.project_id || 0
          };
          setData(formattedData);
          setDocumentType(newType);
        }
      } catch (error) {
        console.error('ドキュメント取得エラー:', error);
        setError('ドキュメントの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveClick = async () => {
    if (!data) return;
    await handleSave(data);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <FeedbackMessage message={error} type="error" />;
  }

  if (!data) {
    return <FeedbackMessage message="データが見つかりませんでした。" type="error" />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
        >
          戻る
        </Button>

        <Stack direction="row" spacing={2} alignItems="center">
          <StyledToggleButtonGroup
            value={documentType}
            exclusive
            onChange={handleTypeChange}
            aria-label="document type"
          >
            <ToggleButton value="見積書">見積書</ToggleButton>
            <ToggleButton value="請求書">請求書</ToggleButton>
          </StyledToggleButtonGroup>

          <Button
            variant="contained"
            startIcon={isEditing ? <Save /> : <Edit />}
            onClick={isEditing ? handleSaveClick : handleEdit}
            color={isEditing ? "success" : "primary"}
            disabled={isGeneratingPDF}
          >
            {isEditing ? '保存' : '編集'}
          </Button>

          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={handleCancel}
            sx={{ display: isEditing ? 'inline-flex' : 'none' }}
          >
            キャンセル
          </Button>

          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF || isEditing}
          >
            PDF出力
          </Button>
        </Stack>
      </Box>

      <Box ref={previewRef}>
        <DocumentPreview
          type={documentType}
          data={data}
          project_id={data.project_id}
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onError={(message) => {
            setSnackbarMessage(message);
            setOpenSnackbar(true);
          }}
        />
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Container>
  );
} 