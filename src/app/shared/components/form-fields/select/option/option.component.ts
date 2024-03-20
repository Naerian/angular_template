import { Component, ElementRef, Inject, Input, Optional, ViewChild, ViewEncapsulation, WritableSignal, booleanAttribute, signal } from '@angular/core';
import { NEO_OPTION_GROUPS, OptionGroupsComponent } from '../option-groups/option-groups.component';
import { NEO_SELECT, SelectComponent } from '../select.component';

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
  templateUrl: './option.component.html',
  styleUrl: './option.component.scss',
  host: {
    '[class.neo-select__dropdown__options__option]': 'true',
    '[class.neo-select__dropdown__options__option--hidden]': 'isHideBySearch()',
    '[class.neo-select__dropdown__options__option--selected]': 'selected',
    '[class.neo-select__dropdown__options__option--disabled]': 'disabled',
    '[attr.aria-selected]': 'isSelected()', // Atributo para indicar si la opción está seleccionada
    '[attr.aria-disabled]': 'disabled', // Atributo para indicar si la opción está deshabilitada
    '[attr.aria-hidden]': 'isHideBySearch()', // Atributo para indicar si la opción está oculta por la búsqueda
    '[attr.aria-label]': 'getLabelText()', // Atributo para indicar el texto de la opción
    '(click)': 'toggleSelectOption()', // Evento para seleccionar o deseleccionar la opción
    '(keydown.enter)': 'toggleSelectOption()', // Evento para seleccionar o deseleccionar la opción
    '(keydown.space)': 'toggleSelectOption()', // Evento para seleccionar o deseleccionar la opción
    '[tabindex]': 'disabled ? -1 : 0' // Atributo para poder seleccionar la opción con el teclado
  },
  encapsulation: ViewEncapsulation.None
})
export class OptionComponent {

  /**
   * Referencia al elemento que contiene el texto de la opción
   */
  @ViewChild('optionLabel') optionLabel: ElementRef<HTMLElement> | undefined;

  /**
   * Input para definir si la opción está deshabilitada
   */
  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    return (this.groupOption && this.groupOption.disabled) || this._disabled();
  }
  set disabled(value: boolean) {
    this._disabled.set(value);
  }

  /**
   * Input para definir si la opción está seleccionada
   */
  @Input({ transform: booleanAttribute })
  get selected(): boolean {
    return this._selected();
  }
  set selected(value: boolean) {
    this._selected.set(value);
  }

  @Input() value!: any;

  private _disabled: WritableSignal<boolean> = signal(false);
  private _selected: WritableSignal<boolean> = signal(false);
  private _hideBySearch: WritableSignal<boolean> = signal(false);
  private _labelText: string = '';
  private _labelHtml: string = '';
  private _elementRef: ElementRef;

  constructor(
    @Optional() @Inject(NEO_SELECT) private selectParent: SelectComponent,
    @Optional() @Inject(NEO_OPTION_GROUPS) private groupOption: OptionGroupsComponent,
    private readonly elementRef: ElementRef,
  ) {
    this._elementRef = elementRef;
  }

  ngAfterContentInit(): void {
    // Obtenemos el contenido para asignarlo a la propiedad label
    setTimeout(() => {
      this._labelHtml = this.optionLabel?.nativeElement.innerHTML || '';
      this._labelText = this.optionLabel?.nativeElement.textContent || '';
    }, 0);
  }

  /**
   * Método para seleccionar o deseleccionar una opción
   */
  toggleSelectOption(): void {
    if (this.disabled)
      return;

    if (this.selectParent.multiple) {
      this._selected.set(!this.selected);
    } else {
      this.selectParent.options.forEach(option => option.deselect());
      this.select();
    }

    // Actualizamos el valor del select padre
    this.selectParent.updateValue(this);
  }

  /**
   * Método para seleccionar una opción
   */
  select(): void {
    this._selected.set(true);
  }

  /**
   * Método para deseleccionar una opción
   */
  deselect(): void {
    this._selected.set(false);
  }

  /**
   * Método para obtener si la opción está seleccionada
   * @returns boolean
   */
  isSelected(): boolean {
    return this.selected || false;
  }

  /**
   * Método para ocultar la opción al buscar en el componente `neo-select`
   */
  hideOptionBySearch(): void {
    this._hideBySearch.set(true);
  }

  /**
   * Método para mostrar la opción al buscar en el componente `neo-select`
   */
  showOptionBySearch(): void {
    this._hideBySearch.set(false);
  }

  /**
   * Método para obtener si la opción está oculta al buscar en el componente `neo-select`
   * @returns boolean
   */
  isHideBySearch(): boolean {
    return this._hideBySearch();
  }

  /**
   * Método para obtener el texto de la opción sin etiquetas HTML
   * @returns string
   */
  getLabelText(): string {
    return this._labelText;
  }

  /**
   * Método para obtener el texto de la opción con etiquetas HTML
   * @returns string
   */
  getLabelHtml(): string {
    return this._labelHtml;
  }

  /**
   * Método para obtener el `ElementRef` del componente
   * @returns {ElementRef}
   */
  getElementRef(): ElementRef {
    return this._elementRef;
  }

}
