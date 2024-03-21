import { Component, ContentChildren, ElementRef, EventEmitter, InjectionToken, Input, InputSignal, Output, QueryList, ViewChild, ViewEncapsulation, WritableSignal, booleanAttribute, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputSize } from '../models/form-field.entity';
import { OptionComponent } from './option/option.component';
import { OptionGroupsComponent } from './option-groups/option-groups.component';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkConnectedOverlay, ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { InputsUtilsService } from '../services/inputs-utils.service';
import { take } from 'rxjs';

/**
 * Permite inyectar el componente SelectComponent en el componente OptionComponent y OptionGroupComponent
 * para poder acceder a sus propiedades y métodos desde el componente hijo
 */
export const NEO_SELECT = new InjectionToken<SelectComponent>('SelectComponent');

/**
 * @name
 * neo-select
 * @description
 * Componente para crear un campo de selección junto con la directiva `neo-options`.
 * @example
 * <neo-select [label]="'Label'" [title]="'Title'" [id]="'id'" [multiple]="false" [searchable]="true" [transparent]="false" [cssClass]="'css-class'" [placeholder]="'Placeholder'" [inputSize]="'m'" (change)="change($event)">
 *    <neo-options [value]="1" [selected]="true" [disabled]="false">Opción 1</neo-options>
 *    <neo-options [value]="2" [selected]="false" [disabled]="false">Opción 2</neo-options>
 * </neo-select>
 * - o -
 * <neo-select formControlName="select">
 *    <neo-options [value]="1" [selected]="true" [disabled]="false">Opción 1</neo-options>
 *    <neo-options [value]="2" [selected]="false" [disabled]="false">Opción 2</neo-options>
 * </neo-select>
 */
@Component({
  selector: 'neo-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss', './../form-fields-settings.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
    {
      provide: NEO_SELECT, useExisting: SelectComponent
    },
  ],
  encapsulation: ViewEncapsulation.None
})
export class SelectComponent implements ControlValueAccessor {

  @ContentChildren(forwardRef(() => OptionComponent), { descendants: true }) options!: QueryList<OptionComponent>;
  @ContentChildren(forwardRef(() => OptionGroupsComponent), { descendants: true }) optionGroups!: QueryList<OptionGroupsComponent>;

  @ViewChild('searchInput') searchInput: ElementRef = null as unknown as ElementRef;
  @ViewChild(CdkConnectedOverlay) protected _cdkConnectedOverlay!: CdkConnectedOverlay;

  @Input({ transform: booleanAttribute }) multiple?: boolean = false;
  @Input({ transform: booleanAttribute }) transparent?: boolean = false;
  @Input({ transform: booleanAttribute }) searchable?: boolean = false;
  @Input({ transform: booleanAttribute }) required?: boolean = false;
  @Input() label?: string = '';
  @Input() title?: string = '';
  @Input() placeholder?: string;
  @Input() placeholderSearch?: string;
  @Input() inputSize: InputSize = 'm';

  /**
   * Input para crear un id único para el campo
   */
  @Input() set id(value: string) {
    this._id.set(value);
    this._labelId.set(`label_${value}`);
  }
  get id() {
    return this._id();
  }

  /**
  * Input para marcar el campo como deshabilitado
  */
  @Input({ transform: booleanAttribute })
  get disabled() {
    return this._disabled();
  }
  set disabled(status: boolean) {
    this._disabled.set(status);
  }

  /**
   * Input para asignar el valor del grupo de radio buttons
   */
  @Input()
  get value(): any {
    return this._value();
  }
  set value(newValue: any) {
    const valueAssigned = this.setValue(newValue);

    if (valueAssigned)
      this.onChange(valueAssigned);
  }

  /**
   * Función para comparar los valores de las opciones con los valores seleccionados. El primer argumento
   * es un valor de opción del listado, y el segundo es valaor seleccionado. Debe devolver un `boolean` a true o false.
   * --
   * Al hacer un `compareSelectedWith` se forzará la selección de las opciones por valor y si poseen la variable `selected` a `true`
   * en el componente `OptionComponent` en su inicialización.
   */
  @Input()
  get compareSelectedWith(): Function {
    return this._compareSelectedWith;
  }
  set compareSelectedWith(fn: (o1: any, o2: any) => boolean) {
    this._compareSelectedWith = fn;

    // Si ya hay opciones seleccionadas, volvemos a inicializar la selección
    // para comprobar si hay opciones seleccionadas, forzando la selección de las opciones por valor
    if (this._optionsSelected)
      this.initSelection(true);
  }

  /**
   * Input para añadir un aria-describedby al campo
   */
  @Input('aria-describedby') ariaDescribedBy!: string;

  /**
   * Evento que se emite cuando el valor del select cambia
   */
  @Output() readonly change = new EventEmitter<any>();

