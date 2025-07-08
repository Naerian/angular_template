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
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'moment';
import {
  CalendarDay,
  CalendarType,
  CalendarViewMode,
  SelectionType,
  ViewMode,
} from './models/calendar.model';
import { CalendarService } from './services/calendar.service';
import { NarTranslations } from '@shared/translations/translations.model';
import { NAR_TRANSLATIONS } from '@shared/translations/translations.token';

/**
 * @name
 * neo-calendar
 * @description
 * Componente para crear un calendario
 * @example
 * <neo-calendar [type]="'day'" [date]="'2021-12-31'" (dateSelected)="dateSelected($event)"></neo-calendar>
 */
@Component({
  selector: 'neo-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, OverlayModule, A11yModule],
})
export class CalendarComponent implements OnInit {
  // ViewChildrens para acceder a los botones de días, meses y años.
  @ViewChildren('monthButton') monthButtons!: QueryList<
    ElementRef<HTMLButtonElement>
  >;
  @ViewChildren('yearButton') yearButtons!: QueryList<
    ElementRef<HTMLButtonElement>
  >;
  @ViewChildren('dayButton') dayButtons!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  @Input() type: SelectionType = CalendarType.DAY;
  @Input() disabledDates: (string | Date)[] | undefined = undefined;
  @Input() blockDisabledRanges: boolean | undefined = undefined;
  @Input() isOpenedByOverlay: boolean = false;

  /**
   * Input para establecer la fecha por defecto del calendario
   * Este setter actualizará la señal `selectedDate` y `selectedRange` según el tipo.
   */
  @Input()
  set date(value: Date | Date[] | string | string[] | null) {
    queueMicrotask(() => this.updateSelectedDate(value));
  }
  get date(): moment.Moment | moment.Moment[] | null {
    if (this.type === CalendarType.DAY) {
      return this.selectedDate();
    } else if (
      this.type === CalendarType.WEEK ||
      this.type === CalendarType.RANGE
    ) {
      return this.selectedRange();
    }
    return null;
  }

  // Variable privada para almacenar las traducciones del calendario por defecto o las inyectadas.
  protected _translations: NarTranslations = inject(NAR_TRANSLATIONS);

  // Evento para emitir la fecha seleccionada.
  @Output() dateSelected = new EventEmitter<Date | Date[]>();

  // Eventos para manejar advertencias de fechas bloqueadas y deshabilitadas.
  @Output() blockedRangeWarning: EventEmitter<void> = new EventEmitter();
  @Output() disabledDatesWarning: EventEmitter<void> = new EventEmitter();

  // Constantes para el modo de vista del calendario y el tipo de selección.
  public readonly VIEW_MODE = CalendarViewMode;
  public readonly SELECTION_TYPE = CalendarType;
  readonly viewMode: WritableSignal<ViewMode> = signal(
    CalendarViewMode.DEFAULT,
  );

  // Señales para manejar el estado del calendario.
  readonly selectedDate: WritableSignal<moment.Moment | null> = signal(null);
  readonly daysInMonth: WritableSignal<CalendarDay[]> = signal([]);
  readonly currentViewDate: WritableSignal<Date | null> = signal(
    moment().toDate(),
  );
  readonly selectedRange: WritableSignal<moment.Moment[]> = signal([]);
  readonly currentYear: Signal<number> = computed(() =>
    moment(this.currentViewDate()).year(),
  );
  readonly currentMonthNumber: Signal<number> = computed(() =>
    moment(this.currentViewDate()).month(),
  );

  // ID único para el calendario, útil para accesibilidad y pruebas.
  readonly calendarId = crypto.randomUUID();

  // Variables para almacenar los años y meses disponibles en el calendario.
  allYears: number[] = [];
  allMonths: string[] = [];

  // Variables para manejar el bloque de años y el inicio del bloque de años.
  yearsBlockStart = moment().year();

  // Inyección de Servicios
  private readonly _calendarService = inject(CalendarService);

  constructor() {
    // Effect para manejar el enfoque después de cambiar de vista.
    // Se ejecuta cada vez que `viewMode` cambia.
    effect(() => {
      const currentView = this.viewMode();
      // `queueMicrotask` asegura que `@ViewChildren` se hayan resuelto y el DOM esté actualizado.
      queueMicrotask(() => {
        if (currentView === CalendarViewMode.DEFAULT) {
          this.focusInitialDay();
        } else if (currentView === CalendarViewMode.MONTHS) {
          this.focusSelectedMonth();
        } else if (currentView === CalendarViewMode.YEARS) {
          this.focusSelectedYear();
        }
      });
    });
  }

  ngOnInit(): void {
    // Cargamos la traducción
    this.initCalendar();
  }

  /**
   * Listener para manejar el evento de teclado.
   * @param {KeyboardEvent} event - Evento de teclado.
   */
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

