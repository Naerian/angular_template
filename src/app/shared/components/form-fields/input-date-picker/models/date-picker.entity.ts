export interface DateSelected {
  date?: string | string[];
  closePicker?: boolean;
}

export const DEFAULT_FORMAT = 'YYYY-MM-DD';

export type ViewMode = 'years' | 'months' | 'default';
export type CalendarType = 'week' | 'day' | 'range';
export type DatePickerType = 'day' | 'week' | 'range';
