import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalOptionsEntity } from '@shared/components/modal/models/modal.entity';
import { ModalDialogService } from '@shared/components/modal/services/modal-dialog.service';
import { ModalSpinnerComponent } from '../modal-spinner.component';
import { ModalSpinnerEntity } from '../models/modal-spinner.entity';

@Injectable({
  providedIn: 'root'
})
export class ModalSpinnerService {

  constructor(
    private readonly _modalDialogService: ModalDialogService,
  ) { }

  /**
  * Método para abrir el modal de spinner
  */
  openSpinnerModal(data?: ModalSpinnerEntity): MatDialogRef<ModalSpinnerComponent> {

    // Creando objeto de opciones para el modal de spinner
    const options: ModalSpinnerEntity = {
      title: data?.title,
      disableClose: data?.disableClose !== undefined ? data?.disableClose : true,
      canBeClosed: data?.canBeClosed !== undefined ? data?.canBeClosed : true,
      width: data?.width || 'auto',
      height: data?.height || 'auto',
      data: {
        label: data?.label || '',
        iconTitle: data?.iconTitle || '',
      }
    };

    // Abriendo modal de spinner para mostrar que se está generando el PDF
    const spinnerDialog: MatDialogRef<ModalSpinnerComponent> = this._modalDialogService.open(options, ModalSpinnerComponent);

    return spinnerDialog;
  }
}
