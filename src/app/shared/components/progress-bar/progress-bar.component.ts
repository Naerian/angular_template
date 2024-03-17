import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ProgressBarSize } from './models/progress-bar.entity';

/**
 * @name
 * neo-progress-bar
 * @description
 * Componente para crear una barra de progreso
 * @example
 * <neo-progress-bar [progressNumber]="50" [color]="'#03a9d5'" [height]="'10px'"></neo-progress-bar>
 */
@Component({
  selector: 'neo-progress-bar',
  templateUrl: './progress-bar.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {

  @Input() progressNumber: number = -1; // Valor de progreso (porcentaje)
  @Input() progressSplit: Array<number> = [-1, -1]; // Valor de progreso dividido en dos partes (partido)
  @Input() isProgressInteger?: boolean = true; // Para mostrar el valor como un entero o como decimal cuando se usa la variable `progressNumber`
  @Input() showProgress?: boolean = true; // Para mostrar el valor del progreso
  @Input() valueInside?: boolean = true; // Para mostrar el valor del progreso dentro de la barra
  @Input() color?: string = ''; // Color de la barra de progreso
  @Input() size?: ProgressBarSize = 'm'; // Tamaño de la barra de progreso
  @Input() title?: string = ''; // Título de la barra de progreso

  progressValue: string = '';
  progressBarWidth: number = 0;

  ngOnInit(): void {
    this.progressValueCalculation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.progressValueCalculation();
  }

  progressValueCalculation() {
    // Se calcula el progreso y se obtiene un valor. Dicho valor aparecerá en:
    // - x% (porcentaje): Si la variable "progressInputs" solo tiene un valor
    // - x/y (partido): Si la variable "progressInputs" tiene dos valores
    if (this.progressNumber !== -1) {

      this.progressBarWidth = Number(this.progressNumber);

      if (!Number.isNaN(this.progressBarWidth)) {

        // Comprobamos si el progreso va a ser mostrado como un entero o con decimales
        if (this.isProgressInteger) {
          this.progressValue = `${Math.round(parseFloat(String(this.progressNumber)))} %`;
        } else {
          this.progressValue = `${parseFloat(String(this.progressNumber)).toFixed(2)} %`;
        }
      } else {
        this.progressBarWidth = 0;
        this.progressValue = `0 %`;
      }
    } else if (this.progressSplit?.length >= 2) {
      if (
        !Number.isNaN(this.progressSplit[0]) &&
        !Number.isNaN(this.progressSplit[1])
      ) {
        this.progressBarWidth =
          (100 * Number(this.progressSplit[0])) /
          Number(this.progressSplit[1]);
        this.progressValue =
          this.progressSplit[0] + ' / ' + this.progressSplit[1];
      } else {
        this.progressBarWidth = 0;
        this.progressValue = `0 / 0`;
      }
    } else {
      this.progressBarWidth = 0;
      this.progressValue = `0 %`;
    }
  }
}
