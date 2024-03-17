import { Component, ElementRef, Input, ViewChild } from '@angular/core';

/**
 * @name
 * neo-option
 * @description
 * Componente para crear una opción en el componente `neo-select`.
 * @example
 * <neo-option [value]="1" [selected]="true" [disabled]="false">Opción 1</neo-option>
 */
@Component({
  selector: 'neo-option',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent {

  @ViewChild('content') content!: ElementRef;
  @Input() value!: any;
  @Input() selected?: any = false;
  @Input() disabled?: boolean = false;
  label?: string = '';

  ngAfterContentInit(): void {
    // Obtenemos el contenido de la etiqueta <neo-option> para asignarlo a la propiedad label
    setTimeout(() => this.label = this.content.nativeElement.innerHTML, 0);
  }
}
