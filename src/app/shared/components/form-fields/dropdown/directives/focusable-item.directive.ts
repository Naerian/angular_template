import { FocusableOption } from '@angular/cdk/a11y';
import { Directive, ElementRef, Input } from '@angular/core';

/**
 * @name FocusableItemDirective
 * @description Esta directiva permite que un elemento sea enfocable y se pueda utilizar en un menú desplegable o lista de opciones.
 * Implementa la interfaz FocusableOption para integrarse con el CDK de Angular.
 * La utilizaremos en los elementos de las opciones del dropdown que se generan en el componente
 * para que sean accesibles y enfocados correctamente. De esta forma podremos usar "KeyManager" del CDK
 * para navegar por las opciones del dropdown y enfocarlas correctamente. Además con "getLabel" podemos obtener la etiqueta
 * de la opción para su uso en accesibilidad cuando se escribe por teclado.
 * @example
 * <div focusableItem [label]="'Opción 1'">Opción 1</div>
 * <div focusableItem [label]="'Opción 2'>Opción 2</div>
 */
@Directive({
  selector: '[focusableItem]',
  exportAs: 'focusableItem',
  standalone: true,
})
export class FocusableItemDirective implements FocusableOption {
  @Input() label = '';
  @Input() disabled = false;

  constructor(private el: ElementRef<HTMLElement>) {}

  get elementRef(): ElementRef<HTMLElement> {
    return this.el;
  }

  focus(): void {
    this.el.nativeElement.focus();
  }

  getLabel(): string {
    return this.label || this.el.nativeElement.textContent?.trim() || '';
  }

  get isDisabled(): boolean {
    return this.disabled;
  }
}
