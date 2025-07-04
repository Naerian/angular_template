import { Injectable } from '@angular/core';
import moment from 'moment';
import { DEFAULT_FORMAT } from '../models/calendar-picker.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor() {}

  /**
   * Función para obtener las semanas de un mes en base a una fecha
   * @param {string} date
   * @returns {number}
   */
  weeksOfMonth(date: string): number {
    const input = moment(new Date(date));

    const startMonth = input.clone().startOf('month');
    const startWeek = startMonth.clone().startOf('isoWeek');
    const startOffset = startMonth.diff(startWeek, 'days');

    const endMonth = input.clone().endOf('month');
    const endWeek = endMonth.clone().endOf('isoWeek');
    const endOffset = endWeek.diff(endMonth, 'days');

    return Math.ceil(
      (endMonth.diff(startMonth, 'days') + startOffset + endOffset) / 7,
    );
  }

  /**
   * Función para devolver la fecha en tipo "momentjs" según el tipo de valor que venga
   * @param {any} value
   * @returns
   */
  buildValidMomentDate(value: any) {
    switch (true) {
      case value instanceof Date && moment(value).isValid(): // Es de tipo "Date" y se comprueba si es válida
        return moment(value);
      case typeof value === 'string' && moment(new Date(value)).isValid(): // Es de tipo "string" y se comprueba que sea fecha
        return moment(new Date(value));
      case (moment.isMoment(value) || typeof value === 'object') &&
        value?.isValid(): // Es de tipo "momentjs"
        return value;
      default:
        return '';
    }
  }

  /**
   * Función para comprobar si la fecha se encuentra en el rango de fechas
   * @param {moment.Moment | string} day
   * @param {moment.Moment | string} startDate
   * @param {moment.Moment | string} endDate
   * @returns {boolean}
   */
  isRangeDate(
    day: moment.Moment | string,
    startDate: moment.Moment | string,
    endDate: moment.Moment | string,
  ): boolean {
    const dateStart = moment(startDate);
    const dateEnd = moment(endDate);
    return moment(day).format('DD-MM-YYYY') ===
      dateStart.format('DD-MM-YYYY') ||
      moment(day).format('DD-MM-YYYY') === dateEnd.format('DD-MM-YYYY') ||
      moment(day).isBetween(dateStart, dateEnd)
      ? true
      : false;
  }

  /**
   * Función para comprobar si la fecha es hoy
   * @param {moment.Moment | string} day
   * @returns {boolean}
   */
  isToday(day: moment.Moment | string): boolean {
    return moment(day).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')
      ? true
      : false;
  }

  /**
   * Función para obtener un array de fechas entre dos fechas
   * @param {string} startDate - Fecha de inicio en formato 'YYYY-MM-DD'
   * @param {string} endDate - Fecha de fin en formato 'YYYY-MM-DD
   * @returns {string[]} - Array de fechas en formato 'YYYY-MM-DD'
   */
  getDatesBetween(startDate: string, endDate: string): string[] {
    const start = moment(startDate, DEFAULT_FORMAT);
    const end = moment(endDate, DEFAULT_FORMAT);
    const dates = [];

    for (let m = start.clone(); m.isSameOrBefore(end, 'day'); m.add(1, 'day')) {
      dates.push(m.format(DEFAULT_FORMAT));
    }

    return dates;
  }
}
