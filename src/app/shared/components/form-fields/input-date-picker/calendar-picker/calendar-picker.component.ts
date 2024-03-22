import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, WritableSignal, signal } from '@angular/core';
import { CalendarType, DEFAULT_FORMAT, DateSelected, ViewMode } from '../models/date-picker.entity';
import { CalendarService } from '../services/calendar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { A11yModule } from '@angular/cdk/a11y';
import moment from 'moment';

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
  encapsulation: ViewEncapsulation.None
})
export class CalendarPickerComponent implements OnInit {

  @Input() type: CalendarType = 'day'; // Tipo: Día (day), Semana (week) o Rango (range), para marcarlo de una forma u otra segúna una fecha
  @Output() dateSelected = new EventEmitter<DateSelected>();

  _defaultDate: WritableSignal<string> = signal(moment().format(DEFAULT_FORMAT)); // Por defecto, la fecha actual
  get defaultDate(): string {
    return this._defaultDate();
  }
  @Input() set defaultDate(value: string | moment.Moment) {
    this._defaultDate.set(this._calendarService.buildValidMomentDate(value));
    this.currentCalendar.set(this._defaultDate());
  }

  _startDate: WritableSignal<string> = signal(moment().format(DEFAULT_FORMAT)); // Por defecto, la fecha actual
  get startDate(): string {
    return this._startDate();
  }
  @Input() set startDate(value: string | moment.Moment) {
    this._startDate.set(this._calendarService.buildValidMomentDate(value));
    this.currentCalendar.set(this._startDate());
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
  allMonths: WritableSignal<string[]> = signal([]); // Array que se rellenará con todos los meses (usando momentjs)
  allYears: WritableSignal<string[]> = signal([]); // Array que se rellenará con los años, en un intervalo de 10 años hacia arriba o abajo

  // Array que guardará los días del mes por semana
  daysInMonth: WritableSignal<Array<any>> = signal([]);

  // Variable para saber en que calendario estamos cuándo nos movemos por los meses
  currentCalendar: WritableSignal<string> = signal(moment().format(DEFAULT_FORMAT));

  constructor(
    private readonly _calendarService: CalendarService,
  ) { }

  ngOnInit(): void {
    this.initCalendar();
  }

  /**
   * Función para inicializar el calendario
   */
  initCalendar() {
    setTimeout(() => {

      this.checkCurrentCalendarDate(this.currentCalendar());

      // Establecemos los meses del calendario
      this.allMonths.set(moment.months());
      this.setCalendar();
    });
  }

  /**
   * Función para establecer la "defaultDate" a hoy si no es válida
   * @param {string | moment.Moment} date
   */
  checkCurrentCalendarDate(date: string | moment.Moment) {

    // Comprobamos si la fecha es un string o un objeto Moment
    if (date instanceof moment)
      date = (date).format(DEFAULT_FORMAT);

    // Comprobamos si la fecha no es válida asignamos la fecha de hoy,
    // en caso contrario, asignamos la fecha indicada
    if (!moment(date).isValid())
      this._defaultDate.set(moment().format(DEFAULT_FORMAT));
    else
      this._defaultDate.set(moment(date).format(DEFAULT_FORMAT));

    this.currentCalendar.set(this._defaultDate());

  }

  /**
   * Función para construir el calendario según una fecha dada
   */
  setCalendar() {

    // Array que guardará los días del mes por semana
    const _daysInMonth: Array<any> = [];
    this.daysInMonth.set([]);

    // Obtenemos el primer día del mes seleccionado
    const firstDayOfMonth = moment(new Date(this.currentCalendar())).startOf('month');

    // Obtenemos el primer día de la semana del mes (por si compartimos días con el mes antarior)
    const dayFirstWeek = firstDayOfMonth.clone().startOf('isoWeek');

    // Recorremos cada semana y obtenemos los días de cada una de ellas hasta un máximo de 6 semanas
    // para que siempre se muestren 42 días (6 semanas * 7 días) e incluso si el mes no empieza en lunes
    // para que se muestren los primeros días del mes siguiente. De esta forma el calendario siempre estará completo
    for (let week = 0; week < 6; week++) {

      // Sumamos la cantidad de semanas con respescto al primer día del mes
      const firstDayOfWeek = dayFirstWeek.clone().add(week, 'week');

      // Recorremos los días (7) de la semana y formamos el objeto para la fecha
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        // Vamos sumando un día a partir del primer día de la semana
        const date = firstDayOfWeek.clone().add(dayOfWeek, 'day');
        _daysInMonth.push(date);
      }

    }

    // Asignamos el array de semanas a la signal
    this.daysInMonth.set(_daysInMonth);
  }

  /**
   * Función para comprobar si la fecha actual es igual al día pasado
   * @param {moment.Moment} date
   * @returns {boolean}
   */
  isCurrentMonth(date: moment.Moment): boolean {
    return date.month() === moment(new Date(this.currentCalendar())).month();
  }

  /**
   * Función para seleccionar un día, semana o rango de fechas
   * @param {moment.Moment} date
   * @param {Event} event
   */
  selectItem(date: moment.Moment, event: Event) {

    event.preventDefault();
    event.stopPropagation();

    // Si la fecha no es del mes actual, no hacemos nada
    if (!this.isCurrentMonth(date)) return;

    // Si el tipo es día, semana o rango, establecemos la fecha
    if (this.type === "day") {
      this.setDay(date);
    } else if (this.type === "week") {
      this.setWeekDate(date);
    } else if (this.type === "range") {
      this.setRangeDate(date);
    }
  }

