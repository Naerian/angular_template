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

    // Creando objeto de datos para el modal de spinner
    const dataSpinner = data as ModalSpinnerEntity;
    dataSpinner.title = data?.title || ''; // Título del modal de spinner
    dataSpinner.label = data?.label || ''; // Etiqueta del modal de spinner
    dataSpinner.iconTitle = data?.iconTitle || ''; // Icono del título del modal de spinner
    dataSpinner.canBeClosed = data?.canBeClosed || true; // Por defecto se puede cerrar el modal de spinner pulsando el botón de Cancelar o Cerrar
    dataSpinner.disableClose = data?.disableClose || true; // Por defecto no se puede cerrar el modal de spinner usando el backdrop o la tecla "ESC"

    // Creando objeto de opciones para el modal de spinner
    const options: ModalOptionsEntity = {
      disableClose: dataSpinner.disableClose,
      canBeClosed: dataSpinner.canBeClosed,
      data: dataSpinner
    };

    // Abriendo modal de spinner para mostrar que se está generando el PDF
    const spinnerDialog: MatDialogRef<ModalSpinnerComponent> = this._modalDialogService.open(options, ModalSpinnerComponent);

    return spinnerDialog;
  }
}
