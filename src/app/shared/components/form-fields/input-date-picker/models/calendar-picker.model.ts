export interface DateSelected {
  date: string | string[];
  closePicker?: boolean;
}

export const DEFAULT_FORMAT = 'YYYY-MM-DD';

export type ViewMode = 'years' | 'months' | 'default';
export type CalendarType = 'week' | 'day' | 'range';
export type DatePickerType = 'day' | 'week' | 'range';

export interface CalendarDay {
  date: moment.Moment; // Día concreto
  isCurrentMonth: boolean; // Si pertenece al mes visible
  isToday: boolean; // Si es hoy
  isSelected: boolean; // Si está seleccionado según tipo (día, rango, semana)
  isInRange: boolean; // Si está dentro del rango seleccionado
  isDisabled?: boolean; // Si está deshabilitado
}

export const WEEK_DAYS: string[] = [
  'CALENDAR.SHORT.MONDAY',
  'CALENDAR.SHORT.TUESDAY',
  'CALENDAR.SHORT.WEDNESDAY',
  'CALENDAR.SHORT.THURSDAY',
  'CALENDAR.SHORT.FRIDAY',
  'CALENDAR.SHORT.SATURDAY',
  'CALENDAR.SHORT.SUNDAY',
];