  /**
   * Función para establecer el día seleccionado
   * @param {moment.Moment} date
   * @param {Event} event
   * @param {boolean} closePickerSelector
   */
  setDay(date: moment.Moment, event?: Event, closePickerSelector: boolean = true) {

    event?.preventDefault();
    event?.stopPropagation();

    this._defaultDate.set(date.format(DEFAULT_FORMAT));
    this.currentCalendar.set(date.format(DEFAULT_FORMAT));
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
      const rangeDate: string | string[] = this._startDate() !== '' && this._endDate() !== '' ? [this._startDate(), this._endDate()] : '';
      this.currentCalendar.set(moment(this._startDate()).format(DEFAULT_FORMAT));
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

    if (cleanDates && (this._startDate() !== '' && this._endDate() !== '')) {
      this._startDate.set('');
      this._endDate.set('');
    }

    if (this._startDate() === '') // Si no hay fecha de inicio, la establecemos
      this._startDate.set(date.format(DEFAULT_FORMAT));
    else if (this._endDate() === '' && date.isAfter(moment(this._startDate()))) // Si no hay fecha de fin, la establecemos
      this._endDate.set(date.format(DEFAULT_FORMAT));
    else if (moment(this._startDate()).format(DEFAULT_FORMAT) === date.format(DEFAULT_FORMAT)) { // Si la fecha de inicio es igual a la de fin, la establecemos
      this._startDate.set(date.format(DEFAULT_FORMAT));
      this._endDate.set(date.format(DEFAULT_FORMAT));
    } else if (moment(this._startDate()).isAfter(moment(date))) { // Si la fecha de inicio es mayor que la de fin, las intercambiamos
      const dateStart = moment(new Date(this._startDate()));
      this._startDate.set(date.format(DEFAULT_FORMAT));
      this._endDate.set(dateStart.format(DEFAULT_FORMAT));
    }

    // Si ya tenemos las dos fechas, emitimos el rango de fechas
    if (this._startDate() !== '' && this._endDate() !== '') {
      const rangeDate: string | string[] = this._startDate() !== '' && this._endDate() !== '' ? [this._startDate(), this._endDate()] : '';
      this.currentCalendar.set(moment(this._endDate()).format(DEFAULT_FORMAT));
      this.setCalendar();
      this.emitDateSelected(rangeDate, true);
    }

  }

  /**
   * Función para emitir el valor seleccionado
   * @param {string | string[]} date
   * @param {boolean} closePickerSelector
   */
  emitDateSelected(date: string | string[], closePickerSelector: boolean = true) {
    this.dateSelected.emit({
      date: date,
      closePicker: closePickerSelector
    });
  }

  /**
   * Función para comprobar si la fecha actual es igual al día pasado
   * @param {moment.Moment} day
   * @returns {boolean}
   */
  isSameSelectedDay(day: moment.Moment): boolean {
    if (this.type !== "day")
      return false;
    return (day.format('DD-MM-YYYY') === moment(new Date(this._defaultDate())).format('DD-MM-YYYY'));
  }

  /**
   * Función para comprobar si la fecha se encuentra en el rango de fechas
   * @param {moment.Moment} day
   * @returns {boolean}
   */
  isRangeDate(day: moment.Moment): boolean {
    if (this.type !== "week" && this.type !== "range")
      return false;
    return this._calendarService.isRangeDate(day, this._startDate(), this._endDate());
  }

  /**
   * Función para comprobar si la fecha es la actual
   * @param {moment.Moment} day
   * @returns {boolean}
   */
  isToday(day: moment.Moment): boolean {
    return this._calendarService.isToday(day);
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
    if (viewMode === "years")
      this.nextYears(moment(new Date(this.currentCalendar())).format('YYYY'));

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

    this.viewMode.set("default");
    this.currentCalendar.set(moment(new Date(this.currentCalendar())).set('month', month).format(DEFAULT_FORMAT));
    this.setCalendar();
  }

  /**
   * Función para cambiar al mes anterior
   */
  prevMonth() {
    this.currentCalendar.set(moment(new Date(this.currentCalendar())).subtract("1", "month").format(DEFAULT_FORMAT));
    this.setCalendar();
  }

  /**
   * Función para cambiar al mes siguiente
   */
  nextMonth() {
    this.currentCalendar.set(moment(new Date(this.currentCalendar())).add("1", "month").format(DEFAULT_FORMAT));
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

    this.viewMode.set("default");
    this.currentCalendar.set(moment(new Date(this._defaultDate())).set('year', Number(year)).format(DEFAULT_FORMAT));
    this.setCalendar();
  }

  /**
   * Función para cambiar al año anterior, lo que obtendrá los próximos 30 años con respescto al último del array de años
   * @param {string} lastYear
   */
  nextYears(lastYear: string = this.allYears()[this.allYears().length - 1]) {
    this.allYears.set(new Array(20).fill(null).map((_, year) => (moment(lastYear).add(year, 'year').format('YYYY'))));
    this.allYears().sort();
  }

  /**
  * Función para cambiar al año siguiente, lo que obtendrá los anteriores 30 años con respescto al último del array de años
  */
  prevYears() {
    this.allYears.set(new Array(20).fill(null).map((_, year) => (moment(this.allYears()[0]).subtract(year, 'year').format('YYYY'))));
    this.allYears().sort();
  }
}
