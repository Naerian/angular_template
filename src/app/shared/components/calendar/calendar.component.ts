import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import {
  CalendarDay,
  DEFAULT_FORMAT,
  ViewMode,
  WEEK_DAYS,
} from './models/calendar.model';
import { CalendarService } from './services/calendar.service';

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
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    TranslateModule,
    A11yModule,
  ],
})
export class CalendarComponent implements OnInit {
  // Tipo de selección: día, semana o rango
  @Input() type: 'day' | 'week' | 'range' = 'day';

  // Fechas deshabilitadas, que no se pueden seleccionar
  @Input() disabledDates: (string | moment.Moment)[] | undefined = undefined;

  // Si se quiere bloquear el rango de fechas (range / week) si hay fechas deshabilitadas o no
  @Input() blockDisabledRanges: boolean | undefined = undefined;

  // Señales privadas que almacenan fechas como moment o null
  private _defaultDate: WritableSignal<moment.Moment | null> = signal(moment());
  private _startDate: WritableSignal<moment.Moment | null> = signal(moment());
  private _endDate: WritableSignal<moment.Moment | null> = signal(moment());

  /**
   * Input para establecer la fecha por defecto del calendario
   */
  @Input()
  set defaultDate(value: string | moment.Moment) {
    const parsedDate = this._calendarService.buildValidMomentDate(value);
    this._defaultDate.set(parsedDate ?? moment());
    this.currentViewDate.set(this._defaultDate()!.format(DEFAULT_FORMAT));
  }
  get defaultDate(): string {
    return this._defaultDate()
      ? this._defaultDate()!.format(DEFAULT_FORMAT)
      : '';
  }

  /**
   * Input para establecer la fecha de inicio de rango
   */
  @Input()
  set startDate(value: string | moment.Moment) {
    const parsedDate = this._calendarService.buildValidMomentDate(value);
    this._startDate.set(parsedDate ?? null);
    if (parsedDate) this.currentViewDate.set(parsedDate.format(DEFAULT_FORMAT));
  }
  get startDate(): string {
    return this._startDate() ? this._startDate()!.format(DEFAULT_FORMAT) : '';
  }

  /**
   * Input para establecer la fecha de fin de rango
   */
  @Input()
  set endDate(value: string | moment.Moment) {
    const parsedDate = this._calendarService.buildValidMomentDate(value);
    this._endDate.set(parsedDate ?? null);
  }
  get endDate(): string {
    return this._endDate() ? this._endDate()!.format(DEFAULT_FORMAT) : '';
  }

  // Evento que emite la fecha o rango seleccionado
  @Output() dateSelected = new EventEmitter<{
    date: string | string[];
    closePicker: boolean;
  }>();

  // Tipo de vista (Calendario normal, selección de año o de mes)
  viewMode: WritableSignal<ViewMode> = signal('default');

  // Array de datos para años y meses
  allYears: string[] = [];
  allMonths: string[] = [];

  // Variable para el año actual, para poder navegar por décadas
  yearsBlockStart = moment().year();

  // Array que guardará los días del mes por semana
  daysInMonth: WritableSignal<CalendarDay[][]> = signal([]);

  // Variable para saber en qué calendario estamos cuando nos movemos por los meses (formato string)
  currentViewDate: WritableSignal<string> = signal(
    moment().format(DEFAULT_FORMAT),
  );

  // Variable para el número del mes actual (0-11)
  currentMonthNumber: Signal<number> = computed(() =>
    moment(this.currentViewDate()).month(),
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
    this.allMonths = moment.months();
    this.setCalendar();
  }

  /**
   * Función para normalizar la fecha actual y establecerla
   * como fecha por defecto del calendario.
   * @param {string | moment.Moment} date
   */
  normalizeCurrentDate(date: string | moment.Moment) {
    let mDate = moment.isMoment(date) ? date : moment(date);
    if (!mDate.isValid()) mDate = moment();
    this._defaultDate.set(mDate);
    this.currentViewDate.set(mDate.format(DEFAULT_FORMAT));
  }