  // Sirve para almanecar el valor seleccionado
  private _optionsSelected!: SelectionModel<OptionComponent>;

  // Función para comparar el valor seleccionado con el valor de la opción
  private _compareSelectedWith = (o1: any, o2: any) => o1 === o2;

  // Variables para controlar los errores del campo por si está marcado como requerido
  hasErrors: InputSignal<boolean> = input<boolean>(false);
  _hasErrors: WritableSignal<boolean> = signal(false);

  // Variables para controlar el estado del dropdown e indicar si está abierto o cerrado
  isDropdownOpened: WritableSignal<boolean> = signal(false);

  // Estrategia de scroll para el overlay
  scrollStrategy: ScrollStrategy;

  _id: WritableSignal<string> = signal('');
  _labelId: WritableSignal<string> = signal('');
  private _disabled: WritableSignal<boolean> = signal(false);
  private _value: WritableSignal<any> = signal(null);

  constructor(
    private readonly _inputsUtilsService: InputsUtilsService,
    scrollStrategyOptions: ScrollStrategyOptions
  ) {
    this.scrollStrategy = scrollStrategyOptions.close();
  }

  ngOnInit() {
    this._optionsSelected = new SelectionModel<OptionComponent>(this.multiple, []);
  }

  ngAfterContentInit(): void {

    // Creamos un id único para el label del input
    this.createUniqueId();

    // Inicializamos la selección de opciones cuándo el contenido ya ha sido inicializado
    // para asegurarnos de que las opciones de `OptionComponent` ya han sido renderizadas
    this.initSelection();
  }

  /**
   * Función para crear un id único para el label del input
   */
  createUniqueId(): void {
    if (!this.id) {
      this._id.set(this._inputsUtilsService.createUniqueId(this.label || this.title || 'select'));
      this._labelId.set(`label_${this._id()}`);
    }
  }

  /**
   * Función para inicializar la selección de opciones y comprobar si hay opciones seleccionadas
   * en base a un valor pasado por parámetro mediante el Input `value`
   */
  private initSelection(forceSetByValue: boolean = false): void {
    setTimeout(() => {

      // Si hay un valor asignado, seleccionamos la opción correspondiente
      // --
      // Si no hay un valor asignado, seleccionamos las opciones que estén marcadas como seleccionadas desde el componente `OptionComponent`
      if (this._value() || forceSetByValue)
        this.setOptionSelectedByValue(this._value());
      else
        this.setOptionSelectedByStatus();
    }, 0);
  }

  /**
   * Asigna un valor específico al select y devuelve si el valor ha cambiado.
   * @param {any | any[]} newValue
   * @returns {boolean}
   */
  private setValue(newValue: any | any[]): boolean {

    if (newValue !== this._value() || (this.multiple && Array.isArray(newValue))) {

      if (this.options)
        this.setOptionSelectedByValue(newValue);

      this._value.set(newValue);
      return true;
    }
    return false;
  }

  /**
   * Función para seleccionar las opciones que estén marcadas como seleccionadas desde el componente `OptionComponent`
   * mediante el Input `selected`
   */
  private setOptionSelectedByStatus(): void {
    if (this.options && this.options.length > 0) {
      this.options.forEach((option: OptionComponent) => {
        if (option.selected) {
          this._optionsSelected.select(option);
          option.select();
        }
      });
    }
  }

  /**
   * Método para establecer el foco en el input de búsqueda si el select es buscable y está abierto
   */
  private setFocusToSearch() {
    if (this.searchable && this.isDropdownOpened() && this.searchInput?.nativeElement)
      setTimeout(() => this.searchInput.nativeElement.focus(), 0);
  }

  /**
   * Función que selecciona una opción a partir de un valor pasado por parámetro mediante el Input `value`
   * @param {any | any[]} value
   */
  private setOptionSelectedByValue(value: any | any[]): void {

    // Limpiamos las opciones seleccionadas de la variable `_optionsSelected`
    // y deseleccionamos todas las opciones que hubieran sido seleccionadas
    this.deselectAllOptions();

    // Si el valor es un array, recorremos el array y seleccionamos las opciones
    // --
    // Si el valor no es un array, seleccionamos la opción correspondiente
    if (this.multiple && value)
      value.forEach((currentValue: any) => this.selectOptionByValue(currentValue));
    else
      this.selectOptionByValue(value);
  }

  /**
   * Encuentra y selecciona una opción basada en el valo pasado por parámetro mediante el Input `value`
   * @returns {OptionComponent | undefined} Opción seleccionada
   */
  private selectOptionByValue(value: any): OptionComponent | undefined {

    // Buscamos la opción que coincida con el valor
    const optionFound = this.options.find((option: OptionComponent) => {

      // Si la opción ya está seleccionada, no la volvemos a seleccionar
      if (this._optionsSelected.isSelected(option))
        return false;

      // Comprobamos si el valor de la opción coincide con el valor pasado por parámetro
      return option.value && this._compareSelectedWith(option.value, value) || false;
    });

    // Si la opción se ha encontrado, la seleccionamos y la devolvemos.
    // Además, marcamos la opción como seleccionada
    if (optionFound) {
      this._optionsSelected.select(optionFound);
      optionFound.select();
    }

    return optionFound;
  }

