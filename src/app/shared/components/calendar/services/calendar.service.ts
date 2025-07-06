import { Injectable } from '@angular/core';
import moment from 'moment';
import { DEFAULT_FORMAT } from '../models/calendar.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  /**
   * Convierte un valor en un objeto Moment válido o devuelve null si no es posible
   * @param {Date | string | null} value
   * @returns {moment.Moment | null}
   */
  convertToMoment(value: Date | string | null): moment.Moment | null {
    // Si el valor es null o undefined, devolvemos null
    if (value === null || value === undefined) return null;

    // Si el valor ya es un objeto Moment válido, lo clonamos y devolvemos
    if (moment.isMoment(value)) return value.isValid() ? value.clone() : null;

    // Si el valor es una instancia de Date, lo convertimos a Moment
    if (value instanceof Date) {
      const m = moment(value);
      return m.isValid() ? m : null;
    }

    // Si el valor es una cadena, intentamos parsearlo con el formato por defecto
    if (typeof value === 'string') {
      // Aquí asumimos el formato por defecto, cambiar si usas uno específico.
      // El 'true' en el tercer argumento de moment es para hacer un parseo estricto.
      const m = moment(value, DEFAULT_FORMAT, true);
      return m.isValid() ? m : null;
    }

    return null;
  }

  /**
   * Función para comprobar si la fecha se encuentra en el rango de fechas
   * @param {moment.Moment} date - Fecha a comprobar
   * @param {string[] | moment.Moment[]} range - Rango de fechas
   * @returns {boolean}
   */
  isRangeDate(date: moment.Moment, range: string[] | moment.Moment[]): boolean {
    if (!Array.isArray(range) || range.length === 0) return false;

    // Si solo hay una fecha en el rango, la fecha está "en rango" si es el mismo día
    if (range.length === 1) {
      const singleDate = moment(range[0]);
      return date.isSame(singleDate, 'day');
    }

    // Si hay dos o más fechas, es un rango propiamente dicho
    const startDate = moment(range[0]);
    const endDate = moment(range[range.length - 1]);

    // Comprobamos si la fecha está dentro del rango (inclusive de inicio y fin)
    return date.isBetween(startDate, endDate, 'day', '[]');
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
   * Función para obtener un array de fechas entre dos fechas dadas
   * @param {moment.Moment} start - Fecha de inicio
   * @param {moment.Moment} end - Fecha de fin
   * @returns {moment.Moment[]} - Array de fechas
   */
  getDatesBetween(start: moment.Moment, end: moment.Moment): moment.Moment[] {
    const dates: moment.Moment[] = [];
    let currentDate = start.clone();

    // Aseguramos que el final no sea anterior al inicio
    const finalEnd = end.isBefore(start, 'day') ? start.clone() : end.clone();

    while (currentDate.isSameOrBefore(finalEnd, 'day')) {
      dates.push(currentDate.clone());
      currentDate.add(1, 'day');
    }

    return dates;
  }
}
