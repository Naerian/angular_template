import { A11yModule } from '@angular/cdk/a11y';
import { Overlay, OverlayModule, ScrollStrategy } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  inject,
  Input,
  input,
  InputSignal,
  Output,
  signal,
  ViewChild,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { FADE_IN_OUT_SCALE } from '@shared/animations/fade-in-out-scale.animation';
import { CalendarComponent } from '@shared/components/calendar/calendar.component';
import { InputsUtilsService } from '@shared/components/form-fields/services/inputs-utils.service';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import {
  CalendarType,
  DEFAULT_FORMAT,
  SelectionType,
} from '../../calendar/models/calendar.model';
import { InputAutocomplete, InputSize } from '../models/form-field.model';
import { OVERLAY_POSITIONS } from './models/input-date-picker.model';
import { DatePickerManagerService } from './services/date-picker-manager/date-picker-manager.service';
import { ShowClearFieldDirective } from '@shared/directives/show-clear-field.directive';
import { CalendarService } from '@shared/components/calendar/services/calendar.service';

/**
 * @name
 * neo-date-picker
 * @description
 * Componente para crear un campo de fecha con un calendario desplegable.
 * @example
 * <neo-date-picker [value]="'2021-12-31'" [format]="DEFAULT_FORMAT" (dateSelected)="dateSelected($event)"></neo-date-picker>
 */