  /**
   * Función para construir el calendario según una fecha dada
   */
  setCalendar() {
    const firstDayOfMonth = moment(this.currentViewDate()).startOf('month');
    const firstCell = firstDayOfMonth.clone().startOf('isoWeek'); // lunes de la 1ª fila
    const weeks: CalendarDay[][] = [];

    for (let w = 0; w < 6; w++) {
      const week: CalendarDay[] = [];

      for (let d = 0; d < 7; d++) {
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
   * Función para comprobar si la fecha está seleccionada según el tipo
   * @param {moment.Moment} date
   * @returns {boolean}
   */
  checkIfSelected(date: moment.Moment): boolean {
    if (!this._defaultDate()) return false;

    if (this.type === 'day') {
      // Selección por día exacto
      return date.isSame(this._defaultDate()!, 'day');
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
    if (!this._startDate() || !this._endDate()) return false;

    return this._calendarService.isRangeDate(
      date,
      this._startDate()!,
      this._endDate()!,
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

    // Filtramos las fechas deshabilitadas (comparación con fechas formateadas)
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
    if (!day || !day.date || day.isDisabled || !day.isCurrentMonth) return;

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

    this._defaultDate.set(date);
    this.currentViewDate.set(date.format(DEFAULT_FORMAT));
    this.setCalendar();
    this.emitDateSelected(date.format(DEFAULT_FORMAT), closePickerSelector);
  }

  /**
   * Función para establecer la semana seleccionada y devolver
   * el array de días válidos (filtrados o no)
   * @param {moment.Moment} date - Fecha dentro de la semana seleccionada
   * @param {Event} event - Evento (opcional)
   */
  setWeekDate(date: moment.Moment, event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    // Calculamos el primer y último día de la semana
    const firstDay = date.clone().startOf('isoWeek');
    const lastDay = date.clone().endOf('isoWeek');

    // Obtenemos todas las fechas dentro del rango semanal
    const totalDatesInWeek = this._calendarService.getDatesBetween(
      firstDay.format(DEFAULT_FORMAT),
      lastDay.format(DEFAULT_FORMAT),
    );

    // Creamos un set con las fechas deshabilitadas para fácil búsqueda
    const disabledSet = new Set(
      this.disabledDates?.map((d) => moment(d).format(DEFAULT_FORMAT)) ?? [],
    );

    // Comprobamos si hay fechas deshabilitadas en el rango semanal
    const hasDisabledDates = totalDatesInWeek.some((dateStr) =>
      disabledSet.has(dateStr),
    );

    // Si bloqueamos el rango cuando hay fechas deshabilitadas, limpiamos
    // las fechas, mostramos un aviso y no emitimos nada
    if (this.blockDisabledRanges && hasDisabledDates) {
      this._startDate.set(null);
      this._endDate.set(null);
      this.showBlockedRangeToast();
      this.setCalendar();
      return;
    }

    // Si no bloqueamos, filtramos las fechas deshabilitadas antes de emitir
    const filteredDates = hasDisabledDates
      ? totalDatesInWeek.filter((dateStr) => !disabledSet.has(dateStr))
      : totalDatesInWeek;

    // Si hay fechas deshabilitadas y no bloqueamos, mostramos toast informativo
    if (!this.blockDisabledRanges && hasDisabledDates) {
      this.showDisabledDatesToast();
    }

    // Asignamos la primera y última fecha del array filtrado
    this._startDate.set(moment(filteredDates[0], DEFAULT_FORMAT));
    this._endDate.set(
      moment(filteredDates[filteredDates.length - 1], DEFAULT_FORMAT),
    );

    // Actualizamos la fecha de vista actual al primer día válido
    this.currentViewDate.set(filteredDates[0]);
    this.setCalendar();
    this.emitDateSelected(filteredDates, true);
  }

  /**
   * Función para establecer un rango de fechas seleccionado
   * @param {moment.Moment} date - Fecha seleccionada
   * @param {Event} event - Evento (opcional)
   * @param {boolean} cleanDates - Si limpiar rango anterior
   */
  setRangeDate(date: moment.Moment, event?: Event, cleanDates: boolean = true) {
    event?.preventDefault();
    event?.stopPropagation();

    // Limpiamos las fechas si procede
    if (cleanDates && this._startDate() && this._endDate()) {
      this._startDate.set(null);
      this._endDate.set(null);
    }

    // Lógica para establecer el inicio o fin del rango
    if (!this._startDate()) {
      this._startDate.set(date);
    } else if (!this._endDate() && date.isAfter(this._startDate()!)) {
      this._endDate.set(date);
    } else if (this._startDate()!.isSame(date)) {
      this._startDate.set(date);
      this._endDate.set(date);
    } else if (this._startDate()!.isAfter(date)) {
      const dateStart = this._startDate()!;
      this._startDate.set(date);
      this._endDate.set(dateStart);
    }

    // Si ya hay rango establecido, comprobamos fechas deshabilitadas y actuamos según configuración
    if (this._startDate() && this._endDate()) {
      const totalDatesInRange = this._calendarService.getDatesBetween(
        this._startDate()!.format(DEFAULT_FORMAT),
        this._endDate()!.format(DEFAULT_FORMAT),
      );

      const disabledSet = new Set(
        this.disabledDates?.map((d) => moment(d).format(DEFAULT_FORMAT)) ?? [],
      );

      const hasDisabledDates = totalDatesInRange.some((date) =>
        disabledSet.has(date),
      );

      // Bloqueamos el rango si hay fechas deshabilitadas y está configurado así
      if (this.blockDisabledRanges && hasDisabledDates) {
        this._startDate.set(null);
        this._endDate.set(null);
        this.showBlockedRangeToast();
        this.setCalendar();
        return;
      }

      // Filtramos fechas válidas y emitimos
      const filteredDates = this.filterEnabledDatesInRange(
        this._startDate()!.format(DEFAULT_FORMAT),
        this._endDate()!.format(DEFAULT_FORMAT),
      );

      if (!this.blockDisabledRanges && hasDisabledDates) {
        this.showDisabledDatesToast();
      }

      this.currentViewDate.set(this._endDate()!.format(DEFAULT_FORMAT));
      this.setCalendar();
      this.emitDateSelected(filteredDates, true);
    }
  }

  /**
   * Mostrar toast de error cuando se bloquea la selección por fechas deshabilitadas
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
   * Mostrar toast de advertencia cuando hay fechas deshabilitadas en el rango pero no se bloquea
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
   * Emitir la fecha o rango seleccionado para notificar al componente padre
   * @param date string o string[] con las fechas
   * @param closePickerSelector boolean para cerrar el selector si procede
   */
  emitDateSelected(
    date: string | string[],
    closePickerSelector: boolean = true,
  ) {
    this.dateSelected.emit({
      date,
      closePicker: closePickerSelector,
    });
  }

  /**
   * Cambiar el modo de vista del calendario: default, years, months
   * @param mode ViewMode
   * @param event Evento (opcional)
   */
  chageViewMode(mode: ViewMode, event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    // Si se cambia a vista años, cargamos rango de años
    if (mode === 'years') {
      const year =
        moment(new Date(this.currentViewDate())).year() ?? moment().year();
      this.loadYearRange(year);
    }

    this.viewMode.set(mode);
  }

  /**
   * Cambiar el mes seleccionado en la vista de calendario
   * @param month número de mes (0-11)
   * @param event Evento (opcional)
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
   * Ir al mes anterior
   */
  prevMonth() {
    this.currentViewDate.set(
      moment(new Date(this.currentViewDate()))
        .subtract(1, 'month')
        .format(DEFAULT_FORMAT),
    );
    this.setCalendar();
  }

  /**
   * Ir al mes siguiente
   */
  nextMonth() {
    this.currentViewDate.set(
      moment(new Date(this.currentViewDate()))
        .add(1, 'month')
        .format(DEFAULT_FORMAT),
    );
    this.setCalendar();
  }

  /**
   * Cambiar el año seleccionado en la vista de calendario
   * @param year string con el año seleccionado
   * @param event Evento (opcional)
   */
  changeYear(year: string, event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    this.viewMode.set('default');
    this.currentViewDate.set(
      (this._defaultDate() ?? moment())
        .clone()
        .set('year', Number(year))
        .format(DEFAULT_FORMAT),
    );
    this.setCalendar();
  }

  /**
   * Devuelve la etiqueta aria para el calendario según el tipo de selección
   */
  getAriaLabelForCalendar(): string {
    const start = this._startDate() ? this._startDate()!.format('LL') : '';
    const end = this._endDate() ? this._endDate()!.format('LL') : '';
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
   * Carga el rango de años para la vista de selección de años
   * @param centerYear año central para cargar la década (default: año actual)
   */
  loadYearRange(centerYear: number = moment().year()) {
    const startYear = Math.floor(centerYear / 20) * 20;
    this.allYears = Array.from({ length: 20 }, (_, i) =>
      moment()
        .year(startYear + i)
        .format('YYYY'),
    );
    this.yearsBlockStart = startYear;
  }

  /**
   * Cargar rango de años anterior (20 años atrás)
   */
  loadPastYears() {
    this.loadYearRange(this.yearsBlockStart - 20);
  }

  /**
   * Cargar rango de años siguiente (20 años adelante)
   */
  loadFutureYears() {
    this.loadYearRange(this.yearsBlockStart + 20);
  }
}
