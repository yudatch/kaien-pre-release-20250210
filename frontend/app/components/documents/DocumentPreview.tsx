import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  styled,
  TextField,
  IconButton,
  Button,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { useRouter } from 'next/navigation';
import {
  Document,
  DocumentDetail,
  DocumentPreviewProps,
  DocumentPreviewActionsProps,
  UpdateDocumentDetail,
  TaxCalculationType
} from '@/app/types/models/document';
import { DOCUMENT_TYPE_LABELS } from '@/app/constants/document';
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { validateDocument } from '@/app/utils/validation';
import { formatDocumentAmount, calculateDetailAmount, recalculateDocumentAmounts, createNewDetail } from '@/app/utils/documents';
import { DocumentStyles } from './styles/DocumentStyles';

// APIに送信するデータの型定義
interface ApiDocumentDetail {
  detailId?: number;
  productId: number;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  quotationDetailId?: number;
  invoiceDetailId?: number;
}

// 金額フォーマット関数を追加
const formatAmount = (amount: string | number | undefined): string => {
  if (amount === undefined) return '0';
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '0';
  return new Intl.NumberFormat('ja-JP', { maximumFractionDigits: 0 }).format(numAmount);
};

// スタイル付きコンポーネントの定義
const DocumentHeader = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: 500,
  marginBottom: theme.spacing(1),
  borderBottom: `3px solid ${theme.palette.grey[800]}`,
  paddingBottom: theme.spacing(0.5),
  fontFamily: '"Noto Sans JP", "Helvetica", "Arial", sans-serif',
  letterSpacing: '0.02em',
  color: theme.palette.common.black
}));

const DocumentNumber = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  fontFamily: '"Roboto Mono", monospace',
  letterSpacing: '0.1em',
  fontSize: '1rem'
}));

const CompanyInfo = styled(Box)(({ theme }) => ({
  textAlign: 'right',
  '& .MuiTypography-root': {
    lineHeight: 1.5,
    fontFamily: '"Noto Sans JP", "Helvetica", "Arial", sans-serif',
    letterSpacing: '0.05em',
    fontSize: '0.9rem'
  }
}));

const CompanySeal = styled(Box)(({ theme }) => ({
  width: '70px',
  height: '70px',
  border: `2px solid ${theme.palette.grey[400]}`,
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  marginTop: theme.spacing(2),
  position: 'relative',
  '&::after': {
    content: '"認印"',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '1rem',
    color: theme.palette.grey[600],
    fontFamily: '"Noto Serif JP", serif',
    letterSpacing: '0.1em'
  }
}));

const TotalAmount = styled(Typography)(({ theme }) => ({
  fontSize: '2.4rem',
  fontWeight: 500,
  color: theme.palette.grey[900],
  borderBottom: `2px solid ${theme.palette.grey[800]}`,
  paddingBottom: theme.spacing(1),
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  letterSpacing: '0.02em'
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.grey[100],
    fontWeight: 500,
    fontSize: '0.85rem',
    padding: '8px',
    letterSpacing: '0.05em',
    fontFamily: '"Noto Sans JP", "Helvetica", "Arial", sans-serif',
    color: theme.palette.common.black
  },
  '& .MuiTableCell-body': {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    fontSize: '0.85rem',
    padding: '8px',
    letterSpacing: '0.05em',
    fontFamily: '"Noto Sans JP", "Helvetica", "Arial", sans-serif',
    color: theme.palette.common.black,
    '&[align="right"]': {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      letterSpacing: '0.1em'
    }
  }
}));