  /**
   * Función para inicializar los valores si se cargan desde el `@Input date`.
   * Parsea y establece `selectedDate`, `currentViewDate` y `selectedRange`.
   */
  private updateSelectedDate(value: Date | Date[] | string | string[] | null) {
    // Reseteamos ambas señales al inicio para evitar estados inconsistentes
    this.selectedDate.set(null);
    this.currentViewDate.set(null);
    this.selectedRange.set([]);

    // Si `value` es null o undefined y no es un array, establecemos la fecha de hoy.
    if ((value === null || value === undefined) && !Array.isArray(value)) {
      // Si el input es nulo, indefinido o un array vacío
      if (this.type === CalendarType.DAY) this.setToday();
    }
    // Si es un array, parseamos las fechas y actualizamos las señales correspondientes.
    else if (Array.isArray(value) && value.length > 0) {
      // Parseamos las fechas del array, asegurándonos de que sean Moment válidos.
      const parsedDates = value
        .map((dateStr) => this._calendarService.convertToMoment(dateStr))
        .filter((m): m is moment.Moment => m !== null);

      // Si el array contiene fechas inválidas, no procesar y dejar el estado inicializado por defecto (hoy si es DAY).
      // La lógica de setToday() en el bloque inicial ya lo maneja si es DAY.
      // --
      // Si las fechas son válidas, procesamos según el tipo de calendario.
      if (parsedDates.length === 0) {
      } else {
        // Si es de tipo DAY y se ha pasado un array, tomamos la primera fecha.
        if (this.type === CalendarType.DAY) {
          this.selectedDate.set(parsedDates[0]); // Establecemos la primera fecha como seleccionada.
          this.currentViewDate.set(parsedDates[0].toDate()); // Establecemos la fecha de vista actual.
        }
        // Si es de tipo WEEK, comprobamos si el array representa una semana completa válida,
        // o si el array tiene un único valor, establecemos la semana en base a esa fecha.
        else if (this.type === CalendarType.WEEK) {
          // Si el array tiene una sola fecha, establecemos la semana en base a esa fecha.
          if (parsedDates.length === 1) {
            const firstDay = parsedDates[0].clone().startOf('isoWeek');
            const lastDay = parsedDates[0].clone().endOf('isoWeek');
            this.handleRangeSelection(firstDay, lastDay, true); // true indica selección de semana.
          }
          // Si el array tiene más de una fecha, tomamos la primera como inicio de semana.
          else {
            const firstDate = parsedDates[0].clone();
            const startOfWeek = firstDate.clone().startOf('isoWeek');
            const endOfWeek = firstDate.clone().endOf('isoWeek');
            this.handleRangeSelection(startOfWeek, endOfWeek, true);
          }
        }
        // Si es de tipo RANGE, usamos el array de fechas como rango.
        else if (this.type === CalendarType.RANGE) {
          // Si el array tiene una sola fecha, es el inicio y fin del rango.
          if (parsedDates.length === 1) {
            const firstDay = parsedDates[0].clone();
            const lastDay = parsedDates[0].clone();
            this.handleRangeSelection(firstDay, lastDay);
          }
          // Si el array tiene más de una fecha, tomamos la primera y última como inicio y fin del rango, ordenándolas.
          else {
            const sortedDates = [...parsedDates].sort(
              (a, b) => a.valueOf() - b.valueOf(),
            );
            const startDay = sortedDates[0].clone();
            const endDay = sortedDates[sortedDates.length - 1].clone();
            this.handleRangeSelection(startDay, endDay);
          }
        }
      }
    }
    // Si el input es una sola fecha (string o Date)
    else {
      if (
        typeof value === 'string' ||
        value instanceof Date ||
        value === null
      ) {
        const parsedDate = this._calendarService.convertToMoment(value);
        if (parsedDate && parsedDate.isValid()) {
          if (this.type === CalendarType.DAY) {
            // Si es tipo DAY, establecer la fecha seleccionada y la vista actual.
            this.selectedDate.set(parsedDate);
            this.currentViewDate.set(parsedDate.toDate());
          } else if (this.type === CalendarType.WEEK) {
            // Si es tipo WEEK y se pasa una sola fecha, establecer la semana en base a esa fecha.
            const firstDay = parsedDate.clone().startOf('isoWeek');
            const lastDay = parsedDate.clone().endOf('isoWeek');
            this.handleRangeSelection(firstDay, lastDay, true);
          } else if (this.type === CalendarType.RANGE) {
            // Para tipo RANGE con una sola fecha, es el inicio y fin de un rango.
            // Por lo que el valor se duplica para el array con la misma fecha.
            const firstDay = parsedDate.clone();
            const lastDay = parsedDate.clone();
            this.handleRangeSelection(firstDay, lastDay);
          }
        }
      }
    }

    // Aseguramos que currentViewDate tenga un valor si no se procesó ninguna fecha específica.
    if (!this.currentViewDate()) this.currentViewDate.set(moment().toDate());

    // Renderizamos los días del calendario después de actualizar la fecha.
    this.renderCalendarDays();

    // Si no se abre el overlay y se ha procesado una fecha válida, emitimos la fecha seleccionada automáticamente.
    // De esta forma el propio calendario puede emitir los valores sin pertenecer, por ejemplo, a un date-picker.
    setTimeout(() => {
      if (!this.isOpenedByOverlay) {
        if (this.type === CalendarType.DAY && this.selectedDate()) {
          this.emitDateSelected(this.selectedDate()?.toDate() as Date);
        } else if (
          this.type === CalendarType.WEEK ||
          this.type === CalendarType.RANGE
        ) {
          this.emitDateSelected(
            (this.selectedRange()?.map((date) => date.toDate()) ??
              []) as Date[],
          );
        }
      }
    });
  }

