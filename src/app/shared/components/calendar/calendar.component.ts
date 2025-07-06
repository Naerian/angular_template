import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  Signal,
  ViewChildren,
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
  CalendarSelectionType,
  CalendarViewMode,
  DEFAULT_FORMAT,
  SelectionType,
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
  @ViewChildren('monthButton') monthButtons!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  @ViewChildren('yearButton') yearButtons!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  @ViewChildren('dayButton') dayButtons!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  // Tipo de selección: día, semana o rango
  @Input() type: SelectionType = CalendarSelectionType.DAY;

  // Fechas deshabilitadas, que no se pueden seleccionar
  @Input() disabledDates: (string | moment.Moment)[] | undefined = undefined;

  // Si se quiere bloquear el rango de fechas (range / week) si hay fechas deshabilitadas o no
  @Input() blockDisabledRanges: boolean | undefined = undefined;

  // Señales privadas que almacenan fechas como moment o null
  private _defaultDate: WritableSignal<moment.Moment | null> = signal(moment());
  private _startDate: WritableSignal<moment.Moment | null> = signal(null);
  private _endDate: WritableSignal<moment.Moment | null> = signal(null);

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
  @Output() dateSelected = new EventEmitter<string | string[]>();

  // Tipo de vista (Calendario normal, selección de año o de mes)
  viewMode: WritableSignal<ViewMode> = signal(CalendarViewMode.DEFAULT);

  // Array de datos para años y meses
  allYears: number[] = [];
  allMonths: string[] = [];

  // Variable para el año actual, para poder navegar por décadas
  yearsBlockStart = moment().year();

  // Array que guardará los días del mes por semana
  daysInMonth: WritableSignal<CalendarDay[]> = signal([]);

  // Usada en la vista para no hacer uso de `magic strings`
  VIEW_MODE = CalendarViewMode;
  SELECTION_TYPE = CalendarSelectionType;

  // Variable para saber en qué calendario estamos cuando nos movemos por los meses (formato string)
  currentViewDate: WritableSignal<string> = signal(
    moment().format(DEFAULT_FORMAT),
  );

  // Variable para el año actual (4 dígitos)
  currentYear: Signal<number> = computed(() =>
    moment(this.currentViewDate()).year(),
  );

  // Variable para el número del mes actual (0-11)
  currentMonthNumber: Signal<number> = computed(() =>
    moment(this.currentViewDate()).month(),
  );

  // Días de la semana para la vista
  WEEK_DAYS: string[] = WEEK_DAYS;

  // ID único del calendario para evitar conflictos en el DOM
  calendarId = crypto.randomUUID();

  private readonly _toastService = inject(ToastrService);
  private readonly _calendarService = inject(CalendarService);
  private readonly _translateService = inject(TranslateService);

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (this.viewMode() === CalendarViewMode.DEFAULT) {
      this.navigateCalendarDay(event);
    } else if (this.viewMode() === CalendarViewMode.MONTHS) {
      this.navigateCalendarMonths(event);
    } else if (this.viewMode() === CalendarViewMode.YEARS) {
      this.navigateCalendarYears(event);
    }
  }

  ngOnInit(): void {
    queueMicrotask(() => this.initCalendar());
  }

  /**
   * Función para navegar entre los días del calendario en la vista `default`
   * @param {KeyboardEvent} event - Tecla pulsada (ArrowLeft, ArrowRight, ArrowUp, ArrowDown)
   */
  navigateCalendarDay(event: KeyboardEvent) {
    if (this.viewMode() !== CalendarViewMode.DEFAULT) return;

    const keys = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'PageUp',
      'PageDown',
    ];
    if (!keys.includes(event.key)) return;

    event.preventDefault();

    const buttons = this.dayButtons?.toArray() ?? [];
    const activeEl = document.activeElement as HTMLElement;

    const currentIndex = buttons.findIndex(
      (btn) => btn.nativeElement === activeEl,
    );

    if (currentIndex === -1) return;

    const cols = 7;
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = currentIndex - 1;
        break;
      case 'ArrowRight':
        nextIndex = currentIndex + 1;
        break;
      case 'ArrowUp':
        nextIndex = currentIndex - cols;
        break;
      case 'ArrowDown':
        nextIndex = currentIndex + cols;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = buttons.length - 1;
        break;
    }

    // Salto al mes anterior
    if (
      (event.key === 'ArrowLeft' && currentIndex === 0) ||
      event.key === 'PageUp'
    ) {
      this.prevMonth();

      setTimeout(() => {
        const updatedButtons = this.dayButtons?.toArray() ?? [];

        // Si saltamos de mes con `PageUp`, buscamos el día actual
        // pero si saltamos con la `ArrowLeft` buscamos el último día habilitado
        if (event.key === 'PageUp') {
          const currentDay = activeEl.dataset['day'];
          const match = updatedButtons.find((btn) => {
            const btnDay = btn.nativeElement.dataset['day'];
            return btnDay === currentDay;
          });
          (
            match ?? updatedButtons.find((btn) => !btn.nativeElement.disabled)
          )?.nativeElement.focus();
        } else {
          const lastEnabled = [...updatedButtons]
            .reverse()
            .find((btn) => !btn.nativeElement.disabled);
          lastEnabled?.nativeElement.focus();
        }
      }, 0);
      return;
    }

    // Salto al mes siguiente
    if (
      (event.key === 'ArrowRight' && currentIndex === buttons.length - 1) ||
      event.key === 'PageDown'
    ) {
      this.nextMonth();

      setTimeout(() => {
        const updatedButtons = this.dayButtons?.toArray() ?? [];

        // Si saltamos de mes con `PageDown`, buscamos el día actual
        // pero si saltamos con la `ArrowRight` buscamos el primer día habilitado
        if (event.key === 'PageDown') {
          const currentDay = activeEl.dataset['day'];
          const match = updatedButtons.find((btn) => {
            const btnDay = btn.nativeElement.dataset['day'];
            return btnDay === currentDay;
          });
          (
            match ?? updatedButtons.find((btn) => !btn.nativeElement.disabled)
          )?.nativeElement.focus();
        } else {
          const firstEnabled = updatedButtons.find(
            (btn) => !btn.nativeElement.disabled,
          );
          firstEnabled?.nativeElement.focus();
        }
      }, 0);
      return;
    }

    // Si el siguiente índice está dentro del rango actual, hacemos focus en él
    if (nextIndex >= 0 && nextIndex < buttons.length) {
      buttons[nextIndex].nativeElement.focus();
      return;
    }
  }

  /**
   * Función para cambiar a la vista de selección de meses
   * @param {KeyboardEvent} event - Evento de teclado
   */
  navigateCalendarMonths(event: KeyboardEvent) {
    if (this.viewMode() !== CalendarViewMode.MONTHS) return;

    const keys = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ];
    if (!keys.includes(event.key)) return;

    event.preventDefault();

    const buttons = this.monthButtons?.toArray() ?? [];
    const activeEl = document.activeElement as HTMLElement;

    const currentIndex = buttons.findIndex(
      (btn) => btn.nativeElement === activeEl,
    );
    if (currentIndex === -1) return;

    const cols = 3;
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = currentIndex - 1;
        break;
      case 'ArrowRight':
        nextIndex = currentIndex + 1;
        break;
      case 'ArrowUp':
        nextIndex = currentIndex - cols;
        break;
      case 'ArrowDown':
        nextIndex = currentIndex + cols;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = buttons.length - 1;
        break;
    }

    // Si el siguiente índice está dentro del rango actual, hacemos focus en él
    if (nextIndex >= 0 && nextIndex < buttons.length)
      buttons[nextIndex].nativeElement.focus();
  }

  /**
   * Función para manejar la navegación por años en la vista de selección de años
   * @param {KeyboardEvent} event - Evento de teclado
   */
  navigateCalendarYears(event: KeyboardEvent) {
    if (this.viewMode() !== CalendarViewMode.YEARS) return;

    const keys = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'PageUp',
      'PageDown',
    ];
    if (!keys.includes(event.key)) return;

    event.preventDefault();

    const buttons = this.yearButtons?.toArray() ?? [];
    const activeEl = document.activeElement as HTMLElement;

    const currentIndex = buttons.findIndex(
      (btn) => btn.nativeElement === activeEl,
    );
    if (currentIndex === -1) return;

    const cols = 4;
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = currentIndex - 1;
        break;
      case 'ArrowRight':
        nextIndex = currentIndex + 1;
        break;
      case 'ArrowUp':
        nextIndex = currentIndex - cols;
        break;
      case 'ArrowDown':
        nextIndex = currentIndex + cols;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = buttons.length - 1;
        break;
    }

    // Saltar a años anteriores
    if (
      event.key === 'PageUp' ||
      (['ArrowLeft', 'ArrowUp'].includes(event.key) && currentIndex === 0)
    ) {
      this.loadPastYears();
      setTimeout(() => {
        // Si saltamos a años pasados con `PageUp`, marcamos el primer año,
        // pero si saltamos con la `ArrowLeft` buscamos el último año
        if (event.key === 'PageUp') {
          this.yearButtons?.first?.nativeElement.focus();
        } else {
          this.yearButtons?.last?.nativeElement.focus();
        }
      });
      return;
    }

    // Saltar a años futuros
    if (
      event.key === 'PageDown' ||
      (['ArrowRight', 'ArrowDown'].includes(event.key) &&
        currentIndex === buttons.length - 1)
    ) {
      this.loadFutureYears();
      setTimeout(() => {
        // Si saltamos a años futuros con `PageDown` o con `ArrowRight` buscamos el primer año
        this.yearButtons?.first?.nativeElement.focus();
      });
    }

    if (nextIndex >= 0 && nextIndex < buttons.length) {
      buttons[nextIndex].nativeElement.focus();
      return;
    }
  }

  /**
   * Función para establecer el foco en el primer día del mes actual o en el día seleccionado
   */
  focusInitialDay() {
    const buttons = this.dayButtons?.toArray() ?? [];

    const selected = buttons.find((btn) =>
      btn.nativeElement.classList.contains('calendar-picker__day--selected'),
    );

    const fallback = buttons.find((btn) => !btn.nativeElement.disabled);

    const target = selected ?? fallback;

    buttons.forEach((btn) => btn.nativeElement.setAttribute('tabindex', '-1'));

    if (target) {
      target.nativeElement.setAttribute('tabindex', '0');
      target.nativeElement.focus();
    }
  }

  /**
   * Función para establecer el foco en el año seleccionado o el primer año habilitado
   */
  focusSelectedYear() {
    setTimeout(() => {
      const buttons = this.yearButtons?.toArray() ?? [];
      const selected = buttons.find(
        (btn) => btn.nativeElement.getAttribute('aria-selected') === 'true',
      );

      selected?.nativeElement.focus();
    }, 0);
  }

  /**
   * Función para inicializar el calendario
   */
  initCalendar() {
    this.normalizeCurrentDate(this.currentViewDate());
    this.allMonths = moment.months();
    this.renderCalendarDays();
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
  renderCalendarDays() {
    const firstDayOfMonth = moment(this.currentViewDate()).startOf('month');
    const firstCell = firstDayOfMonth.clone().startOf('isoWeek'); // lunes de la 1ª fila
    const totalDays = 6 * 7; // 6 filas x 7 columnas
    const days: CalendarDay[] = [];

    const disabledDates = this.getDisabledDates();

    for (let i = 0; i < totalDays; i++) {
      const date = firstCell.clone().add(i, 'day');

      const isDisabled = disabledDates.some((dd) => dd.isSame(date, 'day'));

      days.push({
        date,
        isCurrentMonth: date.month() === firstDayOfMonth.month(),
        isToday: date.isSame(moment(), 'day'),
        isSelected: this.checkIfSelected(date),
        isInRange: this.checkIfInRange(date),
        isDisabled: isDisabled,
      });
    }

    this.daysInMonth.set(days);

    // Enfocar el primer día del mes o el día seleccionado
    setTimeout(() => this.focusInitialDay());
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

    if (this.type === CalendarSelectionType.DAY) {
      // Selección por día exacto
      return date.isSame(this._defaultDate()!, 'day');
    } else if (
      this.type === CalendarSelectionType.WEEK ||
      this.type === CalendarSelectionType.RANGE
    ) {
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
   * @param {string} startDate - Fecha de inicio en formato DEFAULT_FORMAT
   * @param {string} endDate - Fecha de fin en formato DEFAULT_FORMAT
   * @returns {string[]} - Array de fechas habilitadas en formato DEFAULT_FORMAT
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
  selectDay(day: CalendarDay, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    // Si el día es inválido, si no hay fecha, si está deshabilitado o si no es del mes actual, no hacemos nada
    if (!day || !day.date || day.isDisabled || !day.isCurrentMonth) return;

    // Marcamos el día como seleccionado
    day.isSelected = true;

    // Si el tipo es día, semana o rango, establecemos la fecha
    if (this.type === CalendarSelectionType.DAY) {
      this.setDay(day);
    } else if (this.type === CalendarSelectionType.WEEK) {
      this.setWeek(day);
    } else if (this.type === CalendarSelectionType.RANGE) {
      this.setRange(day);
    }
  }

  /**
   * Función para establecer el día seleccionado
   * @param {CalendarDay} day
   */
  setDay(day: CalendarDay) {
    // Si no hay fecha o no es de tipo `moment`, no hacemos nada
    if (!day || !day.date || !moment.isMoment(day.date)) return;

    this._defaultDate.set(day.date);
    this.currentViewDate.set(day.date.format(DEFAULT_FORMAT));
    this.renderCalendarDays();
    this.emitDateSelected(day.date.format(DEFAULT_FORMAT));
  }

  /**
   * Función para establecer la semana seleccionada y devolver
   * el array de días válidos (filtrados o no)
   * @param {CalendarDay} day
   */
  setWeek(day: CalendarDay) {
    // Limpiamos las fechas si ya hay un rango establecido, evitando conflictos
    // con la selección de rango anterior
    if (!!this._startDate() && !!this._endDate()) {
      this._startDate.set(null);
      this._endDate.set(null);
    }

    // Si no hay fecha o no es de tipo `moment`, no hacemos nada
    if (!day || !day.date || !moment.isMoment(day.date)) return;

    // Calculamos el primer y último día de la semana
    const firstDay = day.date.clone().startOf('isoWeek');
    const lastDay = day.date.clone().endOf('isoWeek');

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
      this.renderCalendarDays();
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
    this.emitDateSelected(filteredDates);
  }

  /**
   * Función para establecer un rango de fechas seleccionado
   * @param {CalendarDay} day
   */
  setRange(day: CalendarDay) {
    // Limpiamos las fechas si ya hay un rango establecido, evitando conflictos
    // con la selección de rango anterior
    if (!!this._startDate() && !!this._endDate()) {
      this._startDate.set(null);
      this._endDate.set(null);
    }

    // Lógica para establecer el inicio o fin del rango
    if (!this._startDate()) {
      this._startDate.set(day.date);
    } else if (!this._endDate() && day.date.isAfter(this._startDate()!)) {
      this._endDate.set(day.date);
    } else if (this._startDate()!.isSame(day.date)) {
      this._startDate.set(day.date);
      this._endDate.set(day.date);
    } else if (this._startDate()!.isAfter(day.date)) {
      const dateStart = this._startDate()!;
      this._startDate.set(day.date);
      this._endDate.set(dateStart);
    }

    // Si ya hay rango establecido, comprobamos fechas deshabilitadas y actuamos según configuración
    if (!!this._startDate() && !!this._endDate()) {
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
        this.renderCalendarDays();
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
      this.emitDateSelected(filteredDates);
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
  emitDateSelected(date: string | string[]) {
    this.dateSelected.emit(date);
  }

  /**
   * Función para estabelcer la vista de días (default)
   */
  setDefaultView() {
    this.viewMode.set(CalendarViewMode.DEFAULT);
    this.renderCalendarDays();

    // Hacemos focus en el primer día del mes actual
    const firstDayButton = this.dayButtons.first;
    if (firstDayButton) firstDayButton.nativeElement.focus();
  }

  /**
   * Función para establecer la vista de meses
   */
  setMonthsView() {
    this.viewMode.set(CalendarViewMode.MONTHS);

    // Pequeño delay para que se rendericen los botones y podamos hacer focus
    setTimeout(() => {
      const monthIndex = this.currentMonthNumber();
      const monthButton = this.monthButtons.toArray()[monthIndex];
      if (monthButton) monthButton.nativeElement.focus();
    }, 0);
  }

  /**
   * Función para establecer la vista de años
   */
  setYearsView() {
    this.viewMode.set(CalendarViewMode.YEARS);

    // Cargamos el rango de años para la vista
    const year = moment(new Date(this.currentViewDate())).year();
    this.loadYearRange(year);

    // Hacemos focus en el año actual
    this.focusSelectedYear();
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
    this.renderCalendarDays();
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
    this.renderCalendarDays();
  }

  /**
   * Cambiar el mes seleccionado en la vista de calendario
   * @param month número de mes (0-11)
   * @param event Evento (opcional)
   */
  selectMonth(month: number, event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    // Volvemos al a vista por defecto
    this.setDefaultView();

    this.currentViewDate.set(
      moment(new Date(this.currentViewDate()))
        .set('month', month)
        .format(DEFAULT_FORMAT),
    );
    this.renderCalendarDays();
  }

  /**
   * Cambiar el año seleccionado en la vista de calendario
   * @param {number} year Año a cambiar (4 dígitos)
   * @param {Event} event Evento (opcional)
   */
  selectYear(year: number, event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    // Volvemos al a vista por defecto
    this.setDefaultView();

    this.currentViewDate.set(
      (this._defaultDate() ?? moment())
        .clone()
        .set('year', Number(year))
        .format(DEFAULT_FORMAT),
    );
    this.renderCalendarDays();
  }

  /**
   * Carga el rango de años para la vista de selección de años
   * @param centerYear año central para cargar la década (default: año actual)
   */
  loadYearRange(centerYear: number = moment().year()) {
    const startYear = Math.floor(centerYear / 20) * 20;
    this.allYears = Array.from({ length: 20 }, (_, i) =>
      Number(
        moment()
          .year(startYear + i)
          .format('YYYY'),
      ),
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

  /**
   * Devuelve la etiqueta aria para el calendario según el tipo de selección
   */
  getAriaLabelForCalendar(): string {
    const start = this._startDate() ? this._startDate()!.format('LL') : '';
    const end = this._endDate() ? this._endDate()!.format('LL') : '';
    const current = moment(this.currentViewDate()).format('LL');

    switch (this.type) {
      case CalendarSelectionType.DAY:
        return current;
      case CalendarSelectionType.RANGE:
      case CalendarSelectionType.WEEK:
        return `${start} - ${end}`;
      default:
        return '';
    }
  }
}
