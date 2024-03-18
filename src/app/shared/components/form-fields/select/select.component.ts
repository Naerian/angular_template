import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { ElementRef, EventEmitter, InputSignal, Output, ViewChild, ViewChildren, WritableSignal, input, signal } from '@angular/core';
import { Component, ContentChildren, forwardRef, Input, QueryList } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputSize } from '../models/form-field.entity';
import { OptionsDirective } from './options/options.directive';

/**
 * @name
 * neo-select
 * @description
 * Componente para crear un campo de selección junto con la directiva `neo-options`.
 * @example
 * <neo-select [label]="'Label'" [title]="'Title'" [id]="'id'" [multiple]="false" [search]="true" [transparent]="false" [cssClass]="'css-class'" [placeholder]="'Placeholder'" [inputSize]="'m'" (change)="change($event)">
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
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
  }]
})

export class SelectComponent implements ControlValueAccessor {

  @Input() label?: string = '';
  @Input() title?: string = '';
  @Input() required?: boolean = false;
  @Input() id?: string;
  @Input() multiple?: boolean = false;
  @Input() transparent?: boolean = false;
  @Input() search?: boolean = false;
  @Input() classes?: Array<string> = [];
  @Input() placeholder?: string;
  @Input() inputSize: InputSize = 'm';
  hasErrors: InputSignal<boolean> = input<boolean>(false);
  _hasErrors: WritableSignal<boolean> = signal(false);

  /**
  * Input para marcar el campo como deshabilitado
  */
  @Input() set disabled(status: boolean) {
    this._disabled.set(status);
  }

  get disabled() {
    return this._disabled();
  }

  @Output() change = new EventEmitter<any>();

  @ViewChild('searchInput') searchInput: ElementRef = null as unknown as ElementRef;
  @ViewChildren('itemOption') itemsOption: QueryList<ElementRef> = [] as unknown as QueryList<ElementRef>;
  @ContentChildren(OptionsDirective) options: QueryList<OptionsDirective> = null as unknown as QueryList<OptionsDirective>;

  _disabled: WritableSignal<boolean> = signal(false);

  isDropdownOpened: WritableSignal<boolean> = signal(false);
  optionsFiltered: WritableSignal<OptionsDirective[]> = signal([] as OptionsDirective[]); // Se utilizará para almacenar las opciones filtradas por el input de búsqueda
  optionSelected: WritableSignal<any> = signal(null); // // Se utilizará para almecenar un objeto OPTION completo (OptionsDirective)
  optionsSelected: WritableSignal<OptionsDirective[]> = signal([]); // Se utilizará para almecenar el array de objetos OPTION completo (OptionsDirective)
  optionsSelectedValues: WritableSignal<any[]> = signal([]); // Se utilizará para emitir los valores en un array cuando sea múltiple
  scrollStrategy: ScrollStrategy;

  constructor(
    scrollStrategyOptions: ScrollStrategyOptions
  ) {
    this.scrollStrategy = scrollStrategyOptions.close();
  }

  ngAfterContentInit(): void {

    // Si alguno ha sido marcado como "true" usando su input, notificamos al selector
    const optionSelected: OptionsDirective | null = this.options.find(option => option.selected) || null;
    if (optionSelected)
      this.writeValue(optionSelected?.value || null);

    this.optionsFiltered.set(this.options.toArray());
  }

  /**
   * Método para abrir / cerrar el selector
   * @param {Event} event
   */
  toggleDropdown(event: Event) {

    // Reestablecemos las opciones al abrir el selector por si se ha cerrado con texto de búsqueda
    this.optionsFiltered.set(this.options.toArray());

    event?.preventDefault();
    event?.stopPropagation();

    this.isDropdownOpened.set(!this.isDropdownOpened());

    // Si el campo está abierto y tiene búsqueda, enfocamos el input
    if (this.isDropdownOpened() && this.search)
      this.setFocusToSearch();

    this.scrollToOptionSelected();
  }

  /**
   * Método para cerrar el selector si está abierto
   */
  closeDropdown() {
    if (this.isDropdownOpened())
      this.isDropdownOpened.set(false);
  }

  /**
   * Método para comprobar si hay errores en el campo y mostrarlos
   */
  checkErrors() {
    if (this.required && !this.isDropdownOpened() && ((!this.multiple && !this.optionSelected()) || (this.multiple && this.optionsSelected().length === 0))) {
      this._hasErrors.set(true);
    } else
      this._hasErrors.set(false);
  }

  /**
   * Método para buscar opciones en el selector
   * @param {string} value
   */
  searchOption(value: string) {

    // Normalizamos el texto para que no haya problemas con las tildes
    const textToSearchNormalized = String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    // Si el texto está vacío, mostramos todas las opciones
    if (textToSearchNormalized === '') return this.optionsFiltered.set(this.options.toArray());

    // Si no, filtramos las opciones que contengan el texto buscado
    const optionsFiltereds = this.options.filter((option: OptionsDirective) => {
      const labelNormalized: string = String(option.label).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return labelNormalized.includes(textToSearchNormalized);
    });
    this.optionsFiltered.set(optionsFiltereds);

  }

  /**
   * Método para establecer el foco en el input de búsqueda
   */
  setFocusToSearch() {
    if (this.search)
      setTimeout(() => this.searchInput.nativeElement.focus(), 0);
  }

  /**
   * Método para mover el scroll a la opción seleccionada
   */
  scrollToOptionSelected() {
    setTimeout(() => {
      if (this.isDropdownOpened() && (this.optionSelected() || this.optionsSelected().length > 0) && this.itemsOption?.length > 0) {
        let elementSelected: ElementRef | undefined = this.itemsOption?.find(element => element.nativeElement.getAttribute('data-selected') === 'true') || undefined;
        elementSelected?.nativeElement?.scrollIntoView({ behavior: "instant" });

        // Si no hay campo de búsqueda, enfocamos en el elemento seleccionado
        if (!this.search)
          elementSelected?.nativeElement?.focus();
      }
    }, 0);
  }

  /**
   * Método para cambiar la opción seleccionada en el selector
   * @param {OptionsDirective | null} optionItem
   */
  changeOption(optionItem: OptionsDirective | null) {

    if (optionItem && !optionItem?.disabled) {
      if (this.multiple) {

        // Si ya estaba marcado, la borramos
        // --
        // Si no, la añadimos al array
        if (optionItem.selected) {
          optionItem.selected = false;
          const index: number = this.optionsSelected().indexOf(optionItem);
          const indexValues: number = this.optionsSelectedValues().indexOf(optionItem.value);
          if (index !== -1) {
            this.optionsSelected.update(options => options.filter((_, idx) => index !== idx));
            this.optionsSelectedValues.update(options => options.filter((_, idx) => indexValues !== idx));
          }
        } else {
          optionItem.selected = true;
          this.optionsSelected.update(options => ([...options, optionItem]));
          this.optionsSelectedValues.update(options => ([...options, optionItem.value]));
        }

        this.change.emit(this.optionsSelectedValues);
        this.onChange(this.optionsSelectedValues);
        this.onTouched();

      } else {

        // Desmarcamos todas las opciones que estén seleccionadas
        this.unselectOptions();

        // Reinitializamos la búsqueda
        this.searchOption('');

        // Marcamos la actual
        optionItem.selected = true;

        this.optionSelected.set(optionItem);
        this.change.emit(optionItem.value);
        this.onChange(optionItem.value);
        this.onTouched();
        this.closeDropdown();
      }
    }
  }

  /**
   * Método para desmarcar todas las opciones
   */
  unselectOptions() {
    this.options?.forEach((option) => option.selected = false);
  }

  /**
   * Método para buscar y marcar la opción seleccionada
   * @param value
   */
  findSetOption(value: any) {

    let isResetOptionSelected: boolean = false;

    if (value === null || value === undefined || value === '') {
      this.optionSelected.set(null);
      this.optionsSelected.set([]);
      this.optionsSelectedValues.set([]);
      isResetOptionSelected = true;
    }

    if ((this.multiple && (this.optionsSelectedValues().indexOf(value) === -1 || this.optionsSelected().indexOf(value) === -1)) || !this.multiple) {

      this.options?.forEach(option => {

        option.selected = false;

        // Comparamos si el option del listado y el valor son iguales
        if (!isResetOptionSelected && JSON.stringify(option.value) === JSON.stringify(value)) {

          option.selected = true;

          if (this.multiple) {
            this.optionsSelected.update(options => ([...options, option]));
            this.optionsSelectedValues.update(options => ([...options, option.value]));
          } else {
            this.optionSelected.set(option);
          }
        }
      });

    }

  }

  // Funciones de control de eventos
  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(value: any) {
    if (this.options) {

      // Si es de selector múltiple, al pasar los valores iniciales
      // comprobamos si viene un array o datos normales.
      // --
      // Si no es multiple, marcamos solo el valor
      if (this.multiple) {

        if (value) {
          if (value instanceof Array) {
            value.forEach(element => this.findSetOption(element));
          } else {
            this.findSetOption(value);
          }
        } else {
          this.optionSelected.set(null);
          this.unselectOptions();
        }

      } else {
        this.findSetOption(value);
      }

    }
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
