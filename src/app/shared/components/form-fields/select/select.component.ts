import { FocusKeyManager } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import {
  CdkConnectedOverlay,
  Overlay,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  InputSignal,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  WritableSignal,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { FADE_IN_OUT_SCALE } from '@shared/animations/fade-in-out-scale.animation';
import { Subject, take, takeUntil } from 'rxjs';
import { InputSize } from '../models/form-field.model';
import { InputsUtilsService } from '../services/inputs-utils.service';
import { NEO_SELECT, OVERLAY_POSITIONS } from './models/select.model';
import { OptionGroupsComponent } from './option-groups/option-groups.component';
import { OptionComponent } from './option/option.component';
import { SelectManagerService } from './services/select-manager/select-manager.service';
import { NeoUITranslations } from '@shared/translations/translations.model';
import { NEOUI_TRANSLATIONS } from '@shared/translations/translations.token';

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
  styleUrls: ['./select.component.scss'],
  animations: [FADE_IN_OUT_SCALE],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
    {
      provide: NEO_SELECT,
      useExisting: SelectComponent,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SelectComponent
  implements ControlValueAccessor, AfterContentInit, OnDestroy, OnInit
{
  @ContentChildren(forwardRef(() => OptionComponent), { descendants: true })
  options!: QueryList<OptionComponent>;
  @ContentChildren(forwardRef(() => OptionGroupsComponent), {
    descendants: true,
  })
  optionGroups!: QueryList<OptionGroupsComponent>;

  @ViewChild('searchInput') searchInput: ElementRef =
    null as unknown as ElementRef;
  @ViewChild(CdkConnectedOverlay)
  protected _cdkConnectedOverlay!: CdkConnectedOverlay;

  @ViewChild('selectField') selectFieldRef!: ElementRef<HTMLElement>;
  @ViewChild('dropdownOverlay') dropdownOverlayRef!: ElementRef<HTMLElement>;

  @Input({ transform: booleanAttribute }) multiple?: boolean = false;
  @Input({ transform: booleanAttribute }) transparent?: boolean = false;
  @Input({ transform: booleanAttribute }) searchable?: boolean = false;
  @Input({ transform: booleanAttribute }) required?: boolean = false;
  @Input() label?: string = '';
  @Input() title?: string = '';
  @Input() placeholder?: string;
  @Input() placeholderSearch?: string;
  @Input() inputSize: InputSize = 'm';
  @Input({ transform: booleanAttribute }) showClear: boolean = false;
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
   * Input para asignar el valor del selector
   */
  @Input()
  get value(): any {
    return this._value();
  }
  set value(newValue: any) {
    this.setValue(newValue);
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
    if (this._optionsSelected) this.initSelection(true);
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

  // Variables para controlar el estado del dropdown e indicar si está abierto o cerrado
  isDropdownOpened: WritableSignal<boolean> = signal(false);

  // Estrategia de scroll para el overlay
  scrollStrategy: ScrollStrategy;
  overlayPositions = OVERLAY_POSITIONS;

  _id: WritableSignal<string> = signal('');
  _labelId: WritableSignal<string> = signal('');
  private _disabled: WritableSignal<boolean> = signal(false);
  private _value: WritableSignal<any> = signal(null);

  // Manager para el control de teclas en las opciones
  private _focusKeyManager!: FocusKeyManager<OptionComponent>;

  private readonly overlay = inject(Overlay);
  private readonly _inputsUtilsService = inject(InputsUtilsService);
  private readonly _selectManagerService = inject(SelectManagerService);
  private readonly _injector = inject(Injector);

  // Inyectamos las traducciones
  protected _translations: NeoUITranslations = inject(NEOUI_TRANSLATIONS);

  // Señal computada para obtener el texto de la opción seleccionada
  protected translatedMultipleChoices = computed(() => {
    const selectedCount = this.getSelectedOptions().length;
    return this._translations.multipleChoices.replace(
      '{choices}',
      String(selectedCount),
    );
  });

  // Propiedad para mantener la instancia de NgControl
  public ngControl: NgControl | null = null;

  private destroy$ = new Subject<void>();

  constructor() {
    this.scrollStrategy = this.overlay.scrollStrategies.close();
  }

  /**
   * Método para cerrar el panel al pulsar la tecla "Escape"
   */
  @HostListener('keydown', ['$event'])
  _onKeydownHandler(event: KeyboardEvent) {
    const keyCode = event.key;
    if (keyCode === 'Escape') this.closeDropdown();
  }

  /**
   * Método para cerrar el dropdown al hacer click fuera del panel,
   * excluyendo el propio campo del select y el contenido del dropdown.
   */
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    // Verificar si las referencias a los elementos existen para evitar errores
    const clickedInsideSelectField =
      this.selectFieldRef?.nativeElement?.contains(event.target as Node);
    const clickedInsideDropdownOverlay =
      this.dropdownOverlayRef?.nativeElement?.contains(event.target as Node);

    // Si el dropdown está abierto y el clic no fue dentro del campo del select NI dentro del overlay del dropdown
    if (
      this.isDropdownOpened() &&
      !clickedInsideSelectField &&
      !clickedInsideDropdownOverlay
    ) {
      this.closeDropdown();
    }
  }

  ngOnInit() {
    // Inicializamos la selección de opciones y comprobamos si hay opciones seleccionadas
    this._optionsSelected = new SelectionModel<OptionComponent>(
      this.multiple,
      [],
    );

    // Nos suscribimos al servicio SelectManagerService para cerrar el dropdown si otro componente de tipo Select se abre
    this.selectManager();
  }

  ngAfterViewInit(): void {
    // Resolvemos el NgControl para poder usarlo en el componente y tener acceso a sus propiedades
    this.resolveNgControl();
  }

  ngAfterContentInit(): void {
    // Creamos un id único para el label del input
    this.createUniqueId();

    // Inicializamos la selección de opciones cuándo el contenido ya ha sido inicializado
    // para asegurarnos de que las opciones de `OptionComponent` ya han sido renderizadas
    this.initSelection();

    // Inicialización del manager de teclas para las opciones.
    // Con la opción "withWrap" permitimos que el foco se mueva cíclicamente entre los elementos del menú.
    // Esto permite que al presionar la tecla "Tab" o "Shift + Tab" también se pueda navegar por los ítems del menú contextual.
    this._focusKeyManager = new FocusKeyManager(this.options).withWrap();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Método para resolver NgControl y asignarlo a la propiedad `ngControl`
   * para poder usarlo en el componente y tener acceso a sus propiedades.
   */
  resolveNgControl() {
    this.ngControl = this._injector.get(NgControl, null);
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  /**
   * Método para suscribirse a las notificaciones del servicio SelectManagerService
   * para cerrar el dropdown si otro componente de tipo Select se abre.
   */
  selectManager() {
    // Nos suscribimos a las notificaciones del servicio
    this._selectManagerService.dropdownOpened$
      .pipe(takeUntil(this.destroy$))
      .subscribe((openedComponent) => {
        // Si el componente notificado no es este mismo, ciérrate.
        if (openedComponent !== this) {
          this.closeDropdown();
        }
      });
  }

  // Evento para controlar cuando se pulsa una tecla
  onKeyDown(event: KeyboardEvent) {
    this._focusKeyManager.onKeydown(event);
  }

  /**
   * Función para crear un id único para el label del input
   */
  createUniqueId(): void {
    this._id?.set(this._inputsUtilsService.createUniqueId('select'));
    this._labelId?.set(`label_${this._id()}`);
  }

  /**
   * Función para obtener el aria-describedby personalizado
   * que incluye el hint y el error del campo.
   * @return {string}
   */
  get ariaDescribedByCustom(): string {
    return this._inputsUtilsService.getAriaDescribedByCustom(this._id());
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
      else this.setOptionSelectedByStatus();
    }, 0);
  }

  /**
   * Asigna un valor específico al select y devuelve si el valor ha cambiado.
   * @param {any | any[]} newValue
   * @returns {boolean}
   */
  private setValue(newValue: any | any[]): boolean {
    if (
      newValue !== this._value() ||
      (this.multiple && Array.isArray(newValue))
    ) {
      setTimeout(() => {
        // Si hay opciones, seleccionamos las opciones que coincidan con el valor pasado por parámetro
        if (this.options) this.setOptionSelectedByValue(newValue);

        this._value.set(newValue);
        return true;
      }, 100);
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
  setFocusToSearch() {
    if (
      this.searchable &&
      this.isDropdownOpened() &&
      this.searchInput?.nativeElement
    )
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
      value.forEach((currentValue: any) =>
        this.selectOptionByValue(currentValue),
      );
    else this.selectOptionByValue(value);
  }

  /**
   * Encuentra y selecciona una opción basada en el valor pasado por parámetro mediante el Input `value`
   * @returns {OptionComponent | undefined} Opción seleccionada
   */
  private selectOptionByValue(value: any): OptionComponent | undefined {
    // Buscamos la opción que coincida con el valor
    const optionFound = this.options.find((option: OptionComponent) => {
      // Si la opción ya está seleccionada, no la volvemos a seleccionar
      if (this._optionsSelected.isSelected(option)) return false;

      // Comprobamos si el valor de la opción coincide con el valor pasado por parámetro
      return (
        (option.value && this._compareSelectedWith(option.value, value)) ||
        false
      );
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
      if (option.isSelected()) this._optionsSelected?.select(option);
      else this._optionsSelected?.deselect(option);
      this._value.set(
        this._optionsSelected.selected.map((option) => option.value),
      );
    } else {
      if (!this._optionsSelected.isEmpty()) this._optionsSelected?.clear();

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
   * Método para buscar opciones en el selector. Además
   * permite buscar por múltiples tokens separados por espacios.
   * Por ejemplo, si se busca "opción 1", se buscará por "opción" y "1".
   * Si el texto está vacío, se mostrarán todas las opciones.
   * De esta forma tenemos un buscador más flexible que permite
   * buscar por partes del texto de las opciones.
   * @param {string} value
   */
  searchOption(value: string) {
    const textToSearchNormalized = String(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    // Si el texto está vacío, mostramos todas las opciones
    if (textToSearchNormalized === '') {
      this.options.forEach((option) => option.showOptionBySearch());
      return;
    }

    // Obtenemos los tokens de búsqueda separados por espacios
    // Por ejemplo: "opción 1" se convierte en ["opción", "1"]
    const searchTokens = textToSearchNormalized.split(/\s+/).filter(Boolean);

    // Recorremos las opciones y comprobamos si el texto de la opción
    // contiene todos los tokens de búsqueda que hemos obtenido
    this.options.forEach((option: OptionComponent) => {
      const labelNormalized = String(option.getLabelText())
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

      // Comprobamos si la etiqueta de la opción contiene todos los tokens de búsqueda
      // Usamos el método `every` para comprobar si todos los tokens de búsqueda están en la etiqueta
      // Normalizamos la etiqueta de la opción para evitar problemas con acentos y mayúsculas
      const matchesAllTokens = searchTokens.every((token) =>
        labelNormalized.includes(token),
      );

      // Si la opción coincide con todos los tokens de búsqueda, la mostramos
      // Si no, la ocultamos
      if (matchesAllTokens) option.showOptionBySearch();
      else option.hideOptionBySearch();
    });
  }

  /**
   * Método para resetear la búsqueda y mostrar todas las opciones
   */
  resetSearch() {
    this.options.forEach((option) => option.showOptionBySearch());
  }

  /**
   * Método para abrir / cerrar el selector
   * @param {Event} event
   */
  toggleDropdown(event: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (this.isDropdownOpened()) this.closeDropdown();
    else this.openDropdown();
  }

  /**
   * Método para abrir el selector si está cerrado
   */
  openDropdown() {
    if (this.disabled) return;

    // Abrimos el dropdown y notificamos al servicio SelectManagerService
    this.isDropdownOpened.set(true);
    this._selectManagerService.notifyOpened(this);
  }

  /**
   * Método para cerrar el selector si está abierto
   */
  closeDropdown() {
    this.isDropdownOpened.set(false);

    // Reseteamos la búsqueda
    this.resetSearch();
  }

  /**
   * Método para comprobar si el dropdown está abierto mediante
   * el evento 'attach' del overlay de Angular CDK en la vista
   */
  attachDropdown() {
    // Nos suscribimos al evento de cambio de posición del overlay
    this._cdkConnectedOverlay.positionChange.pipe(take(1)).subscribe(() => {
      // Si el campo está abierto
      if (this.isDropdownOpened()) {
        // Hacemos scroll al primer `neo-option` seleccionado
        this.scrollToSelectedOption();

        // Establecemos el foco en el input de búsqueda si el select permite búsqueda
        if (this.searchable) this.setFocusToSearch();
      }
    });
  }

  /**
   * Método para deseleccionar todas las opciones
   */
  deselectAllOptions() {
    this._optionsSelected.clear();
    this.options.forEach((option) => option.deselect());
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
    const selectedOption = this.options.find((option) => option.isSelected());

    // Hacemos scroll al primer `neo-option` seleccionado
    if (selectedOption)
      selectedOption
        .getElementRef()
        .nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Si el select no tiene búsqueda, establecemos el foco en la opción seleccionada
    if (!this.searchable) selectedOption?.getElementRef().nativeElement.focus();
  }

  /**
   * Función para devolver el nombre de la opción u opciones seleccionadas
   * y usarlas en el `title` de la vista
   */
  getTitleOptionsSelected(): string | null {
    // Si no hay valores seleccionados, devolvemos el valor vacío
    if (this._optionsSelected.isEmpty()) return null;

    // Si no es de selección múltiple, devolvemos el primero
    // Si es de selección múltiple obtenemos todas las seleccionadas y las unimos por un coma (,)
    if (!this.multiple) return this._optionsSelected.selected[0].getLabelText();
    else {
      const titlesOptions: string[] = this._optionsSelected.selected.map(
        (option) => option.getLabelText(),
      );
      return titlesOptions.join(', ');
    }
  }

  /**
   * Método para limpiar la selección de opciones y actualizar el valor del select a null.
   */
  clearSelection() {
    // Limpiamos la selección de opciones
    this.deselectAllOptions();

    // Actualizamos el valor del select a null
    this._value.set(null);

    // Emitimos el evento de cambio del valor
    this.onChange(this._value());
    this.change.emit(this._value());

    // Cerramos el dropdown
    this.closeDropdown();
  }

  // Funciones de control de eventos
  onChange: any = () => {};
  onTouched: any = () => {};

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
