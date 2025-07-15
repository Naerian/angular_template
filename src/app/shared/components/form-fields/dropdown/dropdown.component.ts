import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  inject,
  InputSignal,
  signal,
  WritableSignal,
  input,
  booleanAttribute,
  ContentChildren,
  QueryList,
  SimpleChanges,
  ViewChildren,
  ViewEncapsulation,
  Injector,
  ChangeDetectorRef,
  OnInit,
  AfterContentInit,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  DropdownContent,
  DropdownOption,
  DropdownGroup,
  DropdownSize,
  VIRTUAL_SCROLL_THRESHOLD,
  DropdownSizesInPx,
  OVERLAY_POSITIONS,
  VERTICAL_GAP_IN_PX,
  PADDING_OPTIONS_IN_PX,
} from './models/dropdown.model';
import { InputsUtilsService } from '../services/inputs-utils.service';
import { DropdownOptionComponent } from './dropdown-option/dropdown-option.component';
import { DropdownOptionGroupComponent } from './dropdown-option-group/dropdown-option-group.component';
import { Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import { DropdownManagerService } from './services/dropdown-manager.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { NeoUITranslations } from '@shared/translations/translations.model';
import { NEOUI_TRANSLATIONS } from '@shared/translations/translations.token';
import { FADE_IN_OUT_SCALE } from '@shared/animations/fade-in-out-scale.animation';
import { InputComponent } from '../input/input.component';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { FocusableItemDirective } from './directives/focusable-item.directive';

/**
 * @name
 * neo-dropdown
 * @description
 * Componente para crear un dropdown (menú desplegable) con opciones. Éstas pueden ser tanto opciones simples como grupos de opciones.
 * Además permite búsqueda, selección múltiple y es accesible. Su contenido puede ser un array de datos usando el input `content`
 * o usando `ng-content` para proyectar componentes `neo-option` y `neo-option-group` mediante las etiquetas `<neo-option>` y `<neo-option-group>`.
 * @example
 * <neo-dropdown>
 *  <neo-option value="1" label="Opción 1"></neo-option>
 *  <neo-option value="2" label="Opción 2"></neo-option>
 *  <neo-option-group label="Grupo 1">
 *    <neo-option value="3" label="Opción 3"></neo-option>
 *    <neo-option value="4" label="Opción 4"></neo-option>
 *  </neo-option-group>
 * </neo-dropdown>
 *
 * @example
 * <neo-dropdown [content]="dropdownContent" [valueField]="'value'" [labelField]="'label'"></neo-dropdown>
 *
 * @example
 * <neo-dropdown [content]="dropdownContent" [valueField]="'value'" [labelField]="'label'" [searchable]="true" [multiple]="true"></neo-dropdown>
 */
@Component({
  selector: 'neo-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  animations: [FADE_IN_OUT_SCALE],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DropdownComponent
  implements
    ControlValueAccessor,
    AfterViewInit,
    OnInit,
    AfterContentInit,
    OnChanges,
    OnDestroy
{
  // Captura de contenido proyectado
  @ContentChildren(DropdownOptionComponent, { descendants: true })
  _optionsFromContent!: QueryList<DropdownOptionComponent>; // Todas las opciones, planas o en grupos
  @ContentChildren(DropdownOptionGroupComponent)
  _groupsFromContent!: QueryList<DropdownOptionGroupComponent>; // Solo los grupos directos

  @ViewChild('inputSearch') inputSearch!: InputComponent;
  @ViewChild('dropdownPanel') dropdownPanel!: ElementRef<HTMLElement>;
  @ViewChild('dropdownInput') dropdownInput!: ElementRef<HTMLInputElement>;
  @ViewChildren('option') optionButtons!: QueryList<FocusableItemDirective>;

  @ViewChild(CdkVirtualScrollViewport) virtualScroll!: CdkVirtualScrollViewport;

  /**
   * Texto de la etiqueta asociada al dropdown.
   * @type {InputSignal<string | undefined>}
   */
  label: InputSignal<string | undefined> = input<string | undefined>(undefined);

  /**
   * Contenido del dropdown: un array de opciones o grupos de opciones.
   * Ahora es OPCIONAL, ya que podemos usar ng-content.
   * @type {InputSignal<DropdownContent | null>}
   */
  content: InputSignal<any[] | null> = input<any[] | null>(null);

  /**
   * Nombre de la propiedad del objeto en el array 'content' que se usará como valor.
   * Ignorado si se usa ng-content.
   * @type {InputSignal<string>}
   * @default 'value'
   */
  valueField: InputSignal<string> = input<string>('value');

  /**
   * Nombre de la propiedad del objeto en el array 'content' que se usará como etiqueta visible.
   * Ignorado si se usa ng-content.
   * @type {InputSignal<string>}
   * @default 'label'
   */
  labelField: InputSignal<string> = input<string>('label');

  /**
   * Valor actualmente seleccionado del dropdown.
   * @type {WritableSignal<any>}
   */
  _value: WritableSignal<any> = signal(null);

  /**
   * Etiqueta (placeholder) del dropdown.
   * @type {InputSignal<string>}
   */
  placeholder: InputSignal<string> = input<string>('Seleccionar...');

  /**
   * Tamaño del input del dropdown.
   * @type {InputSignal<DropdownSize>}
   */
  inputSize: InputSignal<DropdownSize> = input<DropdownSize>('m');

  /**
   * Si se debe mostrar un botón para limpiar la selección.
   * @type {InputSignal<boolean>}
   */
  showClear: InputSignal<boolean> = input<boolean>(false);

  /**
   * Si el dropdown está deshabilitado.
   */
  _disabled = signal(false);
  @Input({ transform: booleanAttribute })
  set disabled(value: boolean) {
    this._disabled.set(value);
  }
  get disabled() {
    return this._disabled();
  }

  /**
   * Si se muestra un buscador en el dropdown.
   * @type {InputSignal<boolean>}
   */
  searchable: InputSignal<boolean> = input<boolean>(false);

  /**
   * Si el dropdown permite selección múltiple.
   * (Esta característica añade mucha complejidad, dejaremos el ejemplo para selección simple)
   * @type {InputSignal<boolean>}
   */
  multiple: InputSignal<boolean> = input<boolean>(false); // No implementado en este ejemplo

  /**
   * Propiedad para almacenar el ancho del dropdown y pasarlo al CDK Overlay
   * para que éste se ajuste al ancho del propio dropdown.
   */
  _dropdownWidth: WritableSignal<number> = signal(0);

  /**
   * Emite el valor seleccionado cuando hay un cambio.
   * @type {EventEmitter<any>}
   */
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emite cuando se abre o cierra el dropdown.
   * @type {WritableSignal<boolean>}
   */
  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Emite cuando se selecciona una opción.
   * @type {EventEmitter<DropdownOption>}
   */
  @Output() optionSelected: EventEmitter<DropdownOption> =
    new EventEmitter<DropdownOption>();

  /**
   * Emite cuando se pierde el foco del dropdown.
   * @type {EventEmitter<void>}
   */
  @Output() blur: EventEmitter<void> = new EventEmitter<void>();

  isOpen: WritableSignal<boolean> = signal(false);
  searchTerm: WritableSignal<string> = signal('');
  filteredOptions: WritableSignal<(DropdownOption | DropdownGroup)[]> = signal(
    [],
  );

  // Estrategia de scroll para el overlay
  scrollStrategy: ScrollStrategy;
  overlayPositions = OVERLAY_POSITIONS;

  // Opciones aplanadas para búsqueda y navegación
  private _allFlatOptions: DropdownOption[] = [];

  private readonly overlay = inject(Overlay);
  private readonly _injector = inject(Injector);
  private readonly _changeDetector = inject(ChangeDetectorRef);
  private readonly _inputsUtilsService = inject(InputsUtilsService);
  private readonly _dropdownManagerService = inject(DropdownManagerService);

  // Manager para el control de teclas en las opciones
  keyManager!: FocusKeyManager<FocusableItemDirective>;

  // Inyectamos las traducciones
  protected _translations: NeoUITranslations = inject(NEOUI_TRANSLATIONS);

  // Propiedad para mantener la instancia de NgControl
  public ngControl: NgControl | null = null;

  private searchTerm$ = new Subject<string>();
  private ngUnsubscribe$ = new Subject<void>();

  _id: WritableSignal<string> = signal('');
  _labelId: WritableSignal<string> = signal('');
  _panelId: WritableSignal<string> = signal('');
  _optionsId: WritableSignal<string> = signal('');

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.scrollStrategy = this.overlay.scrollStrategies.close();
  }

  /**
   * Cierra el dropdown si el clic se realiza fuera de él.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return;

    // Comprobar si el clic fue dentro del componente
    const isClickInsideTrigger = this.dropdownInput?.nativeElement.contains(
      event.target as Node,
    );
    const isClickInsidePanel = this.dropdownPanel?.nativeElement.contains(
      event.target as Node,
    );

    // Si el clic no fue dentro del trigger ni dentro del panel del dropdown, cerrar.
    if (!isClickInsideTrigger && !isClickInsidePanel) this.closeDropdown();
  }

  ngOnInit(): void {
    this.onSearchTermChange();
    this.dropdownManager();
  }

  ngAfterViewInit(): void {
    this.createUniqueId();
    // Resolvemos el NgControl para poder usarlo en el componente y tener acceso a sus propiedades
    this.resolveNgControl();
  }

  ngAfterContentInit(): void {
    // Cuando el contenido proyectado esté disponible
    this.processContent();

    // Suscribirse a cambios en el contenido proyectado (si los componentes se añaden/eliminan dinámicamente)
    this._optionsFromContent.changes.subscribe(() => this.processContent());
    this._groupsFromContent.changes.subscribe(() => this.processContent());
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si hay cambios en el input `content`, `valueField`, `labelField` o `enableVirtualScroll`,
    // procesamos el contenido nuevamente para actualizar las opciones.
    if (
      changes['content'] ||
      changes['valueField'] ||
      changes['labelField'] ||
      changes['enableVirtualScroll']
    ) {
      this.processContent();
    }
  }

  ngOnDestroy(): void {
    this.closeDropdown();
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Función para inicializar el KeyManager y permitir que las teclas de flecha
   * naveguen por las opciones del dropdown y se enfoquen correctamente.
   */
  initKeyManager() {
    setTimeout(() => {
      // Inicializamos el KeyManager para manejar la navegación por teclado
      this.keyManager = new FocusKeyManager(this.optionButtons)
        .withWrap()
        .withVerticalOrientation()
        .withTypeAhead();

      // Recorremos los botones y obtenemos el indice de la opción que haya seleccionada
      // si el dropdown ya tiene algún valor preseleccionado.
      const activeOption = this._allFlatOptions.find((opt) =>
        this.isOptionSelected(opt),
      );

      // Si hay una opción activa, la establecemos como la opción activa del KeyManager
      if (activeOption) {
        const index = this.getFlatOptionIndex(activeOption);
        this.keyManager.setActiveItem(index);
        this.focusOption(index);
      } else {
        this.keyManager.setActiveItem(-1);
        this.focusOption(-1);
      }

      // Enfocamos el input de búsqueda si existe. Usamos `setTimeout` para asegurarnos de que el DOM esté listo
      // y que ya se ha producido el foco y scroll del elemento que pueda haber seleccionado.
      setTimeout(() => {
        if (this.inputSearch) this.inputSearch.nativeInputElement.focus();
      });
    });
  }

  /**
   * Función para utilizar las teclas de flecha arriba y abajo para navegar por las opciones.
   * @param {KeyboardEvent} event - Evento de teclado para manejar la navegación por teclado.
   */
  onKeydown(event: KeyboardEvent): void {
    // Capturamos el evento de teclado y lo pasamos al KeyManager
    // para que maneje la navegación por teclado.
    this.keyManager.onKeydown(event);

    // Control de teclas pulsadas para poder hacer diferentes acciones
    // y además, después, seguir manteniendo el foco en el input de búsqueda.
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        const active = this.keyManager.activeItem;
        if (active) this.selectOptionByIndex(this.keyManager.activeItemIndex);
        break;

      case 'End':
        event.preventDefault();
        this.keyManager.setLastItemActive();
        break;

      case 'Home':
        event.preventDefault();
        this.keyManager.setFirstItemActive();
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;

      default:
        break;
    }

    // Volvemos a hacer focus en el input de búsqueda si está activo.
    // De esta forma, aunque nos movamos, seguimos pudiendo buscar en todo momento.
    if (this.inputSearch && this.inputSearch.nativeInputElement)
      this.inputSearch.nativeInputElement.focus();
  }

  /**
   * Función para comprobar si la opción está resaltada en el KeyManager.
   * @param {DropdownOption} option - Opción a comprobar si está resaltada.
   * @returns {boolean} - Devuelve true si la opción está resaltada, false en caso contrario.
   */
  isOptionHighlighted(option: DropdownOption): boolean {
    if (!this.keyManager) return false;

    // Comprobamos si la opción está activa en el KeyManager
    const activeIndex = this.keyManager.activeItemIndex;
    return (
      activeIndex !== null &&
      activeIndex >= 0 &&
      this._allFlatOptions[activeIndex]?.id === option.id
    );
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
   * Método para suscribirse a las notificaciones del servicio DropdownManagerService
   * para cerrar el dropdown si otro componente de tipo dropdown se abre.
   */
  dropdownManager() {
    // Nos suscribimos a las notificaciones del servicio
    this._dropdownManagerService.dropdownOpened$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((openedComponent) => {
        // Si el componente notificado no es este mismo, ciérrate.
        if (openedComponent !== this) this.closeDropdown();
      });
  }

  /**
   * Función para crear un id único para el label del checkbox
   */
  createUniqueId() {
    if (this._id()) return; // Si ya existe, no generamos otro
    const uniqueId = this._inputsUtilsService.createUniqueId('dropdown');
    this._id.set(uniqueId);
    this._labelId.set(`label_${uniqueId}`);
    this._panelId.set(`panel_${uniqueId}`);
    this._optionsId.set(`options_${uniqueId}`);
  }

  /**
   * Función para determinar si se debe usar scroll virtual.
   */
  get shouldUseVirtualScroll(): boolean {
    return this._allFlatOptions.length > VIRTUAL_SCROLL_THRESHOLD;
  }

  /**
   * Función para saber si una opción está seleccionada.
   * @param {DropdownOption} option
   * @returns {boolean}
   */
  isOptionSelected(option: DropdownOption): boolean {
    const value = this._value();
    return this.multiple()
      ? Array.isArray(value) && value.includes(option.value)
      : option.value === value;
  }

  /**
   * Procesa el contenido del dropdown, ya sea desde el input `content` o desde `ng-content`.
   * Adapta los `DropdownOptionComponent` y `DropdownOptionGroupComponent` a la estructura interna `DropdownOption`/`DropdownGroup`.
   */
  private async processContent(): Promise<void> {
    let rawContent: DropdownContent = [];

    // Priorizamos el input `content` si está presente.
    if (this.content()) {
      rawContent = this.content()!.map((rawItem) => {
        const item = rawItem as any;

        if (item.options && Array.isArray(item.options)) {
          return {
            label: item[this.labelField()] || item.label || '-',
            id:
              item.id ??
              this._inputsUtilsService.createUniqueId('option-group'),
            options: item.options.map((rawOpt: any) => {
              const opt = rawOpt as any;
              return {
                value: opt[this.valueField()],
                label: opt[this.labelField()],
                disabled: opt.disabled || false,
                id: opt.id ?? this._inputsUtilsService.createUniqueId('option'),
                idGroup: item.id ?? null,
              };
            }),
          } as DropdownGroup;
        } else {
          return {
            value: item[this.valueField()],
            label: item[this.labelField()],
            disabled: item.disabled || false,
            id: item.id ?? this._inputsUtilsService.createUniqueId('option'),
          } as DropdownOption;
        }
      });
    } else {
      // Si no hay `content`, procesamos contenido proyectado (grupos y opciones)
      this._groupsFromContent.forEach((groupCmp) => {
        const defaultGroupId =
          this._inputsUtilsService.createUniqueId('option-group');
        const defaultOptionId =
          this._inputsUtilsService.createUniqueId('option');

        const group: DropdownGroup = {
          label: groupCmp.label(),
          id: groupCmp._id() ?? defaultGroupId,
          disabled: groupCmp.disabled(),
          options: groupCmp.options.map((optCmp) => ({
            value: optCmp.value(),
            label: optCmp.displayLabel,
            disabled:
              (groupCmp.isDisabled ?? false) || (optCmp.isDisabled ?? false),
            id: optCmp._id() ?? defaultOptionId,
            idGroup: groupCmp._id() ?? null,
          })),
        };
        rawContent.push(group);
      });

      this._optionsFromContent.forEach((optCmp) => {
        const isPartOfGroup = this._groupsFromContent.some((g) =>
          g.options.some((o) => o === optCmp),
        );

        if (!isPartOfGroup) {
          const defaultID = this._inputsUtilsService.createUniqueId('option');
          rawContent.push({
            value: optCmp.value(),
            label: optCmp.displayLabel,
            disabled: optCmp.disabled(),
            id: optCmp._id() ?? defaultID,
            idGroup: null,
          });
        }
      });
    }

    // Aplanamos y filtramos las opciones
    this.flattenAndFilterOptions(rawContent);
  }

  /**
   * Obtiene el índice de una opción aplanada en la lista de opciones filtradas.
   * Esto es útil para la navegación por teclado y para mantener el estado del resaltado.
   * @param {DropdownOption} option - La opción para la cual se busca el índice.
   * @returns {number} El índice de la opción en la lista aplanada.
   */
  getFlatOptionIndex(option: DropdownOption): number {
    return this._allFlatOptions.findIndex(
      (flatOpt) => flatOpt.id === option.id || flatOpt.value === option.value,
    );
  }

  /**
   * Maneja la selección de una opción.
   * @param {DropdownOption} option - La opción seleccionada.
   */
  selectOption(option: DropdownOption): void {
    if (option.disabled) return;

    let newValue;
    if (this.multiple()) {
      const currentValues = Array.isArray(this._value())
        ? [...this._value()]
        : [];
      if (currentValues.includes(option.value)) {
        newValue = currentValues.filter((val) => val !== option.value);
      } else {
        newValue = [...currentValues, option.value];
      }
    } else {
      // Si el valor es el mismo, lo deseleccionamos
      newValue = this._value() === option.value ? null : option.value;
      this.closeDropdown(); // Cerrar solo si no es múltiple
    }

    this._value.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
    this.optionSelected.emit(option);

    if (!this.multiple()) setTimeout(() => this.onTouched());
  }

  /**
   * Selecciona una opción por su índice en la lista aplanada de opciones.
   * @param {number | null} index - El índice de la opción a seleccionar.
   */
  selectOptionByIndex(index: number | null) {
    if (
      index === null ||
      index === undefined ||
      index < 0 ||
      index >= this._allFlatOptions.length
    )
      return;

    const option = this._allFlatOptions[index];
    this.selectOption(option);
  }

  /**
   * Filtra las opciones basadas en el término de búsqueda.
   */
  onSearchTerm() {
    this.searchTerm$.next(this.searchTerm());
  }

  /**
   * Aplana las opciones y las filtra según el término de búsqueda.
   * Se usa para la renderización y la navegación por teclado.
   */
  private flattenAndFilterOptions(sourceContent: DropdownContent): void {
    this._allFlatOptions = [];
    const filtered: (DropdownOption | DropdownGroup)[] = [];

    sourceContent.forEach((item) => {
      if ('options' in item) {
        // Es un grupo
        const groupOptions: DropdownOption[] = [];
        item.options.forEach((opt) => {
          if (this.matchesSearchTerm(opt)) {
            groupOptions.push(opt);
            this._allFlatOptions.push(opt);
          }
        });
        if (groupOptions.length > 0) {
          filtered.push({ ...item, options: groupOptions });
        }
      } else {
        // Es una opción simple
        if (this.matchesSearchTerm(item)) {
          filtered.push(item);
          this._allFlatOptions.push(item);
        }
      }
    });
    this.filteredOptions.set(filtered);
  }

  /**
   * Comprueba si una opción coincide con el término de búsqueda.
   * Este método normaliza tanto la opción como el término de búsqueda
   * para hacer una comparación insensible a mayúsculas y acentos, evitando problemas
   * de localización y acentos.
   * Además, permite una búsqueda inteligente donde cada palabra del término
   * debe aparecer en el label de la opción, pudiendo buscar por múltiples palabras.
   * @param {DropdownOption} option - La opción a comprobar.
   * @returns {boolean} - Devuelve true si la opción coincide con el término de búsqueda, false en caso contrario.
   */
  private matchesSearchTerm(option: DropdownOption): boolean {
    const normalize = (str: string) =>
      str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    const label = normalize(option.label);
    const searchTerms = normalize(this.searchTerm())
      .split(/\s+/) // separa por espacios
      .filter((term) => term); // quita vacíos

    // Cada palabra del término debe aparecer en el label
    return searchTerms.every((partial) => label.includes(partial));
  }

  /**
   * Método para suscrbirnos al cambio del término de búsqueda.
   * Utiliza debounce para evitar llamadas excesivas al filtrar las opciones, mejorando el rendimiento.
   * Esta función se llama al inicializar el componente y cada vez que cambia el término de búsqueda.
   * Además, se asegura de que el scroll virtual se reinicie al cambiar el término de búsqueda.
   * También se asegura de que el KeyManager se reinicie al cambiar el término de búsqueda.
   */
  private onSearchTermChange() {
    // Calculamos el tiempo de debounce según el número de opciones
    // y si se está usando scroll virtual o no. De esta forma, optimizamos,
    // ya que si hay pocas opciones, no necesitamos tanto tiempo de debounce.
    // Si hay muchas opciones, el debounce es mayor para evitar llamadas excesivas.
    const itemCount = this._allFlatOptions.length;
    let dTimeSearch = 200; // Tiempo de debounce por defecto
    if (this.virtualScroll) {
      if (itemCount < 100) dTimeSearch = 150;
      if (itemCount < 500) dTimeSearch = 200;
      dTimeSearch = 300;
    } else {
      if (itemCount < 100) dTimeSearch = 100;
      if (itemCount < 500) dTimeSearch = 150;
      dTimeSearch = 200;
    }

    // Nos suscribimos al término de búsqueda y filtramos las opciones
    // usando debounce para evitar llamadas excesivas al filtrar.
    this.searchTerm$
      .pipe(
        debounceTime(dTimeSearch),
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(() => {
        this.processContent().then(() => {
          if (this.virtualScroll) this.virtualScroll.scrollToIndex(0);
          setTimeout(() => {
            this.keyManager.setFirstItemActive();
            this.focusOption(this.keyManager.activeItemIndex);
            if (this.inputSearch) this.inputSearch.nativeInputElement.focus();
          }, 100);
          this._changeDetector.detectChanges();
        });
      });
  }

  /**
   * Comprueba si un elemento es un grupo de opciones.
   * Esto es útil para diferenciar entre opciones simples y grupos de opciones.
   * @param {DropdownOption | DropdownGroup} item
   * @returns {boolean}
   */
  isDropdownGroup(item: DropdownOption | DropdownGroup): item is DropdownGroup {
    return 'options' in item && Array.isArray((item as any).options);
  }

  /**
   * Obtiene la etiqueta para mostrar en el input principal.
   */
  get displayLabel(): string {
    // Si es múltiple y tiene valores, mostramos los valores seleccionados usando la traduccion correspondiente
    // Si es múltiple y no tiene valores, mostramos el placeholder o la traducción correspondiente
    // Si no es múltiple, mostramos el placeholder si no hay valor seleccionado o el label de la opción seleccionada.
    if (this.multiple()) {
      const selectedOptions = this._allFlatOptions.filter((opt) =>
        this.isOptionSelected(opt),
      );
      if (selectedOptions.length > 0) {
        return this._translations.multipleChoices.replace(
          '{choices}',
          this._value()?.length.toString(),
        );
      } else {
        return this.placeholder() || this._translations.selectOptions;
      }
    } else {
      const selectedOption = this._allFlatOptions.find((opt) =>
        this.isOptionSelected(opt),
      );
      return (
        selectedOption?.label ||
        this.placeholder() ||
        this._translations.selectOption
      );
    }
  }

  /**
   * Establece el foco en una opción específica y se asegura de que sea visible en el virtual scroll.
   * Aunque estamos usando `KeyManager` para la navegación por teclado,
   * este método es útil para establecer el foco en la posición del scroll que queremos.
   * @param {number | null} index - El índice de la opción a enfocar. Si es null, no se hace nada.
   */
  private focusOption(index: number | null): void {
    // Si el índice es null o fuera de rango, no hacemos nada
    if (
      index == null || // null o undefined
      index < 0 ||
      index >= this._allFlatOptions.length
    ) {
      return;
    }

    // Si se está usando scroll virtual, desplazamos el viewport al índice
    // y enfocamos la opción correspondiente.
    if (this.shouldUseVirtualScroll && this.virtualScroll) {
      // Si el elemento ya es visible, no hacemos nada para evitar un scroll innecesario
      if (this.virtualScroll.getRenderedRange().end > index) return;

      // Hacemos el scroll virtual al índice del listado
      this.virtualScroll.scrollToIndex(index, 'instant');

      // Forzamos el scroll para que el elemento sea visible y
      // quede en la posición correcta, como si no fuese virtual.
      setTimeout(() => {
        const elementToScroll =
          this.optionButtons.get(index)?.elementRef.nativeElement;
        elementToScroll?.scrollIntoView({
          behavior: 'instant', // Desplazamiento instantáneo
          block: 'end', // Alinea el elemento al final del contenedor
          inline: 'nearest', // Alinea el elemento al borde más cercano
        });
      });
    }
    // Si no se usa scroll virtual, simplemente enfocamos la opción, usando el elemento nativo.
    else {
      setTimeout(() => {
        // Obtenemos el elemento del índice y le damos foco
        const elementToScroll = this.optionButtons.get(index);

        // Si el elemento existe, le damos foco y lo desplazamos a la vista
        if (elementToScroll) {
          elementToScroll.focus(); // Enfocar el elemento
          elementToScroll.elementRef.nativeElement.scrollIntoView({
            behavior: 'instant', // Desplazamiento instantáneo
            block: 'end', // Alinea el elemento al final del contenedor
            inline: 'nearest', // Alinea el elemento al borde más cercano
          });
        }
      });
    }
  }

  /**
   * Método para obtener la altura de un item para el Virtual Scroll (si es fijo).
   * Esto es crucial para que el Virtual Scroll funcione correctamente.
   * Devuelve la altura del item según el tamaño del input configurado.
   * Estos tamaños pueden ser: xs, s, xm, m, l, xl.
   * Además sumamos el espacio vertical entre items y el padding de opciones.
   * @returns {number} Altura del item en píxeles.
   */
  getItemSize(): number {
    const size = this.inputSize();
    const height = DropdownSizesInPx[size as keyof typeof DropdownSizesInPx];
    return (
      (height ?? DropdownSizesInPx.m) +
      VERTICAL_GAP_IN_PX +
      PADDING_OPTIONS_IN_PX
    );
  }

  /**
   * Abre o cierra el panel del dropdown.
   */
  toggleDropdown(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    // Si el dropdown está deshabilitado, no hacemos nada
    if (this._disabled()) return;

    // Si se abre, reseteamos el término de búsqueda y el índice resaltado
    if (!this.isOpen()) this.openDropdown();
    else this.closeDropdown();
  }

  /**
   * Función para abrir el dropdown.
   */
  openDropdown($event?: Event) {
    $event?.preventDefault();
    $event?.stopPropagation();

    if (this._disabled() || this.isOpen()) return;
    this.isOpen.set(true);
    this.searchTerm.set('');
    this.processContent();
    this.initKeyManager();
    this._dropdownManagerService.notifyOpened(this);
    this.onOverlayAttached();
    this.openChange.emit(true);
  }

  /**
   * Función para cerrar el dropdown.
   */
  closeDropdown() {
    this.isOpen.set(false);
    this.onOverlayDetached();
    this.openChange.emit(false);
  }

  /**
   * Manejador para cuando el overlay se ha adjuntado.
   * Aquí se puede manejar la lógica de inicialización o de resaltado de opciones.
   * Por ejemplo, establecer el foco en la primera opción o en el input de búsqueda.
   * Esto es importante para la accesibilidad y la experiencia del usuario.
   */
  onOverlayAttached(): void {
    // Obtenemos el ancho del dropdownInput cuando el overlay se adjunta
    // y así poder ajustar el ancho del overlay al del input.
    // Esto es útil para que el overlay se vea bien alineado con el input.
    if (this.dropdownInput)
      this._dropdownWidth.set(this.dropdownInput.nativeElement.offsetWidth);
  }

  /**
   * Manejador para cuando el overlay se ha cerrado.
   * Aquí se puede manejar la lógica de limpieza o de retorno del foco.
   * Por ejemplo, asegurarse de que el foco regrese al trigger principal del dropdown.
   * Esto es importante para la accesibilidad después de que el overlay se ha ido.
   */
  onOverlayDetached(): void {
    setTimeout(() => this.onTouched());
  }

  /**
   * Función para generar un `title` para el dropdown
   * con las label de las opciones seleccionadas.
   * Esto es útil para mostrar un tooltip con las opciones seleccionadas.
   * @returns {string} El título con las etiquetas de las opciones seleccionadas.
   */
  getTitle(): string {
    if (this.multiple()) {
      const selectedOptions = this._allFlatOptions.filter((opt) =>
        this.isOptionSelected(opt),
      );
      return (
        selectedOptions.map((opt) => opt.label).join(', ') ||
        this.displayLabel ||
        this.placeholder()
      );
    } else {
      const selectedOption = this._allFlatOptions.find(
        (opt) => opt.value === this._value(),
      );
      return selectedOption?.label || this.displayLabel || this.placeholder();
    }
  }

  /**
   * Limpia la selección actual.
   */
  clearSelection(): void {
    this._value.set(null);
    this.onChange(null);
    this.valueChange.emit(null);
    this.closeDropdown();
    setTimeout(() => this.onTouched());
  }

  /**
   * Manejador de evento para cuando se pierde el foco del dropdown.
   * Emite el evento de blur y llama a onTouched para marcar el control como toc
   */
  onBlur() {
    if (this._disabled() || this.isOpen()) return;
    this._changeDetector.detectChanges();
    this.blur.emit();
    this.onTouched();
  }

  /**
   * ControlValueAccessor implementation
   */
  writeValue(value: any): void {
    this._value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}