@Component({
  selector: 'neo-date-picker',
  templateUrl: './input-date-picker.component.html',
  styleUrls: ['./input-date-picker.component.scss'],
  animations: [FADE_IN_OUT_SCALE],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    A11yModule,
    CalendarComponent,
    ShowClearFieldDirective,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDatePickerComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDatePickerComponent implements ControlValueAccessor {
  @ViewChild('calendarOverlay', { read: ElementRef })
  calendarOverlayRef!: ElementRef;

  @ViewChild('datePickerInput', { static: true })
  datePickerInput!: ElementRef<HTMLInputElement>;

  // Si el campo está deshabilitado, se añade el atributo "disabled" al input
  @Input({ transform: booleanAttribute }) autofocus?: boolean = false;

  // Si el campo es de solo lectura, se añade el atributo "readonly" al input
  @Input({ transform: booleanAttribute }) readonly?: boolean = false;

  // Si el campo es obligatorio, se añade el atributo "required" al input
  @Input({ transform: booleanAttribute }) required: boolean = false;

  // Título del campo, se usa para el label y el aria-label
  @Input() title?: string;

  // Etiqueta del campo, se usa para el label y el aria-label
  @Input() label?: string;

  // Nombre del campo, se usa para el aria-label y el aria-labelledby
  @Input() name?: string;

  // Tipo de calendario (day, week, range)
  @Input() type: SelectionType = CalendarType.DAY;

  // Placeholder del input
  @Input() placeholder: string = 'aaaa-mm-dd';

  // Icono del calendario
  @Input() icon?: string = 'ri-calendar-2-line';

  // Tipo de autocompletado del input
  @Input() autocomplete: InputAutocomplete = 'off';

  // Tamaño del input
  @Input() inputSize: InputSize = 'm';

  // Si se quiere mostrar el icono del calendario o no
  @Input() showIconCalendar: boolean = true;

  // Formato de fecha para mostrar en el campo
  @Input() format: string = DEFAULT_FORMAT;

  // Array de Fechas deshabilitadas, que no se pueden seleccionar
  @Input() disabledDates: (string | Date)[] | undefined = undefined;

  // Si se quiere bloquear el rango de fechas (range / week) si hay fechas deshabilitadas o no
  @Input() blockDisabledRanges: boolean | undefined = undefined;

  /**
   * Input para mostrar el botón de limpiar el campo
   */
  @Input({ transform: booleanAttribute }) showClear: boolean = false;

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
  _value: WritableSignal<string | string[] | null> = signal('');
  @Input() set value(value: string | string[] | null) {
    this._value.set(value);
  }

  get value(): string | string[] | null {
    return this._value();
  }

  /**
   * Input para añadir un aria-describedby al campo
   */
  @Input('aria-describedby') ariaDescribedBy!: string;

  @Output() dateSelected = new EventEmitter<Date | Date[] | null>();
  @Output() change = new EventEmitter<Date | Date[] | null>();
  @Output() blur = new EventEmitter<void>();

  isOpened: WritableSignal<boolean> = signal(false);
  scrollStrategy: ScrollStrategy;
  overlayPositions = OVERLAY_POSITIONS;

  // Fecha por defecto del calendario
  realDateValue: WritableSignal<Date | Date[] | null> = signal(null);

  private readonly overlay = inject(Overlay);
  private readonly _inputsUtilsService = inject(InputsUtilsService);
  private readonly _datePickerManagerService = inject(DatePickerManagerService);
  private readonly _calendarService = inject(CalendarService);
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  private ngUnsubscribe = new Subject<void>();

  constructor() {
    this.scrollStrategy = this.overlay.scrollStrategies.close();
  }

  /**
   * Método para cerrar el calendario al hacer click fuera del panel
   */
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    if (!this.isOpened()) return;
    const clickedInside = this.calendarOverlayRef?.nativeElement.contains(
      event.target as Node,
    );
    if (!clickedInside) this.closeCalendar();
  }

  ngAfterViewInit(): void {
    this.createUniqueId();
  }

  ngOnInit(): void {
    // Nos suscribimos a las notificaciones del servicio DatePickerManagerService
    this.datePickerManager();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Método para suscribirse a las notificaciones del servicio DatePickerManagerService
   * para cerrar el calendario si otro componente de tipo InputDatePicker se abre.
   */
  datePickerManager() {
    // Nos suscribimos a las notificaciones del servicio
    this._datePickerManagerService.datePickerOpened$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((openedComponent) => {
        // Si el componente notificado no es este mismo, ciérrate.
        if (openedComponent !== this) this.closeCalendar();
      });
  }

  /**
   * Función para crear un id único para el label del input
   */
  createUniqueId(): void {
    if (this._id()) return;
    this._id?.set(this._inputsUtilsService.createUniqueId('input-date-picker'));
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
   * Función del evento `input` del campo para obtener el valor introducido
   * @param {string} value
   */
  onInput(value: string) {
    this.setCalendarValue(value);
  }

  /**
   * Función del evento `blur` del campo para marcar el campo como "touched"
   */
  onBlur() {
    setTimeout(() => this.onTouched());
    this.blur.emit();
  }

  /**
   * Función para seleccionar una fecha
   * @param {Date | Date[] | string | string[] | null} value - Fecha o rango de fechas seleccionadas
   */
  setCalendarValue(value: Date | Date[] | string | string[] | null) {
    // Establecemos el valor del campo de fecha
    this.setValue(value);
    this.onChange(value);
    setTimeout(() => this.onTouched());

    // Emitimos el valor REAL
    this.dateSelected.emit(this.realDateValue());
    this.change.emit(this.realDateValue());

    // Cerramos el calendario
    this.closeCalendar();
  }

  /**
   * Función para establecer el valor del campo de fecha
   * @param {Date | Date[] | string | string[] | null} value - Fecha o rango de fechas a establecer
   */
  setValue(value: Date | Date[] | string | string[] | null) {
    // Si el valor es vacío, establecemos los valores como null
    if (this.isEmpty(value)) {
      this._setNullValues();
      return;
    }

    // Comprobamos si el valor es un string o un array de strings
    const isStringInput =
      typeof value === 'string' ||
      (Array.isArray(value) && typeof value[0] === 'string');

    // Si el valor es un string o un array de strings, lo parseamos como fecha
    // Si el valor es un Date o un array de Dates, lo parseamos como fecha
    if (isStringInput) {
      value = this.parseFromString(value as string | string[]);
    } else {
      value = this.parseFromDate(value as Date | Date[]);
    }

    // Si el valor es inválido, lo dejamos como null
    if (value === null) {
      this._setNullValues();
      return;
    }

    // Establecemos el valor visual del campo
    this.setVisualValue(value);
  }

  /**
   * Función para comprobar si un valor es vacío
   * @param {any} value - Valor a comprobar
   */
  private isEmpty(value: any): boolean {
    return (
      value === '' ||
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0)
    );
  }

  /**
   * Función para establecer los valores del campo como null
   * Esto se usa cuando el valor es vacío o inválido
   */
  private _setNullValues() {
    this._value.set(null);
    this.realDateValue.set(null);
  }

  /**
   * Función para parsear un valor desde un string o un array de strings
   * y convertirlo a una fecha o rango de fechas de tipo Date.
   * @param {string | string[]} value - Valor a parsear desde un string o un array de strings
   * @returns {Date | Date[] | null} - Fecha o rango de fechas parseadas, o null si el valor es inválido
   */
  private parseFromString(value: string | string[]): Date | Date[] | null {
    switch (this.type) {
      // Si es de tipo `range`, aseguramos que el valor es un array de dos elementos
      // y comprobamos que las fechas son válidas. Generaremos el rango completo
      // de fechas entre las dos fechas, mediante el inicio y el fin del rango.
      case CalendarType.RANGE:
        // Aseguramos que el valor es un array de dos elementos
        const range = this.ensureArrayOfTwo(value as string | string[]);
        if (this.hasInvalidDates(range)) return null;

        // Convertimos las fechas del rango a objetos Date
        const rangeDates = range.map((d) =>
          moment(d, this.format, true).toDate(),
        );

        // Obtenemos el rango completo de fechas entre las dos fechas,
        // mediante el inicio y el fin del rango
        const [start, end] = [
          moment(rangeDates[0]),
          moment(rangeDates[rangeDates.length - 1]),
        ];
        const fullRange = this._calendarService
          .getDatesBetween(start, end)
          .map((d) => d.toDate());

        this.realDateValue.set(fullRange);
        return fullRange;

      // Si es de tipo `week`, obtenemos las fechas de la semana
      // y las convertimos a objetos Date. Para ello usaremos el primer valor del array.
      case CalendarType.WEEK:
        const weekValue = Array.isArray(value) ? value[0] : value;
        const week = this.getWeekDates(moment(weekValue, this.format, true));
        this.realDateValue.set(week);
        return week;

      // Si es de tipo `day`, convertimos el valor a un objeto Date
      // y lo establecemos como el valor real del campo.
      default:
        const date = moment(value as string, this.format, true);
        if (!date.isValid()) return null;
        const result = date.toDate();
        this.realDateValue.set(result);
        return result;
    }
  }

  /**
   * Función para parsear un valor desde un objeto Date o un array de objetos Date
   * y convertirlo a una fecha o rango de fechas de tipo Date.
   * @param {Date | Date[]} value - Valor a parsear desde un objeto Date o un array de objetos Date
   * @returns {Date | Date[] | null} - Fecha o rango de fechas parseadas, o null si el valor es inválido
   */
  private parseFromDate(value: Date | Date[]): Date | Date[] | null {
    switch (this.type) {
      // Si es de tipo `range`, aseguramos que el valor es un array de dos elementos
      // y comprobamos que las fechas son válidas. Generaremos el rango completo
      // de fechas entre las dos fechas, mediante el inicio y el fin del rango.
      case CalendarType.RANGE:
        const range = this.ensureArrayOfTwo(value as Date | Date[]);
        if (this.hasInvalidDates(range)) return null;

        const [start, end] = [
          moment(range[0]),
          moment(range[range.length - 1]),
        ];
        const fullRange = this._calendarService
          .getDatesBetween(start, end)
          .map((d) => d.toDate());

        this.realDateValue.set(fullRange);
        return fullRange;

      // Si es de tipo `week`, obtenemos las fechas de la semana
      // y las convertimos a objetos Date. Para ello usaremos el primer valor del array.
      case CalendarType.WEEK:
        const date = Array.isArray(value) ? value[0] : value;
        const week = this.getWeekDates(moment(date));
        this.realDateValue.set(week);
        return week;

      // Si es de tipo `day`, convertimos el valor a un objeto Date
      // y lo establecemos como el valor real del campo.
      default:
        this.realDateValue.set(value as Date);
        return value;
    }
  }

  /**
   * Función para asegurar que el valor es un array de dos elementos,
   * si no lo es, lo convierte en un array con el mismo valor repetido dos veces.
   * De este modo, un input de tipo `range` siempre tendrá un array de dos fechas.
   * @param {string | Date | string[] | Date[]} value - Valor a asegurar que es un array de dos elementos
   * @returns {string[] | Date[]} - Un array de dos elementos con el valor proporcionado
   */
  private ensureArrayOfTwo(
    value: string | Date | string[] | Date[],
  ): string[] | Date[] {
    // Si no es un array o es un array de un solo elemento,
    // lo convertimos en un array con el mismo valor repetido dos veces.
    if (!Array.isArray(value) || value.length === 1) {
      return [value as any, value as any];
    }

    // Si es un array normal, lo devolvemos tal cual.
    return value as string[] | Date[];
  }

  /**
   * Función para comprobar si hay fechas inválidas en un array de fechas
   * @param {string[] | Date[]} dates - Array de fechas a comprobar
   * @returns {boolean} - Devuelve true si hay fechas inválidas, false en
   */
  private hasInvalidDates(dates: string[] | Date[]): boolean {
    return dates.some((d) => !moment(d, this.format, true).isValid());
  }

  /**
   * Función para obtener las fechas de una semana a partir de una fecha dada
   * @param {moment.Moment} date - Fecha de referencia para obtener la semana
   * @return {Date[]} - Array de fechas de la semana
   */
  private getWeekDates(date: moment.Moment): Date[] {
    // Obtenemos el inicio y fin de la semana a partir de la fecha proporcionada
    const { start, end } = this._calendarService.getWeekStartEnd(date);

    // Obtenemos todas las fechas entre el inicio y el fin de la semana
    return this._calendarService
      .getDatesBetween(start, end)
      .map((d) => d.toDate());
  }

  /**
   * Función para establecer el valor visual del campo de fecha
   * Esto es lo que se muestra en el input, formateado según el formato especificado
   * Si es un rango de fechas, se muestra como "start - end"
   * Si es una sola fecha, se muestra como "YYYY-MM-DD"
   * @param {Date | Date[]} value - Fecha o rango de fechas a establecer visualmente
   */
  private setVisualValue(value: Date | Date[]) {
    // Si es un array y tiene más de un elemento,
    // lo consideramos un rango de fechas y formateamos el inicio y fin del rango.
    if (Array.isArray(value) && value.length > 1) {
      const start = moment(value[0]).format(this.format);
      const end = moment(value[value.length - 1]).format(this.format);
      this._value.set(`${start} - ${end}`);
    }
    // Si no es un array o tiene un solo elemento,
    // lo consideramos una sola fecha y la formateamos directamente.
    else {
      const formatted = this._calendarService.formatDate(
        value as Date,
        this.format,
      );
      this._value.set(formatted);
    }
  }

  /**
   * Función para abrir o cerrar el calendario al hacer click en el icono o en el campo
   * @param {Event} event
   */
  toogleCalendar(event: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (this.isOpened()) this.closeCalendar();
    else this.openCalendar();
  }

  /**
   * Función para abrir el calendario
   */
  openCalendar() {
    if (this.disabled) return;

    // Abrimos el calendario y notificamos al servicio DatePickerManagerService
    this.isOpened.set(true);
    this._datePickerManagerService.notifyOpened(this);
  }

  /**
   * Función para cerrar el calendario
   */
  closeCalendar() {
    this.isOpened.set(false);
    this._changeDetectorRef.detectChanges(); // Detectamos cambios para actualizar la vista
    this.onOverlayDetached();
  }

  /**
   * Manejador para cuando el overlay se ha cerrado.
   * Aquí se puede manejar la lógica de limpieza o de retorno del foco.
   */
  onOverlayDetached(): void {
    setTimeout(() => this.onTouched());
  }

  /**
   * Función para limpiar el campo
   */
  clearInput() {
    this._value.set(null);
    this.realDateValue.set(null);
    this.onChange(null);
    setTimeout(() => this.onTouched());
    this.dateSelected.emit(null);
    this.change.emit(null);
  }

  /**
   * Funciones de control de eventos
   */
  onChange: any = () => {};
  onTouched: any = () => {};

  /**
   * Write form value to the DOM element (model => view)
   */
  writeValue(value: string | string[] | Date | Date[] | null) {
    if (value) {
      this.setValue(value);
    } else {
      this._value.set('');
    }
  }

  /**
   * Update form when DOM element value changes (view => model)
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Update form when DOM element is blurred (view => model)
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Write form disabled state to the DOM element (model => view)
   */
  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}
