import { A11yModule } from '@angular/cdk/a11y';
import { Overlay, OverlayModule, ScrollStrategy } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
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
})
export class InputDatePickerComponent implements ControlValueAccessor {
  @ViewChild('calendarOverlay', { read: ElementRef })
  calendarOverlayRef!: ElementRef;

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

  isDatePickerOpened: WritableSignal<boolean> = signal(false);
  scrollStrategy: ScrollStrategy;
  overlayPositions = OVERLAY_POSITIONS;

  // Fecha por defecto del calendario
  realDateValue: WritableSignal<Date | Date[] | null> = signal(null);

  private readonly overlay = inject(Overlay);
  private readonly _inputsUtilsService = inject(InputsUtilsService);
  private readonly _datePickerManagerService = inject(DatePickerManagerService);

  private destroy$ = new Subject<void>();

  constructor() {
    this.scrollStrategy = this.overlay.scrollStrategies.close();
  }

  /**
   * Método para cerrar el panel al pulsar la tecla "Escape"
   */
  @HostListener('keydown', ['$event'])
  _onKeydownHandler(event: KeyboardEvent) {
    if (!this.isDatePickerOpened) return;
    const keyCode = event.key;
    if (keyCode === 'Escape') this.closeCalendar();
  }

  /**
   * Método para cerrar el calendario al hacer click fuera del panel
   */
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    if (!this.isDatePickerOpened) return;
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
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Método para suscribirse a las notificaciones del servicio DatePickerManagerService
   * para cerrar el calendario si otro componente de tipo InputDatePicker se abre.
   */
  datePickerManager() {
    // Nos suscribimos a las notificaciones del servicio
    this._datePickerManagerService.datePickerOpened$
      .pipe(takeUntil(this.destroy$))
      .subscribe((openedComponent) => {
        // Si el componente notificado no es este mismo, ciérrate.
        if (openedComponent !== this) {
          this.closeCalendar();
        }
      });
  }

  /**
   * Función para crear un id único para el label del input
   */
  createUniqueId(): void {
    this._id?.set(this._inputsUtilsService.createUniqueId('input-date-picker'));
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
    this.onTouched();
  }

  /**
   * Función para seleccionar una fecha
   * @param {Date | Date[] | string | string[] | null} value - Fecha o rango de fechas seleccionadas
   */
  setCalendarValue(value: Date | Date[] | string | string[] | null) {
    // Establecemos el valor del campo de fecha
    this.setValue(value);

    this.onChange(value);
    this.onTouched();

    // Emitimos el valor REAL
    this.dateSelected.emit(this.realDateValue());
    this.change.emit(this.realDateValue());

    // Cerramos el calendario
    this.closeCalendar();
  }

  /**
   * Función para establecer el valor del campo de fecha
   * @param {Date | Date[] | string | string[] | null} value - Fecha o rango de fechas seleccionadas
   */
  setValue(value: Date | Date[] | string | string[] | null) {
    // Si no hay valor, lo establecemos a null
    if (
      value === '' ||
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0)
    ) {
      this._value.set(null); // Valor visual
      this.realDateValue.set(null); // Valor real
      return;
    }

    // VALOR REAL DEL CAMPO
    // ---------------------------------
    // Si el valor es de tipo `string`, lo convertimos a `Date` o `Date[]`
    // dependiendo del tipo de calendario (rango, semana o día)
    if (
      typeof value === 'string' ||
      (Array.isArray(value) && typeof value[0] === 'string')
    ) {
      // Si es un rango, formateamos cada valor de fecha y después los convertimos a Date[].
      if (this.type === CalendarType.RANGE || this.type === CalendarType.WEEK) {
        const parts = Array.isArray(value) ? value : [value];
        const dates = parts
          .map((part) => moment(part, this.format, true))
          .filter((m) => m.isValid())
          .map((m) => m.toDate());
        value = dates.length > 0 ? dates : null;
        this.realDateValue.set(value as Date[]); // Valor real
      } else {
        // Si es una sola fecha, la convertimos a Date
        const m = moment(value as string, this.format, true);
        value = m.isValid() ? m.toDate() : null;
        this.realDateValue.set(value as Date); // Valor real
      }
    } else {
      if (this.type === CalendarType.RANGE || this.type === CalendarType.WEEK) {
        // Si es un rango de fechas, aseguramos que sea un array de Date[]
        if (!Array.isArray(value)) value = [value as Date];
        this.realDateValue.set(value as Date[]); // Valor real
      } else {
        this.realDateValue.set(value as Date);
      }
    }

    // VALOR VISUAL DEL CAMPO
    // ----------------------------
    // Ahora `value` es de tipo `Date` o `Date[]`
    // Si es un rango de fechas, lo mostramos como 'aaaa-mm-dd - aaaa-mm-dd' (this.format)
    // Si es una sola fecha, lo mostramos como 'aaaa-mm-dd' (this.format)
    if (Array.isArray(value) && value.length > 1) {
      const startDate = moment(value[0]).format(this.format);
      const endDate = moment(value[value.length - 1]).format(this.format);
      this._value.set(`${startDate} - ${endDate}`); // Valor visual
    } else {
      // Mostrar en el input como string (aunque sea rango)
      const formatted = this.formatDate(value as Date, this.format);
      this._value.set(formatted); // Valor visual
    }
  }

  /**
   * Función para formatear una fecha o rango de fechas a un formato específico
   * @param {string} format
   * @param {Date | Date[]} date
   * @returns {string}
   */
  formatDate(
    date: Date | Date[],
    format: string = DEFAULT_FORMAT,
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
   * Función para abrir o cerrar el calendario al hacer click en el icono o en el campo
   * @param {Event} event
   */
  toogleCalendar(event: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (this.isDatePickerOpened()) this.closeCalendar();
    else this.openCalendar();
  }

  /**
   * Función para abrir el calendario
   */
  openCalendar() {
    if (this.disabled) return;

    // Abrimos el calendario y notificamos al servicio DatePickerManagerService
    this.isDatePickerOpened.set(true);
    this._datePickerManagerService.notifyOpened(this);
  }

  /**
   * Función para cerrar el calendario
   */
  closeCalendar() {
    this.isDatePickerOpened.set(false);
  }

  /**
   * Función para limpiar el campo
   */
  clearInput() {
    this._value.set(null);
    this.realDateValue.set(null);
    this.onChange(null);
    this.onTouched();
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
