import { Directive, ElementRef, Input } from '@angular/core';

/**
 * @name
 * neo-option
 * @description
 * Componente para crear una opción en el componente `neo-select`.
 * @example
 * <neo-option [value]="1" [selected]="true" [disabled]="false">Opción 1</neo-option>
 */
@Directive({
  selector: '[neo-option], neo-option',
  exportAs: 'neoOptions',
  standalone: true
})
export class OptionsDirective {

  @Input() value!: any;
  @Input() selected?: any = false;
  @Input() disabled?: boolean = false;
  label?: string = '';

  constructor(
    private readonly elementRef: ElementRef
  ) { }

  ngAfterContentInit(): void {
    // Obtenemos el contenido para asignarlo a la propiedad label
    setTimeout(() => this.label = this.elementRef.nativeElement.innerHTML, 0);
  }

}
