import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  DeleteOutline
} from '@mui/icons-material';
import { PurchaseOrder } from '@/app/types/purchase';
import { MenuDialogProps, ConfirmDialogProps } from '@/app/types/components/features/purchases/DialogComponents';

export function MenuDialog({
  open,
  onClose,
  onApprove,
  onReject,
  onDelete,
  selectedPurchase
}: MenuDialogProps) {
  return (
    <Menu
      open={open}
      onClose={onClose}
    >
      {selectedPurchase?.status === 'pending' && selectedPurchase?.approval_status === 'pending' && (
        <>
          <MenuItem onClick={onApprove}>
            <ListItemIcon>
              <CheckCircle fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>承認</ListItemText>
          </MenuItem>
          <MenuItem onClick={onReject}>
            <ListItemIcon>
              <Cancel fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>却下</ListItemText>
          </MenuItem>
        </>
      )}
      {selectedPurchase?.status === 'pending' && (
        <MenuItem onClick={onDelete}>
          <ListItemIcon>
            <DeleteOutline fontSize="small" />
          </ListItemIcon>
          <ListItemText>削除</ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  title,
  content,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>キャンセル</Button>
        <Button onClick={onConfirm} color="error">削除</Button>
      </DialogActions>
    </Dialog>
  );
}

const DialogComponents = {
  MenuDialog,
  ConfirmDialog
};

export default DialogComponents; 