import { A11yModule } from '@angular/cdk/a11y';
import {
  OverlayModule,
  ScrollStrategy,
  ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  Component,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  input,
  InputSignal,
  Output,
  signal,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CalendarComponent } from '@shared/components/calendar/calendar.component';
import { InputsUtilsService } from '@shared/components/form-fields/services/inputs-utils.service';
import moment from 'moment';
import {
  DateSelected,
  DEFAULT_FORMAT,
} from '../../calendar/models/calendar.model';
import { CalendarService } from '../../calendar/services/calendar.service';
import { InputAutocomplete, InputSize } from '../models/form-field.entity';
import { DatePickerType } from './models/input-date-picker.model';

/**
 * @name
 * neo-date-picker
 * @description
 * Componente para crear un campo de fecha con un calendario desplegable.
 * @example
 * <neo-date-picker [value]="'2021-12-31'" [format]="DEFAULT_FORMAT" (dateSelected)="dateSelected($event)"></neo-date-picker>
 */
@Component({
  selector: 'neo-input-date-picker',
  templateUrl: './input-date-picker.component.html',
  styleUrls: [
    './input-date-picker.component.scss',
    './../form-fields-settings.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    A11yModule,
    CalendarComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDatePickerComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class InputDatePickerComponent implements ControlValueAccessor {
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
  @Input() type: DatePickerType = 'day';

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

  // Fechas deshabilitadas, que no se pueden seleccionar
  @Input() disabledDates: (string | moment.Moment)[] | undefined = undefined;

  // Si se quiere bloquear el rango de fechas (range / week) si hay fechas deshabilitadas o no
  @Input() blockDisabledRanges: boolean | undefined = undefined;

  hasErrors: InputSignal<boolean> = input<boolean>(false);

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

  @Output() dateSelected = new EventEmitter<string | string[] | null>();
  @Output() change = new EventEmitter<string | string[] | null>();

  isDatePickerOpened: WritableSignal<boolean> = signal(false);
  defaultDate: WritableSignal<moment.Moment> = signal(moment(new Date()));
  rangeDates: WritableSignal<string | string[]> = signal('');
  scrollStrategy: ScrollStrategy;

  /**
   * Método para cerrar el panel al pulsar la tecla "Escape"
   */
  @HostListener('keydown', ['$event'])
  _onKeydownHandler(event: KeyboardEvent) {
    const keyCode = event.key;
    if (keyCode === 'Escape') this.closeCalendar();
  }

  constructor(
    private readonly _calendarService: CalendarService,
    private readonly _inputsUtilsService: InputsUtilsService,
    scrollStrategyOptions: ScrollStrategyOptions,
  ) {
    this.scrollStrategy = scrollStrategyOptions.close();
  }

  ngAfterViewInit(): void {
    this.createUniqueId();
  }

  /**
   * Función para crear un id único para el label del input
   */
  createUniqueId(): void {
    if (!this.id) {
      this._id.set(
        this._inputsUtilsService.createUniqueId(
          this.label || this.title || 'input-date-picker',
        ),
      );
      this._labelId.set(`label_${this._id()}`);
    }
  }

  /**
   * Función del evento `input` del campo para obtener el valor introducido
   * @param {string} value
   */
  onInput(value: string) {
    this._value.set(value);
    this.onChange(value);
    this.onTouched();
    this.dateSelected.emit(this._value());
    this.change.emit(this._value());
  }

  /**
   * Función del evento `blur` del campo para marcar el campo como "touched"
   */
  onBlur() {
    this.onTouched();
  }

  /**
   * Función para seleccionar una fecha
   * @param {DateSelected} value
   */
  setCalendarValue(value: DateSelected) {
    if (!value?.date) return;

    // Mostrar en el input como string (aunque sea rango)
    const formatted = this.formatDate(this.format, value.date);

    // Si es de tipo rango, mostramos la primera y última fecha
    // Si no es de tipo rango, mostramos la fecha única
    if (Array.isArray(value.date)) {
      const startDate = moment(value.date[0]).format(this.format);
      const endDate = moment(value.date[value.date.length - 1]).format(
        this.format,
      );
      this._value.set(`${startDate} - ${endDate}`); // Visual
      this.rangeDates.set(value.date);
    } else {
      this._value.set(formatted); // Visual
      this.defaultDate.set(moment(value.date));
    }

    this.onChange(value.date); // <- emitimos el valor REAL (string o string[])
    this.onTouched();

    if (value?.closePicker) this.closeCalendar();

    this.dateSelected.emit(value.date); // <- emitimos el valor REAL
    this.change.emit(value.date); // <- emitimos el valor REAL
  }

  /**
   * Función para formatear una fecha o rango de fechas a un formato específico
   * @param {string} format
   * @param {string | string[]} date
   * @returns {string}
   */
  formatDate(
    format: string = DEFAULT_FORMAT,
    date: string | string[],
  ): string | string[] | null {
    // Si es un rango de fechas, se formatea cada fecha por separado
    if (Array.isArray(date)) {
      return date
        .map((d) => moment(d).format(format))
        .filter((d) => d !== 'Invalid date')
        .join(' - ');
    }

    // Si es una sola fecha, se formatea directamente
    const formattedDate = moment(date).format(format);
    return formattedDate !== 'Invalid date' ? formattedDate : null;
  }

  /**
   * Función para comprobar si el tipo de calendario es de rango o semana
   * @returns {boolean}
   */
  isRangeType(): boolean {
    return this.type === 'range' || this.type === 'week';
  }

  /**
   * Función para obtener la fecha de inicio y fin del rango seleccionado
   * y usarla en la vista del calendario de forma más sencilla
   */
  get startRangeDate(): string {
    return Array.isArray(this.rangeDates()) ? this.rangeDates()[0] : '';
  }

  /**
   * Función para obtener la fecha de fin del rango seleccionado
   * y usarla en la vista del calendario de forma más sencilla
   */
  get endRangeDate(): string {
    const dates = this.rangeDates();
    return Array.isArray(dates) ? dates[dates.length - 1] : '';
  }

  /**
   * Función para abrir o cerrar el calendario al hacer click en el icono o en el campo
   * @param {Event} event
   */
  toogleCalendar(event: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (this.disabled) return;

    this.isDatePickerOpened.set(!this.isDatePickerOpened());
  }

  /**
   * Función para cerrar el calendario
   */
  closeCalendar() {
    if (this.isDatePickerOpened()) this.isDatePickerOpened.set(false);
  }

  /**
   * Funciones de control de eventos
   */
  onChange: any = () => {};
  onTouched: any = () => {};

  /**
   * Write form value to the DOM element (model => view)
   */
  writeValue(value: string | string[] | null) {
    if (value) {
      const firstDate = Array.isArray(value) ? value[0] : value;
      const momentDate = this._calendarService.buildValidMomentDate(firstDate);
      if (momentDate) {
        this.defaultDate.set(momentDate);
        this._value.set(this.formatDate(this.format, value) || '');
      } else {
        this._value.set('');
      }
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
