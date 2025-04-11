import {
  compareAsc,
  format,
  isAfter,
  isSameDay,
  isValid,
  parse,
} from 'date-fns';
import { de, enUS, es, fr } from 'date-fns/locale';

// Constantes de formato
const DATE_FORMAT = 'yyyy/MM/dd';
const DEFAULT_FORMAT_DATE = 'dd/MM/yyyy';

/**
 * Función para obtener la fecha actual en un formato específico.
 * @param {string} formatStr - Formato de la fecha. Por defecto 'yyyy/MM/dd'.
 * @returns {string} - Fecha actual formateada.
 */
export function getToday(formatStr: string = DATE_FORMAT): string {
  return toFormattedDate(new Date(), formatStr);
}

/**
 * Función para formatear una fecha.
 * @param {Date} date - Fecha a formatear.
 * @param {string} formatStr - Formato deseado. Por defecto 'yyyy/MM/dd'.
 * @returns {string} - Fecha formateada.
 */
export function toFormattedDate(
  date: Date | string,
  formatStr: string = DATE_FORMAT,
): string {
  const dateParsed = parseAnyDate(date);
  if (!dateParsed) return '';
  return format(dateParsed, formatStr);
}

/**
 * Función para formatear una fecha a formato ISO en UTC.
 * @param {Date} date - Fecha a formatear.
 * @returns {string} - Fecha formateada en formato ISO.
 */
export function formatISODate(date: Date | string): string {
  const dateParsed = parseAnyDate(date);
  if (!dateParsed) return '';
  return new Date(toFormattedDate(dateParsed, 'yyyy-MM-dd')).toISOString();
}

/**
 * Función para formatear una fecha de la API a 'dd/MM/yyyy'.
 * @param {Date} date - Fecha a formatear.
 * @returns {string} - Fecha formateada.
 */
export function formatDefaultDate(date: Date | string): string {
  const dateParsed = parseAnyDate(date);
  if (!dateParsed) return '';
  return format(dateParsed, DEFAULT_FORMAT_DATE);
}

/***
 * Función para obtener el nombre de un mes en base a su número (0-11).
 */
export function getMonthName(monthNumber: number, isShort = false): string {
  if (monthNumber < 0 || monthNumber > 11) return '-';

  const formatMonth = isShort ? 'MMM' : 'MMMM';
  const date = new Date(2022, monthNumber, 1); // Año y día arbitrario
  const month = format(date, formatMonth, { locale: es });
  return month.charAt(0).toUpperCase() + month.slice(1);
}

/**
 * Compara dos fechas y devuelve la diferencia.
 * @param {Date} date1 - Primera fecha a comparar.
 * @param {Date} date2 - Segunda fecha a comparar.
 * @returns {number} - '0' si son iguales, '1' si date1 es mayor, '-1' si date2 es mayor.
 */
export function compareDates(date1: Date, date2: Date): number {
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);

  return compareAsc(date1, date2);
}

/**
 * Función para comprobar si la fecha pasada por parámetro es superior a la fecha actual.
 * @param {Date} date - Fecha a comparar.
 * @returns {boolean} - `true` si la fecha es superior a la actual, `false` en caso contrario.
 */
export function isFutureDate(date: Date): boolean {
  const today = new Date();
  return isAfter(date, today);
}

/**
 * Función para comprobar si la fecha pasada por parámetro es igual a la fecha actual.
 * @param {Date} date - Fecha a comparar.
 * @returns {boolean} - `true` si la fecha es igual a la actual, `false` en caso contrario.
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return isSameDay(date, today);
}

/**
 * Función para parsear una fecha en prácticamente cualquier formato y obtener un objeto Date válido.
 * @param {string | Date} date
 * @returns {Date | null}
 */
export function parseAnyDate(date: string | Date): Date | null {
  if (!date) return null;
  if (date instanceof Date && !isNaN(date.getTime())) return date; // Si ya es un Date válido

  // Si es de tipo Date la convertimos a string
  if (date instanceof Date) date = date.toString();

  // Parseamos la fecha con diferentes idiomas y formatos
  return parseWithLocales(date);
}

/**
 * Función para parsear una fecha con diferentes idiomas.
 * @param {string} date
 * @returns {Date | null}
 */
function parseWithLocales(date: string): Date | null {
  const locales = [es, enUS, fr, de]; // Puedes agregar más locales aquí según sea necesario

  // Intentamos parsear con diferentes locales
  for (const locale of locales) {
    const parsedDate = parseWithLocale(date, locale);
    if (parsedDate) return parsedDate;
  }

  return null;
}

/**
 * Función para parsear una fecha con un idioma específico.
 * @param {string} date
 * @param {any} locale
 * @returns {Date | null}
 */
function parseWithLocale(date: string, locale: any): Date | null {
  const format = determineDateFormat(date);
  if (!format) return null;
  const parsedDate = parse(date, format, new Date(), { locale });
  return isValid(parsedDate) ? parsedDate : null;
}

