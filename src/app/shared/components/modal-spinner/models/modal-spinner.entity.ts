import { ModalOptionsEntity } from "@shared/components/modal/models/modal.entity";

export interface ModalSpinnerDataEntity {
  label?: string;
  iconTitle?: string;
}

export interface ModalSpinnerEntity extends ModalOptionsEntity {
  title?: string;
  label?: string;
  iconTitle?: string;
  canBeClosed?: boolean;
  disableClose?: boolean;
  data?: ModalSpinnerDataEntity;
}
