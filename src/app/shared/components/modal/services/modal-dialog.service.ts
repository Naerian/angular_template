import { ComponentType, Overlay } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ModalDialogComponent } from '../modal-dialog.component';
import { ModalOptionsEntity } from '../models/modal.entity';

@Injectable({
  providedIn: 'root',
})
export class ModalDialogService {

  dialogRef!: MatDialogRef<ModalDialogComponent>;

  constructor(
    private readonly overlay: Overlay,
    private readonly dialog: MatDialog
  ) { }

  /**
   * Método para abrir un modal
   * @param {ModalOptionsEntity | null} options
   * @param {ComponentType} component
   * @returns {MatDialogRef<ModalDialogComponent>}
   */
  open(options: ModalOptionsEntity | null = null, component?: ComponentType<any>): MatDialogRef<any> {

    const componentOrDialog = component ? component : ModalDialogComponent;
    let data = {} as any;

    if (component) {
      if (options?.data)
        data.data = { ...data, ...options.data };
      data.title = options?.title || '';
      data.iconTitle = options?.iconTitle || '';
      data.canBeClosed = options?.canBeClosed !== undefined ? options?.canBeClosed : true;
    } else {
      data = {
        title: options?.title || '',
        iconTitle: options?.iconTitle || '',
        message: options?.message || '',
        cancelText: options?.cancelText || '',
        confirmText: options?.confirmText || '',
        canBeClosed: options?.canBeClosed !== undefined ? options?.canBeClosed : true,
      }
    }

    return this.dialogRef = this.dialog.open(componentOrDialog, {
      scrollStrategy: this.overlay.scrollStrategies.noop(), // Deshabilita el scroll del body
      height: options?.height || 'auto', // Altura del modal
      width: options?.width || 'auto', // Ancho del modal
      minHeight: options?.minHeight, // Altura mínima del modal
      minWidth: options?.minWidth, // Ancho mínimo del modal
      maxHeight: options?.maxHeight || 'auto', // Altura máxima del modal
      maxWidth: options?.maxWidth || 'auto', // Ancho máximo del modal
      position: options?.position, // Posición del modal (top, bottom, left, right)
      id: options?.id || null, // Id del modal
      disableClose: options?.disableClose !== undefined ? options?.disableClose : true, // Deshabilita el cierre del modal al hacer click fuera
      data: data, // Datos que se pasan al modal (título, mensaje, texto de los botones, un objeto concreto, etc)
    } as MatDialogConfig);
  }

  /**
   * Método para comprobar si un modal está abierto por su id
   * @param {string} dialogId
   * @returns {boolean}
   */
  isDialogOpenById(dialogId: string): boolean {
    return this.dialog.getDialogById(dialogId) ? true : false;
  }

  /**
   * Método para cerrar un modal y devolver un observable con el resultado
   * @returns {Observable<any>}
   */
  afterClosed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(
      take(1),
      map((res) => {
        return res;
      })
    );
  }

  /**
   * Método para cerrar un modal
   */
  close() {
    this.dialogRef.close();
  }
}