/**
 * Función para determinar el formato de una fecha.
 * @param {string} date
 * @returns {string | null}
 */
function determineDateFormat(date: string): string | null {
  // Definimos los posibles formatos de fecha y sus expresiones regulares
  const dateFormats = [
    { regex: /^\d{2}-\d{2}-\d{4}$/, format: 'dd-MM-yyyy' }, // Ej: 25-12-2024
    { regex: /^\d{4}-\d{2}-\d{2}$/, format: 'yyyy-MM-dd' }, // Ej: 2024-12-25
    { regex: /^\d{2}\/\d{2}\/\d{4}$/, format: 'dd/MM/yyyy' }, // Ej: 25/12/2024
    { regex: /^\d{4}\/\d{2}\/\d{2}$/, format: 'yyyy/MM/dd' }, // Ej: 2024/12/25
    { regex: /^(\d{1,2})-(\w+)-(\d{4})$/, format: 'dd-MMM-yyyy' }, // Ej: 25-Dec-2024
    { regex: /^(\w+)-(\d{1,2})-(\d{4})$/, format: 'MMM-dd-yyyy' }, // Ej: Dec-25-2024
    { regex: /^(\d{1,2})\/(\w+)\/(\d{4})$/, format: 'dd/MMM/yyyy' }, // Ej: 25/Dec/2024
    { regex: /^(\w+)\/(\d{1,2})\/(\d{4})$/, format: 'MMM/dd/yyyy' }, // Ej: Dec/25/2024
    { regex: /^(\w+) (\d{1,2}) (\d{4})$/, format: 'MMM dd yyyy' }, // Ej: Dec 25 2024
    { regex: /^(\d{4}) (\d{1,2}) (\w+)$/, format: 'yyyy MMM dd' }, // Ej: 2024 25 Dec
    { regex: /^(\d{1,2}) (\w+), (\d{4})$/, format: 'dd MMM, yyyy' }, // Ej: 25 Dec, 2024
    { regex: /^(\w+) (\d{1,2}), (\d{4})$/, format: 'MMM dd, yyyy' }, // Ej: Dec 25, 2024
    { regex: /^\d{1,2}-[A-Za-z]{3}-\d{4}$/, format: 'd-MMM-yyyy' }, // Ej: 25-Dec-2024
    {
      regex: /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/,
      format: 'yyyy/MM/dd HH:mm:ss',
    }, // Ej: 2024/12/25 12:00:00
    {
      regex: /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/,
      format: 'MM/dd/yyyy HH:mm:ss',
    }, // Ej: 25/12/2024 12:00:00
    { regex: /^\d{2}\.\d{2}\.\d{4}$/, format: 'dd.MM.yyyy' }, // Ej: 25.12.2024
    { regex: /^\d{4}\.\d{2}\.\d{2}$/, format: 'yyyy.MM.dd' }, // Ej: 2024.12.25
    { regex: /^\d{4}-\d{2}-\d{2}$/, format: 'yyyy-dd-MM' }, // Ej: 2024-25-12
    { regex: /^\d{1,2}-\d{1,2}-\d{4}$/, format: 'd-M-yyyy' }, // Ej: 25-12-2024
    { regex: /^\d{2}\.\d{2}\.\d{4}$/, format: 'MM.dd.yyyy' }, // Ej: 25.12.2024
    {
      regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
      format: "yyyy-MM-dd'T'HH:mm:ss",
    }, // Ej: 2020-01-30T00:00:00 (ISO 8601)
    {
      regex: /^\d{4}\/\d{2}\/\d{2}T\d{2}:\d{2}:\d{2}$/,
      format: "yyyy/MM/dd'T'HH:mm:ss",
    }, // Ej: 2020/01/30T00:00:00
    {
      regex: /^\d{4}\.\d{2}\.\d{2}T\d{2}:\d{2}:\d{2}$/,
      format: "yyyy.MM.dd'T'HH:mm:ss",
    }, // Ej: 2020/01/30T00:00:00
    {
      regex: /^\d{2}\/\d{2}\/\d{4}T\d{2}:\d{2}:\d{2}$/,
      format: "dd/MM/yyyy'T'HH:mm:ss",
    }, // Ej: 30/01/2020T00:00:00
    {
      regex: /^\d{2}-\d{2}-\d{4}T\d{2}:\d{2}:\d{2}$/,
      format: "dd-MM-yyyy'T'HH:mm:ss",
    }, // Ej: 30-01-2020T00:00:00
    {
      regex: /^\d{2}\.\d{2}\.\d{4}T\d{2}:\d{2}:\d{2}$/,
      format: "dd.MM.yyyy'T'HH:mm:ss",
    }, // Ej: 30.01.2020T00:00:00
  ];

  // Iteramos sobre los formatos posibles y comprobar si el patrón coincide
  for (const { regex, format } of dateFormats) {
    if (regex.test(date)) return format;
  }

  return null;
}
