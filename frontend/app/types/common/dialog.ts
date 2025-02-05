export interface MenuDialogProps<T = any> {
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  selectedItem?: T;
}

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
} 