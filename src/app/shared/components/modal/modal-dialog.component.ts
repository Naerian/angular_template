import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ModalOptionsEntity } from './models/modal.entity';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeHtmlPipe } from '@shared/pipes/safeHtml/safe-html.pipe';
import { SectionTitleComponent } from '../section-title/section-title.component';

/**
 * @name
 * neo-modal-dialog
 * @description
 * Componente para crear un modal de texto mediante el servicio `modal-dialog.service`.
 * @example
 * const options: ModalOptionsEntity = {
 *     title: 'Título del modal',
 *     message: 'Cuerpo del modal',
 *     cancelText: 'Cancelar',
 *     confirmText: 'Aceptar',
 *     canBeClosed: true
 * };
 *
 * this._modalDialogService.open(options);
 *
 * this._modalDialogService.afterClosed()
 *     .subscribe((confirmed) => {
 *         if (confirmed)
 *           alert('Modal aceptado');
 *         else
 *           alert('Modal cancelado');
 * 	});
 */
@Component({
  selector: 'neo-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonComponent, SectionTitleComponent, TranslateModule, SafeHtmlPipe, MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose]
})
export class ModalDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalOptionsEntity,
    private readonly matDilogRef: MatDialogRef<ModalDialogComponent>
  ) { }

  /**
   * Función para cerrar el modal al pulsar la tecla `ESC`
   */
  @HostListener('keydown.esc')
  public onEsc() {
    this.close(false);
  }

  ngOnInit(): void {
    if (!this.data.canBeClosed)
      this.matDilogRef.disableClose = true;
  }

  /**
   * Función para cerrar el modal al pulsar el botón de cancelar que emite un evento con el valor `false`
   */
  public cancel() {
    this.close(false);
  }

  /**
   * Función para cerrar el modal al pulsar el botón de cerrar que emitirá true o false dependiendo del valor que se le pase
   * @param value
   */
  public close(value: boolean) {
    this.matDilogRef.close(value);
  }

  /**
   * Función para confirmar el modal al pulsar el botón de confirmar que emite un evento con el valor `true`
   */
  public confirm() {
    this.close(true);
  }
}
