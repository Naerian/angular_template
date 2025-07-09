import { NeoUITranslations } from './translations.model';

export const NEOUI_DEFAULT_I18N: NeoUITranslations = {
  // Textos del componente Select
  multipleChoices: `{choices} opciones seleccionadas`,
  selectOption: 'Selecciona una opción',
  search: 'Buscar',

  // Textos del componente InputFile
  inputFileLabel: 'Seleccionar fichero',
  inputFileLabelMultiple: 'Seleccionar ficheros',

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

  // Textos de validadores de formularios de Angular
  validators: {
    required: 'Este campo es obligatorio.',
    requiredTrue: 'Debes marcar esta opción.',
    minlength: 'Introduce al menos {{requiredLength}} caracteres.',
    maxlength: 'No puedes introducir más de {{requiredLength}} caracteres.',
    min: 'El valor debe ser mayor o igual a {{min}}.',
    max: 'El valor debe ser menor o igual a {{max}}.',
    pattern: 'El formato no es válido.',
    email: 'Introduce un correo electrónico válido.',
    nullValidator: 'Este campo no es válido.',
  },
};
