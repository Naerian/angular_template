/**
 * Type de los diferentes validadores nativos de Angular.
 */
export type AngularNativeValidator =
  | 'required'
  | 'requiredTrue'
  | 'minlength'
  | 'maxlength'
  | 'min'
  | 'max'
  | 'pattern'
  | 'email'
  | 'nullValidator';

/**
 * Interfaz para las traducciones de la librería
 */
export interface NeoUITranslations {
  // Textos del componente Select
  multipleChoices: string;
  selectOption: string;
  selectOptions: string;
  search: string;
  noResults: string;

  // Textos del componente InputFile
  inputFileLabel: string;
  inputFileLabelMultiple: string;

  // Texto del componete InputPassword
  showPassword: string;
  hidePassword?: string;

  // Texto del componente InputNumber
  incrementBtn: string;
  decrementBtn: string;

  // Textos generales de los campos de formulario
  clearButton: string;

  // Textos del componente Calendar
  weekDaysShort: string[];
  selectDay: string;
  months: string[];
  shortMonths: string[];
  prevMonth: string;
  nextMonth: string;
  changeMonth: string;
  changeYear: string;
  month: string;
  year: string;
  back: string;
  dayDisabled: string;
  monthAria: string;
  yearsAria: string;
  openCalendar: string;

  // Textos de validadores de formularios de Angular
  validators: {
    required: string;
    requiredTrue: string;
    minlength: string;
    maxlength: string;
    min: string;
    max: string;
    pattern: string;
    email: string;
    nullValidator: string;
  };
}
