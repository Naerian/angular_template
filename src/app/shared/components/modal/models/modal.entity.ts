import { MatDialogConfig } from "@angular/material/dialog";

export interface ModalOptionsEntity extends MatDialogConfig {
  title?: string;
  iconTitle?: string;
  id?: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
  height?: string;
  minHeight?: string;
  width?: string;
  minWidth?: string;
  canBeClosed?: boolean;
  disableClose?: boolean;
  position?: { top?: string; bottom?: string; right?: string; left?: string };
  data?: any;
}
