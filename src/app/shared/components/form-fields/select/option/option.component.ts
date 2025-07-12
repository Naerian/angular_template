import { FocusableOption } from '@angular/cdk/a11y';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation,
  WritableSignal,
  booleanAttribute,
  inject,
  signal,
} from '@angular/core';
import { InputsUtilsService } from '../../services/inputs-utils.service';
import { NEO_OPTION_GROUPS, NEO_SELECT } from '../models/select.model';
import { OptionGroupsComponent } from '../option-groups/option-groups.component';
import { SelectComponent } from '../select.component';
import { InputSize } from '../../models/form-field.model';

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
  host: {
    role: 'option',
    '[title]': 'getLabelText()',
    '[attr.id]': '_id()',
    '[attr.role]': 'option',
    '[hidden]': 'isHideBySearch()',
    '[class.neo-select__dropdown__options__option]': 'true',
    '[class.neo-select__dropdown__options__option--hidden]': 'isHideBySearch()',
    '[class.neo-select__dropdown__options__option--selected]': 'selected',
    '[class.neo-select__dropdown__options__option--disabled]': 'disabled',
    '[class.neo-select__dropdown__options__option--xs]': '_size() === "xs"',
    '[class.neo-select__dropdown__options__option--s]': '_size() === "s"',
    '[class.neo-select__dropdown__options__option--xm]': '_size() === "xm"',
    '[class.neo-select__dropdown__options__option--m]': '_size() === "m"',
    '[class.neo-select__dropdown__options__option--l]': '_size() === "l"',
    '[class.neo-select__dropdown__options__option--xl]': '_size() === "xl"',
    '[attr.aria-selected]': 'isSelected()', // Atributo para indicar si la opción está seleccionada
    '[attr.aria-disabled]': 'disabled', // Atributo para indicar si la opción está deshabilitada
    '[attr.aria-hidden]': 'isHideBySearch()', // Atributo para indicar si la opción está oculta por la búsqueda
    '[attr.aria-label]': 'getLabelText()', // Atributo para indicar el texto de la opción
    '(click)': 'toggleSelectOption($event)', // Evento para seleccionar o deseleccionar la opción
    '(keydown.enter)': 'toggleSelectOption()', // Evento para seleccionar o deseleccionar la opción
    '(keydown.space)': 'toggleSelectOption()', // Evento para seleccionar o deseleccionar la opción
    '[tabindex]': 'disabled ? -1 : 0', // Atributo para poder seleccionar la opción con el teclado
  },
  encapsulation: ViewEncapsulation.None,
})
export class OptionComponent implements FocusableOption {
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

    if (this.selectParent && value)
      setTimeout(() => this.selectParent?.updateValue(this), 0);
  }

  @Input() value!: any;

  _id: WritableSignal<string> = signal('');
  @Input()
  set id(value: string) {
    this._id.set(value);
  }
  get id(): string {
    return this._id();
  }

  private _size: WritableSignal<InputSize> = signal('m');
  private _disabled: WritableSignal<boolean> = signal(false);
  private _selected: WritableSignal<boolean> = signal(false);
  private _hideBySearch: WritableSignal<boolean> = signal(false);
  private _labelText: string = '';
  private _labelHtml: string = '';
  private _elementRef: ElementRef;

  // Inyectamos el componente SelectComponent para poder acceder a sus propiedades y métodos
  // desde el componente OptionComponent y OptionGroupComponent.
  private readonly selectParent = inject(NEO_SELECT, {
    optional: true,
  }) as SelectComponent | null;

  // Inyectamos el componente OptionGroupsComponent para poder acceder a sus propiedades y métodos
  // desde el componente OptionComponent y OptionGroupComponent.
  private readonly groupOption = inject(NEO_OPTION_GROUPS, {
    optional: true,
  }) as OptionGroupsComponent | null;

  private readonly _inputsUtilsService = inject(InputsUtilsService);
  private readonly elementRef = inject(ElementRef);

  constructor() {
    this._elementRef = this.elementRef;
  }

  ngAfterContentInit(): void {
    // Obtenemos el contenido para asignarlo a la propiedad label
    setTimeout(() => {
      this._size.set(this.selectParent?.inputSize || 'm');
      this.setLabelHtml(this.optionLabel?.nativeElement.innerHTML || '');
      this.setLabelText(this.optionLabel?.nativeElement.textContent || '');
      this.createUniqueId();
    }, 0);
  }

  /**
   * Método para generar un identificador único para la opción
   */
  createUniqueId(): void {
    if(this._id()) return;
    this._id?.set(this._inputsUtilsService.createUniqueId('select-option'));
  }

  /**
   * Método para seleccionar o deseleccionar una opción
   */
  toggleSelectOption(event?: Event): void {
    // Si se recibe un evento, evitamos la propagación para evitar conflictos con el overlay.
    event?.stopPropagation();

    if (this.disabled) return;

    // Si el select padre no permite múltiples selecciones, deseleccionamos todas las opciones
    // excepto la que se está seleccionando para poder cambiar su estado justo después
    // y así poder seleccionarla o deseleccionarla
    if (!this.selectParent?.multiple)
      this.selectParent?.options.forEach((option) =>
        option._id() !== this._id() ? option.deselect() : null,
      );

    // Alternamos la selección de la opción
    this.toggle();

    // Actualizamos el valor del select padre
    this.selectParent?.updateValue(this);
  }

  /**
   * Método para alternar la selección de una opción
   */
  toggle() {
    this._selected.set(!this._selected());
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
   * @returns {string}
   */
  getLabelText(): string {
    return this._labelText;
  }

  /**
   * Método para establecer el texto de la opción sin etiquetas HTML
   * @param {string} text
   */
  setLabelText(text: string): void {
    this._labelText = text;
  }

  /**
   * Método para obtener el texto de la opción con etiquetas HTML
   * @returns string
   */
  getLabelHtml(): string {
    return this._labelHtml;
  }

  /**
   * Método para establecer el texto de la opción con etiquetas HTML
   */
  setLabelHtml(html: string): void {
    this._labelHtml = html;
  }

  /**
   * Método para obtener el `ElementRef` del componente
   * @returns {ElementRef}
   */
  getElementRef(): ElementRef {
    return this._elementRef;
  }

  /**
   * Método para enfocar la opción. Este método es necesario para implementar la interfaz `FocusableOption`
   * en la clase. Se enfoca el elemento nativo de la opción para poder seleccionarla las flechas
   * del teclado gracias al uso de `FocusKeyManager` en el componente `neo-select`.
   */
  focus() {
    this._elementRef?.nativeElement?.focus();
  }
}
