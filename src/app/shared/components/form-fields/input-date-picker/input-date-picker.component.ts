import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Component, EventEmitter, forwardRef, Input, Output, signal, WritableSignal, input, InputSignal, ViewEncapsulation, booleanAttribute } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DEFAULT_FORMAT, DatePickerType, DateSelected } from './models/date-picker.entity';
import { CalendarService } from './services/calendar.service';
import { InputsUtilsService } from '@shared/components/form-fields/services/inputs-utils.service';
import moment from 'moment';
import { InputAutocomplete, InputSize } from '../models/form-field.entity';

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
  styleUrls: ['./input-date-picker.component.scss', './../form-fields-settings.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDatePickerComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class InputDatePickerComponent implements ControlValueAccessor {

  @Input({ transform: booleanAttribute }) autofocus?: boolean = false;
  @Input({ transform: booleanAttribute }) readonly?: boolean = false;
  @Input({ transform: booleanAttribute }) required: boolean = false;
  @Input() title?: string;
  @Input() label?: string;
  @Input() name?: string;
  @Input() type: DatePickerType = 'day';
  @Input() placeholder: string = 'aaaa-mm-dd';
  @Input() icon?: string = 'ri-calendar-2-line';
  @Input() autocomplete: InputAutocomplete = 'off';
  @Input() inputSize: InputSize = 'm';
  @Input() showIconCalendar: boolean = true;
  @Input() format: string = DEFAULT_FORMAT;
  hasErrors: InputSignal<boolean> = input<boolean>(false);

  /**
   * Input para crear un id único para el campo
   */
  @Input() set id(value: string) {
    this._id.set(value);
  }
  get id() {
    return this._id();
  }

  /**
   * Input para marcar el campo como deshabilitado
   */
  @Input() set disabled(status: boolean) {
    this._disabled.set(status);
  }

  get disabled() {
    return this._disabled();
  }

  /**
   * Input para introducir el valor del campo
   */
  @Input() set value(value: string) {
    this._value.set(value);
  }

  get value(): string | null {
    return this._value();
  }

  @Output() dateSelected = new EventEmitter<string>();
  @Output() change = new EventEmitter<string>();

  _id: WritableSignal<string> = signal('');
  _value: WritableSignal<string> = signal('');
  _disabled: WritableSignal<boolean> = signal(false);

  isDatePickerOpened: WritableSignal<boolean> = signal(false);
  defaultDate: WritableSignal<moment.Moment> = signal(moment(new Date()));
  currentDate: WritableSignal<string | string[]> = signal('');
  scrollStrategy: ScrollStrategy;

  constructor(
    private readonly _calendarService: CalendarService,
    private readonly _inputsUtilsService: InputsUtilsService,
    scrollStrategyOptions: ScrollStrategyOptions
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
    if (!this._id() && this.label && this.label !== '')
      this._id.set(this._inputsUtilsService.createUniqueId(this.label));
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
    this._value?.set(this.formatDate(this.format, value.date)); // Valor mostrado en el campo
    this.defaultDate.set(moment(value.date)); // Valor pasado al componente Calendar
    this.onChange(this._value());
    this.onTouched();

    if (value?.closePicker)
      this.closeCalendar();

    this.dateSelected.emit(this._value());
    this.change.emit(this._value());
  }

  /**
   * Función para formatear una fecha
   * @param {string} valueFormat
   * @param {any} date
   * @returns {string}
   */
  formatDate(valueFormat: string, date: any): string {

    this.currentDate.set(date);

    if ((this.type === 'range' || this.type === 'week') && date?.length > 0)
      return moment(new Date(date[0])).format(this.format) + ' - ' + moment(new Date(date[1])).format(this.format);

    if (valueFormat !== "" && moment(new Date(date), valueFormat, true)) {
      return moment(new Date(date)).format(valueFormat);
    } else {
      return moment(new Date(date)).format(this.format);
    }

  }

  /**
   * Función para abrir o cerrar el calendario al hacer click en el icono o en el campo
   * @param {Event} event
   */
  toogleCalendar(event: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.isDatePickerOpened.set(!this.isDatePickerOpened());
  }

  /**
   * Función para cerrar el calendario
   */
  closeCalendar() {
    if (this.isDatePickerOpened())
      this.isDatePickerOpened.set(false);
  }

  /**
   * Funciones de control de eventos
   */
  onChange: any = () => { };
  onTouched: any = () => { };

  /**
   * Write form value to the DOM element (model => view)
   */
  writeValue(value: any) {

    if (value && value !== '') {
      this.defaultDate.set(this._calendarService.buildValidMomentDate(value));
      this._value?.set(moment(this.defaultDate()).format(this.format) || '');
    } else {
      this._value?.set('');
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
