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
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import {
  CalendarDay,
  CalendarType,
  DEFAULT_FORMAT,
  DateSelected,
  ViewMode,
  WEEK_DAYS,
} from '../models/calendar-picker.model';
import { CalendarService } from '../services/calendar.service';

/**
 * @name
 * neo-calendar
 * @description
 * Componente para crear un calendario
 * @example
 * <neo-calendar [type]="'day'" [defaultDate]="'2021-12-31'" (dateSelected)="dateSelected($event)"></neo-calendar>
 */
@Component({
  selector: 'neo-calendar',
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

  // Fechas deshabilitadas, que no se pueden seleccionar
  @Input() disabledDates: (string | moment.Moment)[] | undefined = undefined;

  // Si se quiere bloquear el rango de fechas (range / week) si hay fechas deshabilitadas o no
  @Input() blockDisabledRanges: boolean | undefined = undefined;

  // Tipo de vista (Calendario normal, selección de año o de mes)
  viewMode: WritableSignal<ViewMode> = signal('default');

  // Array de datos para años y meses
  allYears: string[] = [];
  allMonths: string[] = [];

  // Variable para el año actual, para poder navegar por décadas
  yearsBlockStart = moment().year();

  // Array que guardará los días del mes por semana
  daysInMonth: WritableSignal<CalendarDay[][]> = signal([]);

  // Variable para saber en que calendario estamos cuándo nos movemos por los meses
  currentViewDate: WritableSignal<string> = signal(
    moment().format(DEFAULT_FORMAT),
  );

  // Días de la semana para la vista
  WEEK_DAYS: string[] = WEEK_DAYS;

  private readonly _toastService = inject(ToastrService);
  private readonly _calendarService = inject(CalendarService);
  private readonly _translateService = inject(TranslateService);

  ngOnInit(): void {
    queueMicrotask(() => this.initCalendar());
  }

  /**
   * Función para inicializar el calendario
   */
  initCalendar() {
    this.normalizeCurrentDate(this.currentViewDate());

    // Establecemos los meses del calendario
    this.allMonths = moment.months();
    this.setCalendar();
  }

  /**
   * Función para normalizar la fecha actual y establecerla
   * como fecha por defecto del calendario.
   * @param {string | moment.Moment} date
   */
  normalizeCurrentDate(date: string | moment.Moment) {
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

        // Obtenemos las fechas deshabilitadas, si las hubiese
        const disabledDates = this.getDisabledDates();

        week.push({
          date,
          isCurrentMonth: date.month() === firstDayOfMonth.month(),
          isToday: date.isSame(moment(), 'day'),
          isSelected: this.checkIfSelected(date),
          isInRange: this.checkIfInRange(date),
          isDisabled: disabledDates.some((d) => d.isSame(date, 'day')),
        });
      }

      weeks.push(week);
    }

    this.daysInMonth.set(weeks);
  }

  /**
   * Función para obtener las fechas deshabilitadas del calendario
   * que hayan sido pasadas como parámetro a través de `disabledDates`
   * @returns {moment.Moment[]}
   */
  getDisabledDates(): moment.Moment[] {
    return (
      this.disabledDates
        ?.map((date) => moment(date))
        .filter((m) => m.isValid()) ?? []
    );
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
    } else if (this.type === 'week' || this.type === 'range') {
      // Selección por semana o rango: el rango _startDate a _endDate
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
   * Filtra las fechas deshabilitadas dentro de un rango
   * @param startDate string en formato DEFAULT_FORMAT
   * @param endDate string en formato DEFAULT_FORMAT
   * @returns string[] con fechas válidas dentro del rango
   */
  filterEnabledDatesInRange(startDate: string, endDate: string): string[] {
    if (!this.disabledDates || this.disabledDates.length === 0) {
      // No hay fechas deshabilitadas, devolvemos todo el rango
      return this._calendarService.getDatesBetween(startDate, endDate);
    }

    // Obtenemos todas las fechas del rango
    const allDatesInRange = this._calendarService.getDatesBetween(
      startDate,
      endDate,
    );

    // Filtramos las fechas deshabilitadas (puedes ajustar la comparación si disabledDates usa moment)
    const disabledSet = new Set(
      this.disabledDates.map((d) => moment(d).format(DEFAULT_FORMAT)),
    );

    return allDatesInRange.filter((date) => !disabledSet.has(date));
  }

  /**
   * Función para seleccionar un día, semana o rango de fechas
   * @param {CalendarDay} day
   * @param {Event} event
   */
  selectItem(day: CalendarDay, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    // Si el día es inválido, si no hay fecha, si está deshabilitado o si no es del mes actual, no hacemos nada
    if (!day || !day.date || day?.isDisabled || !day.isCurrentMonth) return;

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
   * @param {moment.Moment} date - Fecha de inicio de la semana
   * @param {Event} event - Evento de clic
   */
  setWeekDate(date: moment.Moment, event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    const firstDay = date.clone().startOf('isoWeek');
    const lastDay = date.clone().endOf('isoWeek');

    // Todas las fechas dentro de la semana
    const totalDatesInWeek = this._calendarService.getDatesBetween(
      firstDay.format(DEFAULT_FORMAT),
      lastDay.format(DEFAULT_FORMAT),
    );

    const disabledSet = new Set(
      this.disabledDates?.map((d) => moment(d).format(DEFAULT_FORMAT)) ?? [],
    );

    const hasDisabledDates = totalDatesInWeek.some((dateStr) =>
      disabledSet.has(dateStr),
    );

    // Si bloqueamos rangos con fechas deshabilitadas
    if (this.blockDisabledRanges && hasDisabledDates) {
      this._startDate.set('');
      this._endDate.set('');
      this.showBlockedRangeToast();
      this.setCalendar();
      return;
    }

    // Si no bloqueamos, filtramos las fechas válidas
    const filteredDates = hasDisabledDates
      ? totalDatesInWeek.filter((dateStr) => !disabledSet.has(dateStr))
      : totalDatesInWeek;

    // Si hay fechas deshabilitadas y no bloqueamos el rango, mostramos un aviso
    if (!this.blockDisabledRanges && hasDisabledDates)
      this.showDisabledDatesToast();

    // Usamos la primera y última fecha del array filtrado
    this._startDate.set(filteredDates[0]);
    this._endDate.set(filteredDates[filteredDates.length - 1]);

    this.currentViewDate.set(filteredDates[0]);
    this.setCalendar();
    this.emitDateSelected(filteredDates, true);
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

    if (this._startDate() === '') {
      this._startDate.set(date.format(DEFAULT_FORMAT));
    } else if (
      this._endDate() === '' &&
      date.isAfter(moment(this._startDate()))
    ) {
      this._endDate.set(date.format(DEFAULT_FORMAT));
    } else if (
      moment(this._startDate()).format(DEFAULT_FORMAT) ===
      date.format(DEFAULT_FORMAT)
    ) {
      this._startDate.set(date.format(DEFAULT_FORMAT));
      this._endDate.set(date.format(DEFAULT_FORMAT));
    } else if (moment(this._startDate()).isAfter(moment(date))) {
      const dateStart = moment(new Date(this._startDate()));
      this._startDate.set(date.format(DEFAULT_FORMAT));
      this._endDate.set(dateStart.format(DEFAULT_FORMAT));
    }

    // Si ya tenemos un rango de fechas establecido, comprobamos si hay fechas deshabilitadas
    // y actuamos según la configuración de bloqueo de rangos
    if (this._startDate() !== '' && this._endDate() !== '') {
      const totalDatesInRange = this._calendarService.getDatesBetween(
        this._startDate(),
        this._endDate(),
      );
      const disabledSet = new Set(
        this.disabledDates?.map((d) => moment(d).format(DEFAULT_FORMAT)) ?? [],
      );
      const hasDisabledDates = totalDatesInRange.some((date) =>
        disabledSet.has(date),
      );

      // Si bloqueamos el rango cuando hay fechas deshabilitadas, limpiamos
      // las fechas, mostramos un aviso y no emitimos nada
      if (this.blockDisabledRanges && hasDisabledDates) {
        this._startDate.set('');
        this._endDate.set('');
        this.showBlockedRangeToast();
        this.setCalendar();
        return;
      }

      // Si no bloqueamos, filtramos las fechas deshabilitadas antes de emitir
      const filteredDates = this.filterEnabledDatesInRange(
        this._startDate(),
        this._endDate(),
      );

      // Si hay fechas deshabilitadas y no bloqueamos el rango, mostramos un aviso
      // pero seguimos emitiendo las fechas filtradas
      if (!this.blockDisabledRanges && hasDisabledDates)
        this.showDisabledDatesToast();

      // Asignamos las fechas filtradas y actualizamos la vista
      this.currentViewDate.set(moment(this._endDate()).format(DEFAULT_FORMAT));
      this.setCalendar();
      this.emitDateSelected(filteredDates, true);
    }
  }

  /**
   * Muestra un mensaje de aviso cuando se bloquea el rango por fechas deshabilitadas
   */
  showBlockedRangeToast() {
    this._toastService.error(
      this._translateService.instant('CALENDAR.BLOCKED_BY_DISABLED_DATES'),
      this._translateService.instant(
        'CALENDAR.BLOCKED_BY_DISABLED_DATES_TITLE',
      ),
      {
        timeOut: 5000,
      },
    );
  }

  /**
   * Muestra un mensaje de aviso cuando hay fechas deshabilitadas en el rango
   */
  showDisabledDatesToast() {
    this._toastService.warning(
      this._translateService.instant('CALENDAR.DISABLED_DATES_WARNING'),
      this._translateService.instant('CALENDAR.DISABLED_DATES_WARNING_TITLE'),
      {
        timeOut: 5000,
      },
    );
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
   * @param {ViewMode} mode
   * @param {Event} event
   */
  chageViewMode(mode: ViewMode, event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    // Si la vista es la de años, creamos los años según el año de la fecha actual
    if (mode === 'years') {
      const year =
        moment(new Date(this.currentViewDate())).year() ?? moment().year();
      this.loadYearRange(year);
    }

    this.viewMode.set(mode);
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
    const start = moment(this._startDate()).format('LL');
    const end = moment(this._endDate()).format('LL');
    const current = moment(this.currentViewDate()).format('LL');

    switch (this.type) {
      case 'day':
        return current;
      case 'range':
      case 'week':
        return `${start} - ${end}`;
      default:
        return '';
    }
  }

  /**
   * Carga el bloque de 20 años donde está incluido el año actual
   * @param {number} centerYear - Año central para calcular el bloque de 20 años
   */
  loadYearRange(centerYear: number = moment().year()) {
    const startYear = Math.floor(centerYear / 20) * 20;
    this.allYears = Array.from({ length: 20 }, (_, i) =>
      moment()
        .year(startYear + i)
        .format('YYYY'),
    );
    this.yearsBlockStart = startYear; // Para usar luego en prev/next
  }

  /**
   * Carga los 20 años anteriores al primer año mostrado actualmente
   */
  loadPastYears() {
    this.loadYearRange(this.yearsBlockStart - 20);
  }

  /**
   * Carga los 20 años siguientes al último año mostrado actualmente
   */
  loadFutureYears() {
    this.loadYearRange(this.yearsBlockStart + 20);
  }
}
