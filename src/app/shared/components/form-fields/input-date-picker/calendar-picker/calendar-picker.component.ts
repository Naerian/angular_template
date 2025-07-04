import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
  WritableSignal,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import {
  CalendarDay,
  CalendarType,
  DEFAULT_FORMAT,
  DateSelected,
  ViewMode,
  WEEK_DAYS,
} from '../models/date-picker.entity';
import { CalendarService } from '../services/calendar.service';

/**
 * @name
 * neo-calendar-picker
 * @description
 * Componente para crear un calendario
 * @example
 * <neo-calendar-picker [type]="'day'" [defaultDate]="'2021-12-31'" (dateSelected)="dateSelected($event)"></neo-calendar-picker>
 */
@Component({
  selector: 'neo-calendar-picker',
  templateUrl: './calendar-picker.component.html',
  styleUrls: ['./calendar-picker.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, A11yModule],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarPickerComponent implements OnInit {
  @Input() type: CalendarType = 'day'; // Tipo: Día (day), Semana (week) o Rango (range), para marcarlo de una forma u otra segúna una fecha
  @Output() dateSelected = new EventEmitter<DateSelected>();

  _defaultDate: WritableSignal<string> = signal(
    moment().format(DEFAULT_FORMAT),
  ); // Por defecto, la fecha actual
  get defaultDate(): string {
    return this._defaultDate();
  }
  @Input() set defaultDate(value: string | moment.Moment) {
    this._defaultDate.set(this._calendarService.buildValidMomentDate(value));
    this.currentViewDate.set(this._defaultDate());
  }

  _startDate: WritableSignal<string> = signal(moment().format(DEFAULT_FORMAT)); // Por defecto, la fecha actual
  get startDate(): string {
    return this._startDate();
  }
  @Input() set startDate(value: string | moment.Moment) {
    this._startDate.set(this._calendarService.buildValidMomentDate(value));
    this.currentViewDate.set(this._startDate());
  }

  _endDate: WritableSignal<string> = signal(moment().format(DEFAULT_FORMAT)); // Por defecto, la fecha actual
  get endDate(): string {
    return this._endDate();
  }
  @Input() set endDate(value: string | moment.Moment) {
    this._endDate.set(this._calendarService.buildValidMomentDate(value));
  }

  // Tipo de vista (Calendario normal, selección de año o de mes)
  viewMode: WritableSignal<ViewMode> = signal('default');

  // Array de datos para años y meses
  allYears: string[] = [];
  allMonths: string[] = [];

  // Array que guardará los días del mes por semana
  daysInMonth: WritableSignal<CalendarDay[][]> = signal([]);

  // Variable para saber en que calendario estamos cuándo nos movemos por los meses
  currentViewDate: WritableSignal<string> = signal(
    moment().format(DEFAULT_FORMAT),
  );

  // Días de la semana para la vista
  WEEK_DAYS: string[] = WEEK_DAYS;

  constructor(private readonly _calendarService: CalendarService) {}

  ngOnInit(): void {
    queueMicrotask(() => this.initCalendar());
  }

  /**
   * Función para inicializar el calendario
   */
  initCalendar() {
    this.checkcurrentViewDateDate(this.currentViewDate());

    // Establecemos los meses del calendario
    this.allMonths = moment.months();
    this.setCalendar();
  }

  /**
   * Función para establecer la "defaultDate" a hoy si no es válida
   * @param {string | moment.Moment} date
   */
  checkcurrentViewDateDate(date: string | moment.Moment) {
    // Comprobamos si la fecha es un string o un objeto Moment
    if (date instanceof moment) date = date.format(DEFAULT_FORMAT);

    // Comprobamos si la fecha no es válida asignamos la fecha de hoy,
    // en caso contrario, asignamos la fecha indicada
    if (!moment(date).isValid())
      this._defaultDate.set(moment().format(DEFAULT_FORMAT));
    else this._defaultDate.set(moment(date).format(DEFAULT_FORMAT));

    this.currentViewDate.set(this._defaultDate());
  }

  /**
   * Función para construir el calendario según una fecha dada
   */
  setCalendar() {
    const firstDayOfMonth = moment(this.currentViewDate()).startOf('month');
    const firstCell = firstDayOfMonth.clone().startOf('isoWeek'); // lunes de la 1.ª fila
    const weeks: CalendarDay[][] = [];

    for (let w = 0; w < 6; w++) {
      // 6 filas máx.
      const week: CalendarDay[] = [];

      for (let d = 0; d < 7; d++) {
        // 7 columnas
        const date = firstCell.clone().add(w, 'week').add(d, 'day');

        week.push({
          date,
          isCurrentMonth: date.month() === firstDayOfMonth.month(),
          isToday: date.isSame(moment(), 'day'),
          isSelected: this.checkIfSelected(date),
          isInRange: this.checkIfInRange(date),
        });
      }

      weeks.push(week);
    }

    this.daysInMonth.set(weeks);
  }

  /**
   * Función para comprobar si la fecha está dentro del rango de fechas
   * @param {moment.Moment} date
   * @returns {boolean}
   */
  checkIfSelected(date: moment.Moment): boolean {
    // Si no hay fecha por defecto, no hay selección
    if (!this._defaultDate() || !date) return false;

    if (this.type === 'day') {
      // Selección por día exacto
      return date?.isSame(moment(this._defaultDate()), 'day');
    } else if (this.type === 'week') {
      // Selección por semana: el rango _startDate a _endDate
      return this.checkIfInRange(date);
    } else if (this.type === 'range') {
      // Selección por rango: el rango _startDate a _endDate
      return this.checkIfInRange(date);
    }
    return false;
  }

  /**
   * Función para comprobar si la fecha está dentro del rango de fechas
   * @param {moment.Moment} date
   * @returns {boolean}
   */
  checkIfInRange(date: moment.Moment): boolean {
    return this._calendarService.isRangeDate(
      date,
      this._startDate(),
      this._endDate(),
    );
  }

  /**
   * Función para seleccionar un día, semana o rango de fechas
   * @param {CalendarDay} day
   * @param {Event} event
   */
  selectItem(day: CalendarDay, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    // Si el día no tiene fecha, no hacemos nada
    if (!day || !day.date) return;

    // Si la fecha no es del mes actual, no hacemos nada
    if (!day.isCurrentMonth) return;

    // Si el tipo es día, semana o rango, establecemos la fecha
    if (this.type === 'day') {
      this.setDay(day.date);
    } else if (this.type === 'week') {
      this.setWeekDate(day.date);
    } else if (this.type === 'range') {
      this.setRangeDate(day.date);
    }
  }

  /**
   * Función para establecer el día seleccionado
   * @param {moment.Moment} date
   * @param {Event} event
   * @param {boolean} closePickerSelector
   */
  setDay(
    date: moment.Moment,
    event?: Event,
    closePickerSelector: boolean = true,
  ) {
    event?.preventDefault();
    event?.stopPropagation();

    this._defaultDate.set(date.format(DEFAULT_FORMAT));
    this.currentViewDate.set(date.format(DEFAULT_FORMAT));
    this.setCalendar();
    this.emitDateSelected(this._defaultDate(), closePickerSelector);
  }

  /**
   * Función para establecer la semana seleccionada
   * @param {number} weekIdx
   * @param {Event} event
   */
  setWeekDate(date: moment.Moment, event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    // Obtenemos el primer y último día de la semana
    const firstDay = date.clone().startOf('isoWeek');
    const lastDay = date.clone().endOf('isoWeek');

    // Asignamos el rango de fechas
    this._startDate.set(firstDay.format(DEFAULT_FORMAT));
    this._endDate.set(lastDay.format(DEFAULT_FORMAT));

    // Si ya tenemos las dos fechas, emitimos el rango de fechas
    if (this._startDate() !== '' && this._endDate() !== '') {
      const rangeDate: string | string[] =
        this._startDate() !== '' && this._endDate() !== ''
          ? [this._startDate(), this._endDate()]
          : '';
      this.currentViewDate.set(
        moment(this._startDate()).format(DEFAULT_FORMAT),
      );
      this.setCalendar();
      this.emitDateSelected(rangeDate, true);
    }
  }

  /**
   * Función para establecer un rango de fechas
   * @param {moment.Moment} date
   * @param {Event} event
   * @param {boolean} cleanDates
   */
  setRangeDate(date: moment.Moment, event?: Event, cleanDates: boolean = true) {
    event?.preventDefault();
    event?.stopPropagation();

    if (cleanDates && this._startDate() !== '' && this._endDate() !== '') {
      this._startDate.set('');
      this._endDate.set('');
    }

    if (this._startDate() === '')
      // Si no hay fecha de inicio, la establecemos
      this._startDate.set(date.format(DEFAULT_FORMAT));
    else if (this._endDate() === '' && date.isAfter(moment(this._startDate())))
      // Si no hay fecha de fin, la establecemos
      this._endDate.set(date.format(DEFAULT_FORMAT));
    else if (
      moment(this._startDate()).format(DEFAULT_FORMAT) ===
      date.format(DEFAULT_FORMAT)
    ) {
      // Si la fecha de inicio es igual a la de fin, la establecemos
      this._startDate.set(date.format(DEFAULT_FORMAT));
      this._endDate.set(date.format(DEFAULT_FORMAT));
    } else if (moment(this._startDate()).isAfter(moment(date))) {
      // Si la fecha de inicio es mayor que la de fin, las intercambiamos
      const dateStart = moment(new Date(this._startDate()));
      this._startDate.set(date.format(DEFAULT_FORMAT));
      this._endDate.set(dateStart.format(DEFAULT_FORMAT));
    }

    // Si ya tenemos las dos fechas, emitimos el rango de fechas
    if (this._startDate() !== '' && this._endDate() !== '') {
      const rangeDate: string | string[] =
        this._startDate() !== '' && this._endDate() !== ''
          ? [this._startDate(), this._endDate()]
          : '';
      this.currentViewDate.set(moment(this._endDate()).format(DEFAULT_FORMAT));
      this.setCalendar();
      this.emitDateSelected(rangeDate, true);
    }
  }

  /**
   * Función para emitir el valor seleccionado
   * @param {string | string[]} date
   * @param {boolean} closePickerSelector
   */
  emitDateSelected(
    date: string | string[],
    closePickerSelector: boolean = true,
  ) {
    this.dateSelected.emit({
      date: date,
      closePicker: closePickerSelector,
    });
  }

  /**
   * Función para cambiar la vista del calendario (días, meses o años)
   * @param {ViewMode} viewMode
   * @param {Event} event
   */
  chageViewMode(viewMode: ViewMode, event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    // Si la vista es la de años, creamos los años según el año de la fecha actual
    if (viewMode === 'years')
      this.loadFutureYears(
        moment(new Date(this.currentViewDate())).format('YYYY'),
      );

    this.viewMode.set(viewMode);
  }

  /**
   * Función para cambiar el mes
   * @param {number} month
   * @param {Event} event
   */
  changeMonth(month: number, event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    this.viewMode.set('default');
    this.currentViewDate.set(
      moment(new Date(this.currentViewDate()))
        .set('month', month)
        .format(DEFAULT_FORMAT),
    );
    this.setCalendar();
  }

  /**
   * Función para cambiar al mes anterior
   */
  prevMonth() {
    this.currentViewDate.set(
      moment(new Date(this.currentViewDate()))
        .subtract('1', 'month')
        .format(DEFAULT_FORMAT),
    );
    this.setCalendar();
  }

  /**
   * Función para cambiar al mes siguiente
   */
  nextMonth() {
    this.currentViewDate.set(
      moment(new Date(this.currentViewDate()))
        .add('1', 'month')
        .format(DEFAULT_FORMAT),
    );
    this.setCalendar();
  }

  /**
   * Función para cambiar el año
   * @param {string} year
   * @param {Event} event
   */
  changeYear(year: string, event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    this.viewMode.set('default');
    this.currentViewDate.set(
      moment(new Date(this._defaultDate()))
        .set('year', Number(year))
        .format(DEFAULT_FORMAT),
    );
    this.setCalendar();
  }

  /**
   * Función para obtener la etiqueta ARIA según el tipo de calendario
   * y el día seleccionado. De esta forma se proporcionará una mejor accesibilidad
   * @returns {string}
   */
  getAriaLabelForCalendar(): string {
    switch (this.type) {
      case 'day':
        return `${this.currentViewDate()}`;
      case 'range':
        return `${this._startDate()} - ${this._endDate()}`;
      case 'week':
        return `${this._startDate()} - ${this._endDate()}`;
      default:
        return '';
    }
  }

  /**
   * Función para cargar los años pasados, lo que obtendrá los últimos 20 años con respescto al primer año del array de años
   */
  loadPastYears() {
    // Creamos un array de 20 años a partir del primer año del array de años
    this.allYears = new Array(20)
      .fill(null)
      .map((_, year) =>
        moment(this.allYears[0]).subtract(year, 'year').format('YYYY'),
      );

    // Ordenamos los años
    this.allYears.sort();
  }

  /**
   * Función para cargar los años futuros, lo que obtendrá los próximos 20 años con respescto al último año del array de años
   * @param {string} lastYear
   */
  loadFutureYears(lastYear: string = this.allYears[this.allYears.length - 1]) {
    // Creamos un array de 20 años a partir del último año del array de años
    this.allYears = new Array(20)
      .fill(null)
      .map((_, year) => moment(lastYear).add(year, 'year').format('YYYY'));

    // Ordenamos los años
    this.allYears.sort();
  }
}
