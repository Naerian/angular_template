export const DEFAULT_FORMAT = 'YYYY-MM-DD';

export enum CalendarViewMode {
  YEARS = 'years',
  MONTHS = 'months',
  DEFAULT = 'default',
}

export enum CalendarType {
  DAY = 'day',
  WEEK = 'week',
  RANGE = 'range',
}

export type ViewMode = CalendarViewMode | `${CalendarViewMode}`;
export type SelectionType = CalendarType | `${CalendarType}`;

export interface CalendarDay {
  date: moment.Moment; // Día concreto
  isCurrentMonth: boolean; // Si pertenece al mes visible
  isToday: boolean; // Si es hoy
  isSelected: boolean; // Si está seleccionado según tipo (día, rango, semana)
  isInRange: boolean; // Si está dentro del rango seleccionado
  isDisabled?: boolean; // Si está deshabilitado
}
