import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  AbstractControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import {
  InputNumberButton,
  InputNumberButtons,
  InputNumberButtonType,
  InputNumberCurrencyPosition,
  InputNumberTextAlign,
  InputNumberType,
} from '../models/form-field.model';
import { NEOUI_COMPONENT_CONFIG } from '@shared/configs/component.config';
import { InputsUtilsService } from '../services/inputs-utils.service';
import { DEFAULT_SIZE } from '@shared/configs/component.consts';
import { ComponentSize } from '@shared/configs/component.model';
import { NEOUI_TRANSLATIONS } from '@shared/translations/translations.token';
import {
  DEFAULT_CURRENTY_CODE,
  DEFAULT_LOCALE,
  DEFAULT_LOCALE_CURRENCY,
} from './models/defaul-locale-currency';

@Component({
  selector: 'neo-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true,
    },
  ],
})
export class InputNumberComponent
  implements ControlValueAccessor, OnInit, OnChanges
{
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  // Permite crear un "ng-template" para añadir un prefijo o sufijo al input
  @ContentChild('prefix') prefixTpl?: TemplateRef<any>;
  @ContentChild('suffix') suffixTpl?: TemplateRef<any>;

  @Input({ transform: booleanAttribute }) autofocus?: boolean = false;
  @Input({ transform: booleanAttribute }) readonly?: boolean = false;
  @Input({ transform: booleanAttribute }) required: boolean = false;
  @Input({ transform: booleanAttribute }) useGrouping: boolean = false;
  @Input() title?: string;
  @Input() label?: string;
  @Input() name?: string;
  @Input() placeholder: string = '';
  @Input() mode: InputNumberType = 'integer';
  @Input() currencyCode: string | null = null;
  @Input() currencyPosition: InputNumberCurrencyPosition | null = null;
  @Input() align: InputNumberTextAlign = 'right';
  @Input() minFractionDigits: number = 0;
  @Input() maxFractionDigits: number = 2;
  @Input() locale: string = DEFAULT_LOCALE;
  @Input() showButtons: boolean = false;
  @Input() buttonsPosition: InputNumberButtons = 'inside';
  @Input() step: number = 1;
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input('aria-label') ariaLabel!: string;
  @Input('aria-labelledby') ariaLabelledBy!: string;
  @Input('aria-owns') ariaOwns!: string;
  @Input('aria-describedby') ariaDescribedBy!: string;
  @Input('aria-autocomplete') ariaAutocomplete: 'none' | 'inline' | 'list' =
    'none';

  @Input() prefixIcon?: string;
  @Input() suffixIcon?: string;
  @Input() prefix?: string;
  @Input() suffix?: string;
  @Input() titlePrefix!: string;
  @Input() titleSuffix!: string;
  @Input({ transform: booleanAttribute }) bgPrefix?: boolean = false;
  @Input({ transform: booleanAttribute }) bgSuffix?: boolean = false;
  @Input({ transform: booleanAttribute }) prefixInside = false;
  @Input({ transform: booleanAttribute }) suffixInside = false;
  @Input({ transform: booleanAttribute }) prefixClickable = false;
  @Input({ transform: booleanAttribute }) suffixClickable = false;

  /**
   * Tamaño del input del dropdown.
   */
  _inputSize: WritableSignal<ComponentSize> = signal(DEFAULT_SIZE);
  @Input()
  set inputSize(value: ComponentSize) {
    this._inputSize.set(value || this.globalConfig.defaultSize || DEFAULT_SIZE);
  }
  get inputSize(): ComponentSize {
    return this._inputSize();
  }

  /**
   * Input para crear un id único para el campo
   */
  _id: WritableSignal<string> = signal('');
  _labelId: WritableSignal<string> = signal('');
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
  _disabled: WritableSignal<boolean> = signal(false);
  @Input() set disabled(status: boolean) {
    this._disabled.set(status);
  }

  get disabled() {
    return this._disabled();
  }

  /**
   * Input para introducir el valor del campo
   */
  _value: WritableSignal<number | null> = signal(null);
  @Input() set value(value: number | null) {
    this._value.set(value);
  }
  get value(): number | null {
    return this._value();
  }

  @Output() change = new EventEmitter<number | null>();
  @Output() blur = new EventEmitter<void>();
  @Output() prefixClick = new EventEmitter<void>();
  @Output() suffixClick = new EventEmitter<void>();

  INPUT_NUMBER_BUTTON = InputNumberButton;

  public displayValue: string = ''; // Valor que se muestra en el input
  public currencySymbol: string = ''; // Símbolo de la moneda, si se usa el modo 'currency'
  public focused: boolean = false;

  private decimalSeparator: string = '';
  private thousandSeparator: string = '';
  private minusSign: string = '';
  private currentCaretPosition: number | null = null;
  private localeCurrencyMap: Record<string, string> = {};

  private longPressTimer: any; // Temporizador para el retardo inicial de la pulsación larga
  private longPressInterval: any; // Intervalo para la repetición continua
  private readonly LONG_PRESS_DELAY = 250; // Retardo antes de que empiece la repetición (ms)
  private readonly LONG_PRESS_RATE = 100; // Frecuencia de repetición (ms)

  protected readonly _translations = inject(NEOUI_TRANSLATIONS);
  private readonly _inputsUtilsService = inject(InputsUtilsService);
  private readonly globalConfig = inject(NEOUI_COMPONENT_CONFIG);

  constructor() {
    this.updateSeparators();
    this.initDefaultLocaleCurrencyMap();
    this.updateCurrencySymbol();
  }

  ngOnInit(): void {
    this.setProperties();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['locale'] || changes['currencyCode'] || changes['mode']) {
      // Re-detectar separadores y simbolo si cambian locale, currencyCode o mode
      this.updateSeparators();
      this.updateCurrencySymbol();

      // Re-formatear el valor actual si ya existe
      this.displayValue = this.formatNumber(this.value);
    }
    // Re-formatear el valor si cambian useGrouping, min/maxFractionDigits
    if (
      changes['useGrouping'] ||
      changes['minFractionDigits'] ||
      changes['maxFractionDigits']
    ) {
      this.displayValue = this.formatNumber(this.value);
    }
  }

  ngAfterViewInit(): void {
    this.createUniqueId();
  }

  /**
   * Método para convertir los `locale` por defecto en un acceso rápido mapeado
   */
  private initDefaultLocaleCurrencyMap() {
    DEFAULT_LOCALE_CURRENCY.forEach(({ locale, currency }) => {
      this.localeCurrencyMap[locale] = currency;
    });
  }

  /**
   * Método para establecer las propiedades por defecto del componente.
   */
  setProperties(): void {
    if (this.inputSize) this._inputSize.set(this.inputSize);
  }

  /**
   * Función para crear un id único para el label del input
   */
  createUniqueId(): void {
    if (this._id()) return;
    this._id?.set(this._inputsUtilsService.createUniqueId('input'));
    this._labelId?.set(`label_${this._id()}`);
  }

  /**
   * Función para obtener el aria-describedby personalizado
   * que incluye el hint y el error del campo.
   * @return {string}
   */
  get ariaDescribedByCustom(): string {
    return this._inputsUtilsService.getAriaDescribedBy(this._id(), [
      'hint',
      'error',
    ]);
  }

  /**
   * Función para obtener el elemento nativo del input
   */
  get nativeElement(): HTMLInputElement {
    return this.inputElement.nativeElement;
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    const parsedValue = this.parseInputToNumber(value?.toString() || '');
    this._value.set(this.applyRangeAndPrecision(parsedValue));
    this.displayValue = this.formatNumber(this.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Método para manejar y sanear manualmente el valor que el usuario introduce un valor, haciendo lo siguiente:
   * - Limpiar y validar el texto que el usuario escribe (o pega).
   * - Convertirlo a número según las reglas del componente (decimal, currency, número negativo...).
   * - Aplicar precisión, límites y formato.
   * - Restaurar la posición del cursor correctamente tras actualizar el valor mostrado.
   * @param {string} inputValue - El valor introducido por el usuario.
   */
  onUserInput(inputValue: string): void {
    const inputElement = this.inputElement.nativeElement;
    this.currentCaretPosition = inputElement.selectionStart;

    let cleanedValue = '';
    let decimalEncountered = false;
    let fractionDigitsCount = 0;

    // Iteramos sobre cada carácter del input
    for (let i = 0; i < inputValue.length; i++) {
      const char = inputValue[i];

      // Si el carácter es un dígito, lo añadimos al valor limpio
      if (/[0-9]/.test(char)) {
        // Si estamos en modo decimal o currency, controlamos los dígitos decimales
        // Si no, solo permitimos dígitos enteros
        if (decimalEncountered) {
          // Si ya hemos encontrado un punto decimal, solo permitimos dígitos hasta maxFractionDigits
          if (fractionDigitsCount < this.maxFractionDigits) {
            cleanedValue += char;
            fractionDigitsCount++;
          }
        } else {
          cleanedValue += char;
        }
      }
      // Si el carácter es un separador de miles, lo ignoramos
      else if (
        char === this.decimalSeparator &&
        (this.mode === 'decimal' || this.mode === 'currency') &&
        !decimalEncountered
      ) {
        cleanedValue += char;
        decimalEncountered = true;
      }
      // Si el carácter es un signo menos, lo permitimos solo al inicio
      else if (
        char === this.minusSign &&
        cleanedValue.indexOf(this.minusSign) === -1 &&
        i === 0
      ) {
        cleanedValue += char;
      }
    }

    // Si el valor es solo el signo menos, lo tratamos como nulo
    if (cleanedValue === this.minusSign) {
      this._value.set(null);
    } else {
      const parsedValue = this.parseInputToNumber(cleanedValue);
      this._value.set(this.applyRangeAndPrecision(parsedValue));
    }

    // Formateamos el valor para mostrarlo en el input
    this.displayValue = cleanedValue;

    // Emitimos el cambio
    this.onChange(this._value);
    this.change.emit(this.value);

    // Si el caret (cursor) estaba en una posición válida, lo mantenemos
    // Esto es importante para que el usuario no pierda su posición al escribir.
    if (
      this.currentCaretPosition !== null &&
      this.currentCaretPosition !== undefined &&
      inputElement.value.length >= this.currentCaretPosition
    ) {
      // Usamos requestAnimationFrame para asegurarnos de que el DOM esté actualizado
      // antes de intentar mover el cursor para evitar problemas de sincronización.
      requestAnimationFrame(() => {
        const newCaretPos = Math.min(
          this.currentCaretPosition!,
          inputElement.value.length,
        );
        inputElement.setSelectionRange(newCaretPos, newCaretPos);
      });
    }
  }

  /**
   * Método que emitirá valor al salir del input
   */
  onBlur(): void {
    this.onTouched();
    this.displayValue = this.formatNumber(this.value);
    this.onChange(this._value);
    this.focused = false;
    this.blur.emit();
  }

  /**
   * Función para manejar el evento de clic en el prefijo del input
   * Emite un evento para que el componente padre pueda reaccionar
   */
  prefixClicked() {
    this.prefixClick.emit();
  }

  /**
   * Función para manejar el evento de clic en el sufijo del input
   * Emite un evento para que el componente padre pueda reaccionar
   */
  suffixClicked() {
    this.suffixClick.emit();
  }

  /**
   * Método para controlar la pulsación mediante ratón o táctil
   * y poder incrementar o decrementar el valor del input al mantener pulsado.
   * @param {MouseEvent | TouchEvent} event - Evento de ratón o táctil.
   * @param {InputNumberButtonType} type - Tipo de acción a realizar.
   */
  onButtonPointerDown(
    event: MouseEvent | TouchEvent,
    type: InputNumberButtonType,
  ): void {
    event.preventDefault();
    this.onTouched(); // Marca el control como 'touched'

    if (this.disabled) return;

    // Limpia los temporizadores de pulsación larga anteriores
    this.clearLongPressTimers(); // Asegura que no haya otros temporizadores activos

    // Realiza una única acción inmediata al presionar (para el clic corto)
    if (type === InputNumberButton.INCREMENT) this.increment();
    else this.decrement();

    // Inicia un temporizador para detectar la pulsación larga
    this.longPressTimer = setTimeout(() => {
      // Si se mantiene presionado después del retardo inicial, inicia el intervalo de repetición
      this.longPressInterval = setInterval(() => {
        if (type === InputNumberButton.INCREMENT) {
          this.increment();
        } else {
          this.decrement();
        }
      }, this.LONG_PRESS_RATE);
    }, this.LONG_PRESS_DELAY);
  }

  /**
   * Manejador para el evento de soltar el botón del ratón o tocar la pantalla.
   * Limpia los temporizadores de pulsación larga para evitar acciones continuas.
   * Detiene los temporizadores cuando el botón se suelta
   */
  onButtonPointerUp(): void {
    this.clearLongPressTimers();
  }

  /**
   * Función para limpiar los temporizadores de pulsación larga
   * para evitar que se sigan ejecutando acciones de incremento/decremento.
   * Esto es importante para evitar que se sigan ejecutando acciones
   * de incremento/decremento después de soltar el botón.
   */
  private clearLongPressTimers(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    if (this.longPressInterval) {
      clearInterval(this.longPressInterval);
      this.longPressInterval = null;
    }
  }

  /**
   * Función para controlar la pulsación de teclas en el input
   * Permite manejar la entrada del usuario y aplicar las reglas de formato.
   * Por ejemplo, permite números, separadores decimales y controla la posición del cursor.
   * También maneja las flechas arriba/abajo para incrementar/decrementar el valor.
   * Evita caracteres no permitidos y asegura que el formato se mantenga correcto.
   * @param {KeyboardEvent} event - Evento de teclado.
   */
  onKeyDown(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const caretPos = inputElement.selectionStart;
    const currentText = inputElement.value;

    // Permite teclas especiales y navegación
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ];

    // Comprobamos si el evento es una tecla de navegación o de edición
    const isNumber = /[0-9]/.test(event.key);
    const isDecimal =
      (this.mode === 'decimal' || this.mode === 'currency') &&
      event.key === this.decimalSeparator;
    const isMinus = event.key === this.minusSign;

    // Lógica para las flechas arriba/abajo (NUEVO)
    if (event.key === 'ArrowUp') {
      this.increment();
      event.preventDefault(); // Evita el desplazamiento de la página
      return;
    } else if (event.key === 'ArrowDown') {
      this.decrement();
      event.preventDefault(); // Evita el desplazamiento de la página
      return;
    }

    // 1. Prevenir caracteres no permitidos en general
    if (
      !isNumber &&
      !allowedKeys.includes(event.key) &&
      !isDecimal &&
      !isMinus
    ) {
      event.preventDefault();
      return;
    }

    // 2. Lógica específica para prevenir decimales excesivos en tiempo real
    if (
      (this.mode === 'decimal' || this.mode === 'currency') &&
      isNumber &&
      caretPos !== null
    ) {
      const decimalIndex = currentText.indexOf(this.decimalSeparator);

      // Si ya hay un separador decimal y el cursor está DESPUÉS del separador
      if (decimalIndex !== -1 && caretPos > decimalIndex) {
        const fractionDigitsAfterCaret = currentText.length - caretPos; // Dígitos después del cursor
        const existingFractionDigits = currentText.length - 1 - decimalIndex; // Total de dígitos decimales actuales

        // Si al añadir un nuevo dígito, el total de dígitos decimales excede maxFractionDigits
        // Esto cubre tanto la inserción como la sobrescritura de un solo carácter
        if (existingFractionDigits >= this.maxFractionDigits) {
          event.preventDefault(); // Impedir que el carácter se escriba
          return;
        }
      }
    }

    // 3. Manejo del separador decimal si ya existe (mover cursor)
    if (isDecimal && caretPos !== null) {
      const decimalIndex = currentText.indexOf(this.decimalSeparator);
      if (decimalIndex !== -1) {
        // Si el separador ya está en el input
        event.preventDefault(); // Impedir que se añada otro separador
        // Mover el cursor después del separador si está antes o en él
        if (caretPos <= decimalIndex) {
          setTimeout(() => {
            inputElement.setSelectionRange(decimalIndex + 1, decimalIndex + 1);
          }, 0);
        }
        return;
      }
    }

    // 4. Manejo de las flechas arriba/abajo para incrementar/decrementar
    if (event.key === 'ArrowUp') {
      this.increment();
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      this.decrement();
      event.preventDefault();
    }
  }

  /**
   * Función para incrementar el valor del input.
   * Aumenta el valor actual en el paso definido y aplica los límites de rango y precisión.
   */
  increment(): void {
    if (this.disabled) return;
    let newValue = (this.value === null ? 0 : this.value) + this.step;
    this._value.set(this.applyRangeAndPrecision(newValue));
    this.displayValue = this.formatNumber(this.value);
    this.onChange(this._value);
  }

  /**
   * Función para disminuir el valor del input.
   * Aumenta el valor actual en el paso definido y aplica los límites de rango y precisión.
   */
  decrement(): void {
    if (this.disabled) return;
    let newValue = (this.value === null ? 0 : this.value) - this.step;
    this._value.set(this.applyRangeAndPrecision(newValue));
    this.displayValue = this.formatNumber(this.value);
    this.onChange(this._value);
  }

  /**
   * Función para actualizar los separadores de miles y decimales en base al locale actual.
   * Utiliza Intl.NumberFormat para obtener los separadores correctos.
   * Esto es importante para que el formato del número se muestre correctamente
   * según la configuración regional del usuario o la indicada en el componente.
   */
  private updateSeparators(): void {
    const formatter = new Intl.NumberFormat(this.locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      useGrouping: true,
      signDisplay: 'always',
    });
    const parts = formatter.formatToParts(-1000.1);

    this.decimalSeparator =
      parts.find((p) => p.type === 'decimal')?.value || '.';
    this.thousandSeparator = parts.find((p) => p.type === 'group')?.value || '';
    this.minusSign = parts.find((p) => p.type === 'minusSign')?.value || '-';
  }

  /**
   * Función para actualizar el símbolo de la moneda y
   * determinar su posición (izquierda o derecha) en base al locale y currencyCode
   * Utiliza Intl.NumberFormat para obtener el símbolo de la moneda y su posición.
   */
  private updateCurrencySymbol() {
    // Obtenemos el símbolo de la moneda si el modo es 'currency'
    if (this.mode === 'currency') {
      // Usamos el locale para obtener el código de moneda por defecto
      const currencyCode =
        this.currencyCode ??
        this.localeCurrencyMap[this.locale] ??
        DEFAULT_CURRENTY_CODE;

      // Formateamos el número 0 para obtener el símbolo de la moneda
      const currencyFormatter = new Intl.NumberFormat(this.locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: this.minFractionDigits,
        maximumFractionDigits: this.maxFractionDigits,
      });

      // Obtenemos las partes del formato de moneda
      // y determinamos la posición del símbolo de la moneda y el símbolo en sí
      const parts = currencyFormatter.formatToParts(0);
      const currencyPart = parts.find((p) => p.type === 'currency');
      const currencyIndex = parts.findIndex((p) => p.type === 'currency');
      const integerIndex = parts.findIndex((p) => p.type === 'integer');

      const positionSymbol: InputNumberCurrencyPosition =
        currencyIndex < integerIndex ? 'left' : 'right';
      this.currencySymbol = currencyPart?.value ?? '';
      this.currencyPosition = this.currencyPosition ?? positionSymbol;
    }
  }

  /**
   * Función para formatear un número según las reglas del componente.
   * Utiliza Intl.NumberFormat para aplicar el formato correcto según el locale,
   * los separadores de miles y decimales, y la precisión.
   * Si el valor es nulo, devuelve una cadena vacía.
   * @param {number | null} value - El valor a formatear.
   * @returns {string} - El valor formateado como cadena.
   * @example formatNumber(1234567.89) => "1,234,567.89"
   * @example formatNumber(null) => ""
   * @example formatNumber(1234.5) => "1,234.50"
   * @example formatNumber(1234.56789) => "1,234.
   */
  private formatNumber(value: number | null): string {
    if (value === null) {
      return '';
    }

    let formatted = new Intl.NumberFormat(this.locale, {
      minimumFractionDigits: this.minFractionDigits,
      maximumFractionDigits: this.maxFractionDigits,
      useGrouping: this.useGrouping,
    }).format(value);

    return formatted;
  }

  /**
   * Función para convertir un valor de entrada (string) a un número.
   * Limpia el valor de entrada eliminando separadores de miles, reemplaza el separador decimal
   * y el signo menos, y luego convierte el valor a un número.
   * Si el valor no es un número válido, devuelve null.
   * @param {string} inputValue - El valor de entrada a convertir.
   * @returns {number | null} - El número convertido o null si no es válido
   * @example parseInputToNumber("1,234.56") => 1234.56
   * @example parseInputToNumber("1.234,56") => 1234.56
   * @example parseInputToNumber("-1,234.56") => -1234.56
   * @example parseInputToNumber("abc") => null
   * @example parseInputToNumber("") => null
   */
  private parseInputToNumber(inputValue: string): number | null {
    if (!inputValue) {
      return null;
    }

    let cleanValue = inputValue.replace(
      new RegExp(`\\${this.thousandSeparator}`, 'g'),
      '',
    );
    cleanValue = cleanValue.replace(this.decimalSeparator, '.');
    cleanValue = cleanValue.replace(this.minusSign, '-');

    let parsed = parseFloat(cleanValue);

    if (isNaN(parsed)) {
      return null;
    }

    if (this.mode === 'decimal' || this.mode === 'currency') {
      const numStr = parsed.toString();
      const decimalIndex = numStr.indexOf('.');
      if (decimalIndex !== -1) {
        const currentFractionDigits = numStr.length - 1 - decimalIndex;
        if (currentFractionDigits > this.maxFractionDigits) {
          const factor = Math.pow(10, this.maxFractionDigits);
          parsed = Math.round(parsed * factor) / factor;
        }
      }
    } else if (this.mode === 'integer') {
      parsed = Math.round(parsed);
    }

    return parsed;
  }

  /**
   * Aplica los límites de rango y precisión al valor.
   * Si el valor es nulo, devuelve nulo.
   * Si el valor es menor que el mínimo, lo ajusta al mínimo.
   * Si el valor es mayor que el máximo, lo ajusta al máximo.
   * Si el modo es 'decimal' o 'currency', redondea a la precisión máxima definida.
   * Si el modo es 'integer', redondea al entero más cercano.
   * @param {number | null} value - El valor a ajustar.
   * @returns {number | null} - El valor ajustado o nulo si el valor es nulo.
   * @example applyRangeAndPrecision(1234.567) => 1234.57 (si maxFractionDigits es 2)
   * @example applyRangeAndPrecision(null) => null
   */
  private applyRangeAndPrecision(value: number | null): number | null {
    // Si el valor es nulo, devolvemos nulo
    if (value === null) return null;

    let result = value;

    // Aplicamos los límites de rango
    if (this.min !== null && result < this.min) result = this.min;
    if (this.max !== null && result > this.max) result = this.max;

    // Si el modo es 'decimal' o 'currency', redondeamos a la precisión máxima
    // Si el modo es 'integer', redondeamos al entero más cercano
    if (this.mode === 'decimal' || this.mode === 'currency') {
      const factor = Math.pow(10, this.maxFractionDigits);
      result = Math.round(result * factor) / factor;
    } else if (this.mode === 'integer') {
      result = Math.round(result);
    }

    return result;
  }
}
