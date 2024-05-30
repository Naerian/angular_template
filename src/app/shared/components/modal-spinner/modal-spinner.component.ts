import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../button/button.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { SectionTitleComponent } from '../section-title/section-title.component';
import { ModalSpinnerEntity } from './models/modal-spinner.entity';

@Component({
  selector: 'neo-modal-spinner',
  standalone: true,
  imports: [CommonModule, ButtonComponent, SpinnerComponent, SectionTitleComponent, TranslateModule, MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './modal-spinner.component.html',
  styleUrl: './modal-spinner.component.scss'
})
export class ModalSpinnerComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalSpinnerEntity,
    private readonly matDilogRef: MatDialogRef<ModalSpinnerComponent>,
  ) { }

  /**
   * Función para cerrar el modal
   * @param {boolean} status
   */
  public close(status: boolean = true) {
    this.matDilogRef.close(status);
  }

}