export function DocumentPreview({ type, data, project_id, isEditing, onEdit, onSave, onCancel, onError }: DocumentPreviewProps) {
  const router = useRouter();
  const [editedData, setEditedData] = useState<Document | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [taxCalculationType, setTaxCalculationType] = useState<TaxCalculationType>(data.tax_calculation_type || '内税');

  useEffect(() => {
    if (isEditing) {
      console.log('初期データ設定 - 元のデータ:', data);
      const initialData = {
        ...data,
        details: data.details.map(detail => {
          console.log('初期データ設定 - 明細データ:', detail);
          return {
            detail_id: detail.detail_id,
            product_id: detail.product_id,
            productName: detail.productName,
            quantity: Number(detail.quantity),
            unit: detail.unit || '',
            unitPrice: Number(detail.unitPrice),
            amount: Number(detail.amount)
          };
        }),
        tax_calculation_type: taxCalculationType
      };
      console.log('初期データ設定 - 変換後:', initialData);
      const { subtotal, tax_amount, total_amount } = calculateAmounts(initialData.details);
      setEditedData({
        ...initialData,
        subtotal,
        tax_amount,
        total_amount
      });
      const errors = validateDocument(data);
      setValidationErrors(errors);
    }
  }, [isEditing, data, taxCalculationType]);

  const handleTaxCalculationTypeChange = (event: React.MouseEvent<HTMLElement>, newType: TaxCalculationType | null) => {
    if (newType !== null) {
      // 新しいパスを構築
      const documentPath = type === '見積書' ? 'quotation-preview' : 'invoice-preview';
      const newPath = `/projects/${project_id}/${documentPath}`;
      
      // 新しいページに遷移（完全なリロードを強制）
      router.push(newPath);
    }
  };

  const calculateAmounts = (details: DocumentDetail[]) => {
    const detailsTotal = details.reduce((sum, detail) => sum + Math.floor(Number(detail.amount)), 0);
    
    if (taxCalculationType === '内税') {
      // 内税の場合：
      // 1. 合計金額（税込）= 明細合計
      // 2. 税抜金額 = 合計金額 ÷ (1 + 税率)
      // 3. 消費税 = 合計金額 - 税抜金額
      const taxRate = 0.1;
      const total_amount = detailsTotal;
      const subtotal = Math.floor(total_amount / (1 + taxRate));
      const tax_amount = total_amount - subtotal;

      return {
        subtotal,
        tax_amount,
        total_amount
      };
    } else {
      // 外税の場合：
      // 1. 税抜金額 = 明細合計
      // 2. 消費税 = 税抜金額 × 税率
      // 3. 合計金額 = 税抜金額 + 消費税
      const subtotal = detailsTotal;
      const tax_amount = Math.floor(subtotal * 0.1);
      const total_amount = subtotal + tax_amount;

      return {
        subtotal,
        tax_amount,
        total_amount
      };
    }
  };

  const handleDetailChange = (index: number, field: keyof DocumentDetail, value: string | number) => {
    if (!editedData) return;

    console.log('変更前のデータ:', editedData.details[index]);
    console.log('変更するフィールド:', field);
    console.log('変更する値:', value);

    const updatedDetails = editedData.details.map((detail, i) => {
      if (i === index) {
        const updatedDetail = { ...detail };
        
        switch (field) {
          case 'productName':
            updatedDetail.productName = value as string;
            break;
          case 'unit':
            console.log('unit変更前:', updatedDetail.unit);
            updatedDetail.unit = String(value);
            console.log('unit変更後:', updatedDetail.unit);
            break;
          case 'quantity':
            updatedDetail.quantity = Number(value) || 0;
            updatedDetail.amount = calculateDetailAmount(Number(value) || 0, updatedDetail.unitPrice);
            break;
          case 'unitPrice':
            updatedDetail.unitPrice = Number(value) || 0;
            updatedDetail.amount = calculateDetailAmount(updatedDetail.quantity, Number(value) || 0);
            break;
        }
        
        console.log('更新後の明細:', updatedDetail);
        return updatedDetail;
      }
      return { ...detail };
    });

    const { subtotal, tax_amount, total_amount } = calculateAmounts(updatedDetails);
    const newEditedData = {
      ...editedData,
      details: updatedDetails,
      subtotal,
      tax_amount,
      total_amount,
      tax_calculation_type: taxCalculationType
    };

    // リアルタイムバリデーション
    const errors = validateDocument(newEditedData);
    setValidationErrors(errors);

    console.log('更新後の全データ:', newEditedData);
    setEditedData(newEditedData);
  };

  const handleAddDetail = () => {
    if (!editedData) return;

    try {
      if (editedData.details.length >= 50) {
        throw new Error('明細は最大50件までです');
      }

      const updatedDetails = [...editedData.details, createNewDetail()];
      const { subtotal, tax_amount, total_amount } = calculateAmounts(updatedDetails);

      const newEditedData = {
        ...editedData,
        details: updatedDetails,
        subtotal,
        tax_amount,
        total_amount,
        tax_calculation_type: taxCalculationType
      };

      const errors = validateDocument(newEditedData);
      setValidationErrors(errors);
      setEditedData(newEditedData);
    } catch (error) {
      console.error('明細追加エラー:', error);
      if (onError) {
        onError(error instanceof Error ? error.message : '明細の追加に失敗しました');
      }
    }
  };

  const handleDeleteDetail = (index: number) => {
    if (!editedData) return;

    try {
      const updatedDetails = editedData.details.filter((_, i) => i !== index);
      const { subtotal, tax_amount, total_amount } = calculateAmounts(updatedDetails);

      const newEditedData = {
        ...editedData,
        details: updatedDetails,
        subtotal,
        tax_amount,
        total_amount
      };

      setEditedData(newEditedData);
    } catch (error) {
      console.error('明細削除エラー:', error);
      if (onError) {
        onError(error instanceof Error ? error.message : '明細の削除に失敗しました');
      }
    }
  };

  const handleSaveClick = () => {
    if (!editedData || !onSave) return;

    const errors = validateDocument(editedData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      if (onError) {
        onError(Object.values(errors)[0]);
      }
      return;
    }

    onSave(editedData);
  };

  if (!data) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>データを読み込み中...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={DocumentStyles.container}>
      <Box sx={DocumentStyles.header}>
        <Box>
          <Typography sx={DocumentStyles.documentTitle}>
            {type}
          </Typography>
          {(isEditing && editedData ? editedData.project?.customer?.name : data.project?.customer?.name) && (
            <Typography sx={DocumentStyles.customerName}>
              {isEditing && editedData ? editedData.project?.customer?.name : data.project?.customer?.name} 御中
            </Typography>
          )}
          {(isEditing && editedData ? editedData.project?.customer?.postal_code : data.project?.customer?.postal_code) && (isEditing && editedData ? editedData.project?.customer?.address : data.project?.customer?.address) && (
            <Typography sx={DocumentStyles.customerAddress}>
              〒{isEditing && editedData ? editedData.project?.customer?.postal_code : data.project?.customer?.postal_code}
            </Typography>
          )}
          {(isEditing && editedData ? editedData.project?.customer?.address : data.project?.customer?.address) && (
            <Typography sx={DocumentStyles.customerAddress}>
              {isEditing && editedData ? editedData.project?.customer?.address : data.project?.customer?.address}
            </Typography>
          )}
        </Box>
        <CompanyInfo>
          <Typography variant="h6" sx={DocumentStyles.companyName}>
            {process.env.NEXT_PUBLIC_COMPANY_NAME}
          </Typography>
          {process.env.NEXT_PUBLIC_COMPANY_POSTAL_CODE && (
            <Typography sx={DocumentStyles.companyPostalCode}>
              〒{process.env.NEXT_PUBLIC_COMPANY_POSTAL_CODE}
            </Typography>
          )}
          {process.env.NEXT_PUBLIC_COMPANY_ADDRESS && (
            <Typography sx={DocumentStyles.companyAddress}>
              {process.env.NEXT_PUBLIC_COMPANY_ADDRESS}
            </Typography>
          )}
          {process.env.NEXT_PUBLIC_COMPANY_PHONE && (
            <Typography sx={DocumentStyles.companyPhone}>
              TEL: {process.env.NEXT_PUBLIC_COMPANY_PHONE}
            </Typography>
          )}
          {type === '請求書' && process.env.NEXT_PUBLIC_COMPANY_TAX_ID && (
            <Typography sx={DocumentStyles.companyTaxId}>
              適格請求書発行事業者 登録番号： {process.env.NEXT_PUBLIC_COMPANY_TAX_ID}
            </Typography>
          )}
          <CompanySeal />
        </CompanyInfo>
      </Box>

      <Box sx={DocumentStyles.totalAmount}>
        <Typography align="right" sx={DocumentStyles.totalAmountText}>
          ¥{formatDocumentAmount(isEditing && editedData ? editedData.total_amount : data.total_amount)}
        </Typography>
      </Box>

      {isEditing && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <ToggleButtonGroup
            value={taxCalculationType}
            exclusive
            onChange={handleTaxCalculationTypeChange}
            aria-label="税金計算方式"
            size="small"
          >
            <ToggleButton value="外税">
              外税（10%）
            </ToggleButton>
            <ToggleButton value="内税">
              内税（10%）
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      <TableContainer component={Paper} sx={DocumentStyles.tableContainer}>
        <Box sx={DocumentStyles.tableHeader}>
          <Typography variant="h6">明細</Typography>
          {isEditing && (
            <Button
              variant="outlined"
              onClick={handleAddDetail}
              startIcon={<AddIcon />}
            >
              明細追加
            </Button>
          )}
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>商品名</TableCell>
              <TableCell align="right">数量</TableCell>
              <TableCell>単位</TableCell>
              <TableCell align="right">単価</TableCell>
              <TableCell align="right">金額</TableCell>
              {isEditing && <TableCell align="center">操作</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {(isEditing ? editedData?.details : data.details)?.map((detail, index) => (
              <TableRow key={index}>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      value={detail.productName}
                      onChange={(e) => handleDetailChange(index, 'productName', e.target.value)}
                      size="small"
                      fullWidth
                      error={!!validationErrors[`details.${index}.productName`]}
                    />
                  ) : (
                    detail.productName
                  )}
                </TableCell>
                <TableCell align="right">
                  {isEditing ? (
                    <TextField
                      value={detail.quantity}
                      onChange={(e) => handleDetailChange(index, 'quantity', e.target.value)}
                      size="small"
                      type="number"
                    />
                  ) : (
                    formatAmount(detail.quantity)
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      value={detail.unit}
                      onChange={(e) => {
                        console.log('単位変更:', e.target.value);
                        handleDetailChange(index, 'unit', e.target.value);
                      }}
                      size="small"
                      error={!!validationErrors[`details.${index}.unit`]}
                      helperText={validationErrors[`details.${index}.unit`]}
                    />
                  ) : (
                    detail.unit
                  )}
                </TableCell>
                <TableCell align="right">
                  {isEditing ? (
                    <TextField
                      value={detail.unitPrice}
                      onChange={(e) => handleDetailChange(index, 'unitPrice', e.target.value)}
                      size="small"
                      type="number"
                    />
                  ) : (
                    formatAmount(detail.unitPrice)
                  )}
                </TableCell>
                <TableCell align="right">{formatAmount(detail.amount)}</TableCell>
                {isEditing && (
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteDetail(index)}
                      disabled={editedData?.details.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right">小計</TableCell>
              <TableCell align="right">¥{formatAmount(isEditing && editedData ? editedData.subtotal : data.subtotal)}</TableCell>
              {isEditing && <TableCell />}
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} align="right">
                消費税（10%）{taxCalculationType === '内税' ? '（内税）' : ''}
              </TableCell>
              <TableCell align="right">¥{formatAmount(isEditing && editedData ? editedData.tax_amount : data.tax_amount)}</TableCell>
              {isEditing && <TableCell />}
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} align="right">合計</TableCell>
              <TableCell align="right">¥{formatAmount(isEditing && editedData ? editedData.total_amount : data.total_amount)}</TableCell>
              {isEditing && <TableCell />}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {type === '請求書' && (
        <Box sx={DocumentStyles.notes}>
          <Typography>
            ※ この請求書は、適格請求書等保存方式（インボイス制度）に対応した請求書です。
          </Typography>
          <Typography>
            ※ お振込手数料は貴社にてご負担願います。
          </Typography>
          {data.payment_info && (
            <Box sx={{ mt: 2, borderTop: '1px solid #ccc', pt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                お振込先
              </Typography>
              <Typography>
                {data.payment_info.bank_name} {data.payment_info.branch_name}支店
              </Typography>
              <Typography>
                {data.payment_info.account_type} {data.payment_info.account_number}
              </Typography>
              <Typography>
                口座名義: {data.payment_info.account_holder}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {isEditing && (
        <Box sx={DocumentStyles.actionButtons}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={onCancel}
          >
            キャンセル
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveClick}
            disabled={Object.keys(validationErrors).length > 0}
          >
            保存
          </Button>
        </Box>
      )}

      {Object.keys(validationErrors).length > 0 && (
        <Box sx={DocumentStyles.errorMessage}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {Object.values(validationErrors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
}