  /**
   * Helper genérico para navegar entre botones utilizando las teclas de flecha, Home y End.
   * Permite la navegación en una cuadrícula de botones, como los días del calendario.
   * @param {QueryList<ElementRef<HTMLButtonElement>>} buttons - Lista de botones a navegar.
   * @param {KeyboardEvent} event - Evento de teclado que contiene la tecla pulsada.
   * @param {number} cols - Número de columnas en la cuadrícula de botones.
   */
  private navigateButtons(
    buttons: QueryList<ElementRef<HTMLButtonElement>>,
    event: KeyboardEvent,
    cols: number,
  ): void {
    const btns = buttons.toArray();
    const activeEl = document.activeElement as HTMLElement;
    const currentIndex = btns.findIndex(
      (btn) => btn.nativeElement === activeEl,
    );

    if (currentIndex === -1) return;

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
        nextIndex = btns.length - 1;
        break;
    }

    if (nextIndex >= 0 && nextIndex < btns.length) {
      // Actualizamos el tabindex para el "roaming tabindex"
      btns[currentIndex].nativeElement.setAttribute('tabindex', '-1');
      btns[nextIndex].nativeElement.setAttribute('tabindex', '0');
      btns[nextIndex].nativeElement.focus();
    }
  }

  /**
   * Función para navegar entre los días del calendario en la vista `default`.
   * @param {KeyboardEvent} event - Tecla pulsada (ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Home, End, PageUp, PageDown).
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

    event.preventDefault(); // Prevenimos el comportamiento por defecto de la tecla.

    const activeEl = document.activeElement as HTMLElement;

    // Salto al mes anterior con PageUp o ArrowLeft si estamos en el primer día.
    if (
      event.key === 'PageUp' ||
      (event.key === 'ArrowLeft' &&
        this.dayButtons.first?.nativeElement === activeEl)
    ) {
      this.prevMonth();
      // `setTimeout` para asegurar que los botones se han renderizado antes de intentar enfocar.
      setTimeout(() => {
        const updatedButtons = this.dayButtons?.toArray() ?? [];
        // Intentar enfocar el último día del mes que esté visible y no esté deshabilitado.
        const targetButton = [...updatedButtons]
          .reverse()
          .find(
            (btn) =>
              !btn.nativeElement.disabled &&
              btn.nativeElement.classList.contains(
                'calendar-picker__day--current-month',
              ),
          );
        // Fallback: si no hay un día "current-month" disponible, enfocar el último día hábil de la cuadrícula.
        (
          targetButton ??
          [...updatedButtons]
            .reverse()
            .find((btn) => !btn.nativeElement.disabled)
        )?.nativeElement.focus();
      }, 0);
      return;
    }

    // Salto al mes siguiente con PageDown o ArrowRight si estamos en el último día.
    if (
      event.key === 'PageDown' ||
      (event.key === 'ArrowRight' &&
        this.dayButtons.last?.nativeElement === activeEl)
    ) {
      this.nextMonth();
      // `setTimeout` para asegurar que los botones se han renderizado antes de intentar enfocar.
      setTimeout(() => {
        const updatedButtons = this.dayButtons?.toArray() ?? [];
        // Intentar enfocar el primer día del mes que esté visible y no esté deshabilitado.
        const targetButton = updatedButtons.find(
          (btn) =>
            !btn.nativeElement.disabled &&
            btn.nativeElement.classList.contains(
              'calendar-picker__day--current-month',
            ),
        );
        // Fallback: si no hay un día "current-month" disponible, enfocar el primer día hábil de la cuadrícula.
        (
          targetButton ??
          updatedButtons.find((btn) => !btn.nativeElement.disabled)
        )?.nativeElement.focus();
      }, 0);
      return;
    }

    // Navegación normal con flechas, Home y End.
    this.navigateButtons(this.dayButtons, event, 7);
  }

  /**
   * Función para cambiar a la vista de selección de meses.
   * @param {KeyboardEvent} event - Evento de teclado.
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
    this.navigateButtons(this.monthButtons, event, 3);
  }

  /**
   * Función para manejar la navegación por años en la vista de selección de años.
   * @param {KeyboardEvent} event - Evento de teclado.
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

    const activeEl = document.activeElement as HTMLElement;

    // Saltar a años anteriores con PageUp o si estamos en el primer año del bloque.
    if (
      event.key === 'PageUp' ||
      (['ArrowLeft', 'ArrowUp'].includes(event.key) &&
        this.yearButtons.first?.nativeElement === activeEl)
    ) {
      this.loadPastYears();
      setTimeout(() => this.yearButtons.last?.nativeElement.focus(), 0); // Enfoca el último del nuevo bloque.
      return;
    }

    // Saltar a años futuros con PageDown o si estamos en el último año del bloque.
    if (
      event.key === 'PageDown' ||
      (['ArrowRight', 'ArrowDown'].includes(event.key) &&
        this.yearButtons.last?.nativeElement === activeEl)
    ) {
      this.loadFutureYears();
      setTimeout(() => this.yearButtons.first?.nativeElement.focus(), 0); // Enfoca el primero del nuevo bloque.
      return;
    }

    this.navigateButtons(this.yearButtons, event, 4);
  }

  /**
   * Función para establecer el foco en el primer día del mes actual o en el día seleccionado.
   * Se utiliza para la navegación de accesibilidad.
   */
  focusInitialDay() {
    queueMicrotask(() => {
      // Obtenemos todos los días del mes actual.
      const allCalendarDays = this.daysInMonth();

      // Filtramos solo los días del mes actual que no están deshabilitados.
      const availableDays = allCalendarDays.filter(
        (day) => !day.isDisabled && day.isCurrentMonth,
      );

      // Obtenemos los botones de los días del calendario.
      const buttons = this.dayButtons?.toArray() ?? [];

      if (buttons.length === 0 || availableDays.length === 0) return;

      let targetDayData: CalendarDay | undefined;

      // Prioridad 1: Día actualmente seleccionado que sea del mes actual y no esté deshabilitado.
      targetDayData = availableDays.find((day) => day.isSelected);

      // Prioridad 2: Día de hoy, si es del mes actual y no está deshabilitado.
      if (!targetDayData)
        targetDayData = availableDays.find((day) => day.isToday);

      // Prioridad 3: Primer día del mes actual no deshabilitado.
      if (!targetDayData) targetDayData = availableDays[0];

      // Encuentra el botón HTML correspondiente al día objetivo.
      const targetButton = buttons.find(
        (btn) =>
          Number(btn.nativeElement.getAttribute('data-day')) ===
          targetDayData?.date.date(),
      );

      // Si encontramos el botón del día objetivo, lo enfocamos.
      if (targetButton) {
        // Establecemos tabindex -1 en todos los botones para que no sean accesibles por tabulación.
        buttons.forEach((btn) =>
          btn.nativeElement.setAttribute('tabindex', '-1'),
        );

        // Establecemos tabindex 0 en el botón seleccionado y lo enfocamos.
        targetButton.nativeElement.setAttribute('tabindex', '0');
        targetButton.nativeElement.focus();
      }
    });
  }

  /**
   * Función para establecer el foco en el año seleccionado o el primer año habilitado.
   * Se utiliza para la navegación de accesibilidad.
   */
  focusSelectedYear() {
    queueMicrotask(() => {
      const buttons = this.yearButtons?.toArray() ?? [];
      const selected = buttons.find(
        (btn) => btn.nativeElement.getAttribute('aria-selected') === 'true',
      );

      // Establecer tabindex -1 en todos los botones para que no sean accesibles por tabulación.
      buttons.forEach((btn) =>
        btn.nativeElement.setAttribute('tabindex', '-1'),
      );

      // Establecemos tabindex 0 en el botón seleccionado y lo enfocamos.
      selected?.nativeElement.setAttribute('tabindex', '0');
      selected?.nativeElement.focus();
    });
  }

  /**
   * Nueva función para enfocar el mes seleccionado.
   * Se utiliza para la navegación de accesibilidad.
   */
  focusSelectedMonth() {
    queueMicrotask(() => {
      const buttons = this.monthButtons?.toArray() ?? [];
      const monthIndex = this.currentMonthNumber();
      const monthButton = buttons[monthIndex]; // Usa 'buttons' para obtener el elemento

      // Establecer tabindex -1 en todos los botones para que no sean accesibles por tabulación.
      buttons.forEach((btn) =>
        btn.nativeElement.setAttribute('tabindex', '-1'),
      );

      // Establecemos tabindex 0 en el botón seleccionado y lo enfocamos.
      if (monthButton) {
        monthButton.nativeElement.setAttribute('tabindex', '0'); // Primero hacemos tabulable
        monthButton.nativeElement.focus(); // Luego enfocamos
      }
    });
  }

  /**
   * Función para inicializar el calendario.
   * Obtiene los nombres de los meses y asegura que la vista esté lista.
   */
  initCalendar() {
    queueMicrotask(() => {
      // Asegurarse de que currentViewDate siempre tenga un valor inicial válido.
      if (!this.currentViewDate()) this.currentViewDate.set(moment().toDate());

      // Si el calendario es de tipo 'DAY', y no hay fecha parametrizada,
      // establecemos la fecha seleccionada al día actual y enfocamos dicho día.
      if (
        !this.date ||
        this.date === null ||
        (Array.isArray(this.date) && this.date.length === 0)
      ) {
        if (this.type === CalendarType.DAY) {
          this.setToday();
          this.focusInitialDay();
        }

        // Renderizamos los días del calendario. Si hubiese fecha se renderizaría desde el método `updateSelectedDate`.
        this.renderCalendarDays();
      }
    });
  }

  /**
   * Función para establecer todos los datos al día de hoy.
   */
  setToday() {
    const today = moment();
    this.selectedDate.set(today);
    this.currentViewDate.set(today.toDate());
    this.selectedRange.set([]);

    // Si no se abre el overlay, emitimos la fecha seleccionada automáticamente.
    setTimeout(() => {
      if (!this.isOpenedByOverlay) this.emitDateSelected(today.toDate());
    });
  }

  /**
   * Función para construir los días del calendario basándose en `currentViewDate`.
   * Actualiza el signal `daysInMonth`.
   */
  renderCalendarDays() {
    // Limpiamos el array de días antes de llenarlo.
    const days: CalendarDay[] = [];

    // Creamos el primer día del mes actual y el primer día de la semana (lunes).
    const firstDayOfMonth = moment(this.currentViewDate()).startOf('month');
    const firstCell = firstDayOfMonth.clone().startOf('isoWeek'); // Lunes de la 1ª fila.

    // Calculamos el total de días a mostrar en el calendario (6 filas x 7 columnas).
    // Esto asegura que siempre mostramos 6 filas, incluso si el mes tiene menos días.
    // Por ejemplo, si el mes empieza en un miércoles, habrá días del mes anterior en el calendario.
    const totalDays = 6 * 7; // 6 filas x 7 columnas para cubrir todo el mes.

    // Obtenemos las fechas deshabilitadas del input `disabledDates`, si las hubiese.
    const disabledDates = this.getDisabledDates();

    // Iteramos desde el primer día de la semana hasta el total de días a mostrar.
    // Esto incluye días del mes anterior y del siguiente para completar las 6 filas.
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

    // Actualizamos el signal `daysInMonth` con los días generados.
    this.daysInMonth.set(days);
  }

  /**
   * Obtiene las fechas deshabilitadas del input `disabledDates` y las convierte a Moment.
   * @returns {moment.Moment[]} Array de fechas deshabilitadas.
   */
  getDisabledDates(): moment.Moment[] {
    return (
      this.disabledDates
        ?.map((date) => moment(date))
        .filter((m) => m.isValid()) ?? []
    );
  }

  /**
   * Comprueba si una fecha dada está seleccionada según el `type` de selección.
   * @param {moment.Moment} date - La fecha a comprobar.
   * @returns {boolean} True si la fecha está seleccionada.
   */
  checkIfSelected(date: moment.Moment): boolean {
    if (this.type === CalendarType.DAY) {
      const currentSelected = this.selectedDate();
      return (
        moment.isMoment(currentSelected) && date.isSame(currentSelected, 'day')
      );
    } else if (
      this.type === CalendarType.WEEK ||
      this.type === CalendarType.RANGE
    ) {
      // Para WEEK o RANGE, la "selección" visual se basa en el rango.
      // Un día se considera "seleccionado" si está en el rango.
      return this.checkIfInRange(date);
    }
    return false;
  }

  /**
   * Comprueba si una fecha dada está dentro del rango `selectedRange`.
   * @param {moment.Moment} date - La fecha a comprobar.
   * @returns {boolean} True si la fecha está dentro del rango.
   */
  checkIfInRange(date: moment.Moment): boolean {
    const rangeDates = this.selectedRange();
    if (rangeDates.length === 0) return false;
    return this._calendarService.isRangeDate(date, rangeDates);
  }

  /**
   * Función principal para seleccionar un día, semana o rango de fechas.
   * Delega la lógica específica a `setDay`, `setWeek` o `setRange`.
   * @param {CalendarDay} day - El día seleccionado.
   * @param {Event} event - Evento del clic, si se recibe.
   */
  selectDay(day: CalendarDay, event?: Event) {
    // Si se recibe un evento, evitamos la propagación para evitar conflictos con el overlay.
    event?.stopPropagation();

    // Validaciones básicas antes de proceder.
    if (!day || !day.date || day.isDisabled || !day.isCurrentMonth) return;

    if (this.type === CalendarType.DAY) {
      this.setDay(day);
    } else if (this.type === CalendarType.WEEK) {
      this.setWeek(day);
    } else if (this.type === CalendarType.RANGE) {
      this.setRange(day);
    }
  }

  /**
   * Función unificada para manejar la lógica de selección de rango (semana/rango).
   * Contiene la lógica común para verificar fechas deshabilitadas y emitir eventos.
   * Esta función se utiliza tanto para semanas como para rangos de fechas.
   * @param {moment.Moment} startDate - Fecha de inicio del rango.
   * @param {moment.Moment} endDate - Fecha de fin del rango.
   * @param {boolean} isWeekSelection - Indica si es una selección de semana.
   */
  private handleRangeSelection(
    startDate: moment.Moment,
    endDate: moment.Moment,
    isWeekSelection: boolean = false,
  ): void {
    // Si no es selección de semana y ya hay un rango, lo limpiamos para reiniciar.
    // Esto evita que se mantenga un rango previo al seleccionar un nuevo inicio.
    if (
      !isWeekSelection &&
      this.selectedRange().length > 0 &&
      !(
        startDate.isSame(this.selectedRange()[0], 'day') &&
        endDate.isSame(
          this.selectedRange()[this.selectedRange().length - 1],
          'day',
        )
      )
    ) {
      this.selectedRange.set([]);
    }

    // Obtenemos todas las fechas entre el inicio y el fin del rango en un array de strings.
    const totalDates = this._calendarService.getDatesBetween(
      startDate,
      endDate,
    );

    // Obtenemos las fechas deshabilitadas del input `disabledDates`.
    const disabledDates = this.getDisabledDates();

    // Verificamos si hay alguna fecha deshabilitada en el rango seleccionado.
    const hasDisabledDates = totalDates.some((dateStr) =>
      disabledDates.some((disabledDate) =>
        moment(disabledDate).isSame(dateStr, 'day'),
      ),
    );

    // Si hay fechas deshabilitadas y `blockDisabledRanges` es `true`,
    // limpiamos la selección y emitimos una advertencia.
    // Esto bloquea la selección del rango si hay fechas deshabilitadas.
    if (this.blockDisabledRanges && hasDisabledDates) {
      this.selectedDate.set(null);
      this.selectedRange.set([]);
      this.renderCalendarDays();
      this.blockedRangeWarning.emit();
      return;
    }

    // Si hay fechas deshabilitadas pero `blockDisabledRanges` es `false`
    // emitimos una advertencia, pero no bloqueamos la selección.
    // Esto permite que el usuario pueda seleccionar el rango, pero con una advertencia.
    if (!this.blockDisabledRanges && hasDisabledDates)
      this.disabledDatesWarning.emit();

    // Filtramos las fechas deshabilitadas del rango si no está bloqueado.
    const filteredDates = totalDates.filter(
      (date) =>
        !disabledDates.some((disabledDate) =>
          moment(disabledDate).isSame(date, 'day'),
        ),
    );

    // Establecemos el rango seleccionado con las fechas filtradas.
    this.selectedRange.set(filteredDates.map((dateStr) => moment(dateStr)));
    this.selectedDate.set(null); // Limpiar selectedDate para tipos de rango

    // Si es de tipo WEEK, actualizamos la vista actual al primer día de la semana,
    // Si es de tipo RANGE, actualizamos al primer último día del rango,
    if (isWeekSelection) this.currentViewDate.set(startDate.toDate());
    else this.currentViewDate.set(endDate.toDate());
  }

  /**
   * Establece un único día como seleccionado.
   * @param {CalendarDay} day - El día a seleccionar.
   */
  setDay(day: CalendarDay) {
    if (!day || !day.date || !moment.isMoment(day.date)) return;

    // Asignamos el día seleccionado y actualizamos la vista actual.
    // Limpiamos el rango seleccionado al seleccionar un día individual.
    this.selectedDate.set(day.date);
    this.currentViewDate.set(day.date.toDate());
    this.selectedRange.set([]);

    // Emitimos la fecha seleccionada como un objeto Date.
    this.emitDateSelected(day.date.toDate());

    // Volvemos a renderizar los días del calendario para reflejar la selección.
    this.renderCalendarDays();
  }

  /**
   * Establece la semana seleccionada en base al día clicado.
   * @param {CalendarDay} day - Un día de la semana a seleccionar.
   */
  setWeek(day: CalendarDay) {
    if (!day || !day.date || !moment.isMoment(day.date)) return;
    const firstDay = day.date.clone().startOf('isoWeek');
    const lastDay = day.date.clone().endOf('isoWeek');
    this.handleRangeSelection(firstDay, lastDay, true);

    // Emitimos el rango seleccionado como un array de fechas.
    const daysSelected = this.selectedRange()?.map((d) => moment(d).toDate());
    this.emitDateSelected(daysSelected ?? []);

    // Volvemos a renderizar los días del calendario para reflejar la selección.
    this.renderCalendarDays();
  }

  /**
   * Establece un rango de fechas seleccionado.
   * @param {CalendarDay} day
   */
  setRange(day: CalendarDay) {
    if (!day || !day.date || !moment.isMoment(day.date)) return;

    const currentRange = this.selectedRange();

    // Caso 1: No hay rango seleccionado O ya hay un rango completo (longitud >= 2)
    // En ambos casos, este es el inicio de un nuevo rango.
    if (currentRange.length === 0 || currentRange.length >= 2) {
      this.selectedRange.set([day.date.clone()]);
      this.currentViewDate.set(day.date.toDate());
      this.selectedDate.set(null); // Limpiamos selectedDate al iniciar un rango
      this.renderCalendarDays(); // Para limpiar visualmente el rango anterior.
      return;
    }

    // Caso 2: Hay una fecha de inicio seleccionada (longitud 1)
    if (currentRange.length === 1) {
      const start = currentRange[0];
      const end = day.date;

      // Si la fecha final es anterior a la fecha inicial, reseteamos y el actual es el nuevo inicio.
      if (end.isBefore(start, 'day')) {
        this.selectedRange.set([day.date.clone()]);
        this.currentViewDate.set(day.date.toDate());
        this.selectedDate.set(null); // Limpiamos selectedDate
        this.renderCalendarDays(); // Limpiar el rango anterior y marcar el nuevo inicio.
        return;
      }

      // Si la fecha final es válida (posterior o igual), completamos el rango.
      this.handleRangeSelection(start, end);

      // Emitimos el rango seleccionado como un array de fechas.
      const daysSelected = this.selectedRange()?.map((d) => moment(d).toDate());
      this.emitDateSelected(daysSelected ?? []);

      // Volvemos a renderizar los días del calendario para reflejar la selección.
      this.renderCalendarDays();
    }
  }

  /**
   * Emite la fecha o rango seleccionado para notificar al componente padre.
   * @param {Date | Date[]} date - Fecha o rango de fechas seleccionado.
   */
  emitDateSelected(date: Date | Date[]) {
    this.dateSelected.emit(date);
  }

  /**
   * Establece la vista del calendario a la vista de días (predeterminada).
   * El enfoque del elemento se gestiona automáticamente por el `effect`.
   */
  setDefaultView() {
    this.viewMode.set(CalendarViewMode.DEFAULT);
    this.renderCalendarDays();
  }

  /**
   * Establece la vista del calendario a la vista de meses.
   * El enfoque del elemento se gestiona automáticamente por el `effect`.
   * @param {Event} event - Evento del clic, si se recibe.
   */
  setMonthsView(event?: Event) {
    // Si se recibe un evento, evitamos la propagación para evitar conflictos con el overlay.
    event?.stopPropagation();

    this.allMonths = moment.months();
    this.viewMode.set(CalendarViewMode.MONTHS);
  }

  /**
   * Establece la vista del calendario a la vista de años.
   * Carga el rango de años y el enfoque del elemento se gestiona automáticamente por el `effect`.
   * @param {Event} event - Evento del clic, si se recibe.
   */
  setYearsView(event?: Event) {
    // Si se recibe un evento, evitamos la propagación para evitar conflictos con el overlay.
    event?.stopPropagation();

    this.viewMode.set(CalendarViewMode.YEARS);
    const year = moment(this.currentViewDate()).year();
    this.loadYearRange(year);
  }

  /**
   * Cambia el calendario al mes anterior.
   * Actualiza `currentViewDate` y vuelve a renderizar los días.
   * @param {Event} event - Evento del clic, si se recibe.
   */
  prevMonth(event?: Event) {
    // Si se recibe un evento, evitamos la propagación para evitar conflictos con el overlay.
    event?.stopPropagation();

    const prevMonth = moment(this.currentViewDate()).subtract(1, 'month');
    this.currentViewDate.set(prevMonth.toDate());
    this.renderCalendarDays();
  }

  /**
   * Cambia el calendario al mes siguiente.
   * Actualiza `currentViewDate` y vuelve a renderizar los días.
   * @param {Event} event - Evento del clic, si se recibe.
   */
  nextMonth(event?: Event) {
    // Si se recibe un evento, evitamos la propagación para evitar conflictos con el overlay.
    event?.stopPropagation();

    const nextMonth = moment(this.currentViewDate()).add(1, 'month');
    this.currentViewDate.set(nextMonth.toDate());
    this.renderCalendarDays();
  }

  /**
   * Cambia el mes seleccionado en la vista de calendario.
   * @param month - Número de mes (0-11).
   * @param {Event} event - Evento del clic, si se recibe.
   */
  selectMonth(month: number, event?: Event) {
    // Si se recibe un evento, evitamos la propagación para evitar conflictos con el overlay.
    event?.stopPropagation();

    // Establecemos el mes actual al mes seleccionado actualizando `currentViewDate`.
    const currentDate = moment(this.currentViewDate())
      .set('month', month)
      .toDate();
    this.currentViewDate.set(currentDate);

    // Al seleccionar un mes, cambiamos a la vista de días
    this.setDefaultView();
  }

  /**
   * Cambia el año seleccionado en la vista de calendario.
   * @param {number} year - Año a cambiar (4 dígitos).
   * @param {Event} event - Evento del clic, si se recibe.
   */
  selectYear(year: number, event?: Event) {
    // Si se recibe un evento, evitamos la propagación para evitar conflictos con el overlay.
    event?.stopPropagation();

    // Establecemos el año actual al año seleccionado actualizando `currentViewDate`.
    const currentDate = moment(this.currentViewDate())
      .set('year', year)
      .startOf('year')
      .toDate();
    this.currentViewDate.set(currentDate);

    // Al seleccionar un año, cambiamos a la vista de meses
    // para facilitar al usuario la selección de la fecha completa.
    this.setMonthsView();
  }

  /**
   * Carga el rango de años para la vista de selección de años.
   * Genera 20 años en un bloque centrado alrededor de `centerYear`.
   * @param centerYear - Año central para cargar la década (por defecto: año actual).
   * @param event - Evento del clic, si se recibe.
   */
  loadYearRange(centerYear: number = moment().year(), event?: Event) {
    // Si se recibe un evento, evitamos la propagación para evitar conflictos con el overlay.
    event?.stopPropagation();

    // Calcula el año de inicio para el bloque de 20 años (múltiplo de 20).
    const startYear = Math.floor(centerYear / 20) * 20;
    this.allYears = Array.from({ length: 20 }, (_, i) =>
      Number(
        moment()
          .year(startYear + i)
          .format('YYYY'),
      ),
    );
    this.yearsBlockStart = startYear; // Guarda el inicio del bloque para la navegación.
  }

  /**
   * Carga el rango de años anterior (20 años atrás).
   * @param {Event} event - Evento del clic, si se recibe.
   */
  loadPastYears(event?: Event) {
    // Si se recibe un evento, evitamos la propagación para evitar conflictos con el overlay.
    event?.stopPropagation();
    this.loadYearRange(this.yearsBlockStart - 20);
  }

  /**
   * Carga el rango de años siguiente (20 años adelante).
   * @param {Event} event - Evento del clic, si se recibe.
   */
  loadFutureYears(event?: Event) {
    // Si se recibe un evento, evitamos la propagación para evitar conflictos con el overlay.
    event?.stopPropagation();
    this.loadYearRange(this.yearsBlockStart + 20);
  }

  /**
   * Vuelve a la vista predeterminada del calendario (días).
   * @param {Event} event - Evento del clic, si se recibe.
   */
  backToDefaultView(event?: Event) {
    // Si se recibe un evento, evitamos la propagación para evitar conflictos con el overlay
    event?.stopPropagation();

    // Volvemos a la vista de días (predeterminada).
    this.setDefaultView();
  }

  /**
   * Genera el texto para los atributos 'title' y 'aria-label' de un día.
   * Si el día está deshabilitado, incluye un mensaje traducido.
   * @param {CalendarDay} day - El día del calendario.
   * @returns {string} Texto accesible para el día.
   */
  getDayAccessibilityLabel(day: CalendarDay): string {
    const formattedDate = day.date.format('DD/MM/YYYY');

    if (day.isDisabled) {
      // Usamos el servicio de traducción para el mensaje de día deshabilitado
      return this._translations.dayDisabled.replace(
        '{date}',
        formattedDate,
      );
    }
    // Si no está deshabilitado, solo mostramos la fecha formateada
    return formattedDate;
  }

  /**
   * Función para saber si algún día está seleccionado.
   * @returns {boolean} True si hay al menos un día seleccionado.
   */
  hasSelectedDays(): boolean {
    if (this.type === CalendarType.DAY) {
      return !!this.selectedDate();
    } else if (
      this.type === CalendarType.WEEK ||
      this.type === CalendarType.RANGE
    ) {
      return this.selectedRange().length > 0;
    }
    return false;
  }
}