  /**
   * Actualiza el valor del select a partir de las opciones seleccionadas
   */
  updateValue(option: OptionComponent): void {

    // Si el select es múltiple, actualizamos el valor a partir de las opciones seleccionadas
    // comprobando si ya están seleccionadas o no
    // -
    // Si el select no es múltiple, actualizamos el valor a partir de la opción seleccionada
    // limpando la selección anterior
    if (this.multiple) {
      if (option.isSelected())
        this._optionsSelected?.select(option);
      else
        this._optionsSelected?.deselect(option);
      this._value.set(this._optionsSelected.selected.map(option => option.value));
    } else {

      this._optionsSelected?.clear();

      if (option.isSelected()) {
        this._optionsSelected?.select(option);
        this._value.set(this._optionsSelected.selected[0]?.value);
      } else {
        this._value.set(null);
      }

      this.closeDropdown();
    }

    // Emitimos el evento de cambio del valor
    this.onChange(this._value());
    this.change.emit(this._value());
  }

  /**
   * Método para buscar opciones en el selector
   * @param {string} value
   */
  searchOption(value: string) {

    // Normalizamos el texto para que no haya problemas con las tildes
    const textToSearchNormalized = String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    // Si el texto está vacío, mostramos todas las opciones
    if (textToSearchNormalized === '') return this.options.forEach(option => option.showOptionBySearch());

    // Si el texto contiene algún valor filtramos las opciones que contengan dicho texto
    this.options.forEach((option: OptionComponent) => {
      const labelNormalized: string = String(option.getLabelText()).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      if (labelNormalized.includes(textToSearchNormalized))
        option.showOptionBySearch();
      else
        option.hideOptionBySearch();
    });
  }

  /**
   * Método para resetear la búsqueda y mostrar todas las opciones
   */
  resetSearch() {
    this.options.forEach(option => option.showOptionBySearch());
  }

  /**
   * Método para abrir / cerrar el selector
   * @param {Event} event
   */
  toggleDropdown(event: Event) {

    if (this.disabled) return;

    event?.preventDefault();
    event?.stopPropagation();

    this.isDropdownOpened.set(!this.isDropdownOpened());

  }

  /**
   * Método para comprobar si el dropdown está abierto mediante el evento 'attach'
   * del overlay de Angular CDK en la vista
   */
  attachDropdown() {

    // Nos suscribimos al evento de cambio de posición del overlay
    this._cdkConnectedOverlay.positionChange.pipe(take(1)).subscribe(
      () => {

        // Si el campo está abierto
        if (this.isDropdownOpened()) {

          // Hacemos scroll al primer `neo-option` seleccionado
          this.scrollToSelectedOption();

          // Establecemos el foco en el input de búsqueda si el select permite búsqueda
          if (this.searchable)
            this.setFocusToSearch();
        }
      }
    );
  }

  /**
   * Método para cerrar el selector si está abierto
   */
  closeDropdown() {
    if (this.isDropdownOpened())
      this.isDropdownOpened.set(false);

    // Reseteamos la búsqueda
    this.resetSearch();

    // Comprobamos si hay errores en el campo
    this.checkErrors();
  }

  /**
   * Método para comprobar si hay errores en el campo y mostrarlos.
   * Se activa si el campo es requerido y no se ha seleccionado ninguna opción
   */
  checkErrors() {
    if (this.required && !this.isDropdownOpened() && this._optionsSelected.isEmpty()) {
      this._hasErrors.set(true);
    } else
      this._hasErrors.set(false);
  }

  /**
   * Método para deseleccionar todas las opciones
   */
  deselectAllOptions() {
    this._optionsSelected.clear();
    this.options.forEach(option => option.deselect());
  }

  /**
   * Método para obtener los options seleccionados
   */
  getSelectedOptions(): OptionComponent[] {
    return this._optionsSelected.selected;
  }

  /**
   * Método para hacer scroll al primer `neo-option` seleccionado
   */
  scrollToSelectedOption() {
    const selectedOption = this.options.find(option => option.isSelected());

    // Hacemos scroll al primer `neo-option` seleccionado
    if (selectedOption)
      selectedOption.getElementRef().nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Si el select no tiene búsqueda, establecemos el foco en la opción seleccionada
    if (!this.searchable)
      selectedOption?.getElementRef().nativeElement.focus();
  }

  // Funciones de control de eventos
  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(value: any) {
    this.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

}
