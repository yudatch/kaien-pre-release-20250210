import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Stack,
  Chip
} from '@mui/material';
import { Edit, LocalShipping, MoreVert } from '@mui/icons-material';
import Link from 'next/link';
import { PurchaseOrder } from '@/app/types/models/purchase';
import type { Column } from '@/app/types/components/table';
import { TableComponentsProps } from '@/app/types/components/features/purchases/TableComponents';

const statusConfig = {
  draft: { label: '下書き', color: 'default' },
  pending: { label: '発注待ち', color: 'warning' },
  ordered: { label: '発注済', color: 'info' },
  received: { label: '入荷済', color: 'success' },
  cancelled: { label: 'キャンセル', color: 'error' }
} as const;

export default function TableComponents({
  columns,
  data,
  onRowClick,
  onMenuOpen
}: TableComponentsProps) {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.label}
                align={column.align}
                sx={{ width: column.width }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((purchase) => (
            <TableRow
              key={purchase.order_id}
              hover
              onClick={() => onRowClick(purchase)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Link
                  href={`/purchases/${purchase.order_id}`}
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  {purchase.order_number}
                </Link>
              </TableCell>
              <TableCell>{purchase.Supplier.name}</TableCell>
              <TableCell>{new Date(purchase.order_date).toLocaleDateString('ja-JP')}</TableCell>
              <TableCell>{new Date(purchase.delivery_date).toLocaleDateString('ja-JP')}</TableCell>
              <TableCell>
                <Chip 
                  label={statusConfig[purchase.status].label}
                  color={statusConfig[purchase.status].color}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip 
                  label={
                    purchase.approval_status === 'approved' ? '承認済' :
                    purchase.approval_status === 'rejected' ? '却下' : '承認待ち'
                  }
                  color={
                    purchase.approval_status === 'approved' ? 'success' :
                    purchase.approval_status === 'rejected' ? 'error' : 'warning'
                  }
                  size="small"
                />
              </TableCell>
              <TableCell align="right">¥{purchase.total_amount.toLocaleString()}</TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="編集">
                    <IconButton 
                      size="small"
                      onClick={() => onRowClick(purchase)}
                      disabled={!(purchase.status === 'pending' && purchase.approval_status === 'pending')}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {purchase.status === 'ordered' && (
                    <Tooltip title="入荷登録">
                      <IconButton 
                        size="small"
                        onClick={() => onRowClick(purchase)}
                      >
                        <LocalShipping fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <IconButton
                    size="small"
                    onClick={(e) => onMenuOpen(e, purchase)}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 