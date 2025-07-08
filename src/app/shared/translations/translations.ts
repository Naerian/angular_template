import { NarTranslations } from './translations.model';

export const NAR_DEFAULT_I18N: NarTranslations = {
  // Textos del componente Select
  multipleChoices: `{choices} opciones seleccionadas`,
  selectOption: 'Selecciona una opción',
  search: 'Buscar',

  // Textos del componente Calendar
  weekDaysShort: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'],
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  shortMonths: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
  prevMonth: 'Mes anterior',
  nextMonth: 'Mes siguiente',
  changeMonth: 'Cambiar mes',
  changeYear: 'Cambiar año',
  month: 'Mes',
  year: 'Año',
  back: 'Volver',
  dayDisabled: 'Deshabilitado: {date}',
  monthAria: 'Vista de meses',
  yearsAria: 'Vista de años',
};
