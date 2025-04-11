/**
 * Este fichero utils contiene validators personalizados para formularios reactivos de Angular
 */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isAfter, isBefore } from 'date-fns';
import { formatDefaultDate, parseAnyDate } from './date.utils';

/**
 * Función para validar si un campo coincide con otro dentro de un formulario `FormControl`
 * @param {string} field
 * @example field => 'password' (Campo con el que quieres comparar)
 * @returns {ValidatorFn}
 */
export function matchValidator(field: string): ValidatorFn {
  return (control: AbstractControl) => {
    if (control?.parent) {
      const controlValue = control.value;
      const group = control.parent;
      const fieldMatchedValue = group.get(field)?.value;

      if (controlValue === fieldMatchedValue) return null;

      return {
        matchField: {
          fieldMatched: field,
        },
      };
    }
    return null;
  };
}

/**
 * Validador que verifica si la fecha de un campo es anterior a la fecha de otro campo.
 * @param {string} field
 * @example field => 'end_date' (Campo con el que quieres comparar)
 * @returns {ValidatorFn}
 */
export function isBeforeDateValidator(field: string): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control?.parent) return null;

    const controlValue = control.value;
    const fieldMatchedValue = control.parent.get(field)?.value;

    if (!controlValue || !fieldMatchedValue) return null;

    // Convertir valores a Date si no lo son
    const parsedControlValue = parseAnyDate(controlValue) as Date;
    const parsedFieldMatchedValue = parseAnyDate(fieldMatchedValue) as Date;

    // Validar que sean fechas válidas
    if (
      isNaN(parsedControlValue.getTime()) ||
      isNaN(parsedFieldMatchedValue.getTime())
    ) {
      return {
        invalidDate: {
          value: controlValue,
        },
      };
    }

    // Validar si la fecha del campo actual es anterior a la del campo a comparar
    return isBefore(parsedControlValue, parsedFieldMatchedValue)
      ? null
      : {
          isBeforeDate: {
            date: formatDefaultDate(fieldMatchedValue),
            fieldMatched: field,
          },
        };
  };
}

/**
 * Validador que verifica si la fecha de un campo es posterior a la fecha de otro campo.
 * @param {string} field Nombre del campo con el que se debe comparar.
 * @example field => 'start_date' (Campo con el que quieres comparar)
 * @returns {ValidatorFn}
 */
export function isAfterDateValidator(field: string): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control?.parent) return null;

    const controlValue = control.value;
    const fieldMatchedValue = control.parent.get(field)?.value;

    if (!controlValue || !fieldMatchedValue) return null;

    // Convertir valores a Date si no lo son
    const parsedControlValue = parseAnyDate(controlValue) as Date;
    const parsedFieldMatchedValue = parseAnyDate(fieldMatchedValue) as Date;

    // Validar que sean fechas válidas
    if (
      isNaN(parsedControlValue.getTime()) ||
      isNaN(parsedFieldMatchedValue.getTime())
    ) {
      return {
        invalidDate: {
          value: controlValue,
        },
      };
    }

    // Validar si la fecha del campo actual es posterior a la del campo a comparar
    return isAfter(parsedControlValue, parsedFieldMatchedValue)
      ? null
      : {
          isAfterDate: {
            date: formatDefaultDate(fieldMatchedValue),
            fieldMatched: field,
          },
        };
  };
}

/**
 * Función para validar si un campo fecha es inferior a otro con X años de diferencia
 * @param {string} field
 * @param {number} yearsDiff
 * @example field => 'end_date' (Campo con el que quieres comparar)
 * @returns {ValidatorFn}
 */
export function yearsDifferenceValidator(
  field: string,
  yearsDiff = 1,
): ValidatorFn {
  return (control: AbstractControl) => {
    if (control?.parent) {
      const controlValue = control.value;
      const group = control.parent;
      const fieldMatchedValue = group.get(field)?.value;

      if (controlValue.length > 0 && fieldMatchedValue.length > 0) {
        const controlValueDate = new Date(control.value);
        const fieldMatchedValueDate = new Date(group.get(field)?.value);

        let diff =
          (controlValueDate.getTime() - fieldMatchedValueDate.getTime()) / 1000;
        diff /= 60 * 60 * 24;
        const yearsDiffBetweenDates = Math.abs(
          Math.round((diff / 365.25) * 10) / 10,
        );

        if (yearsDiffBetweenDates >= yearsDiff) return null;

        return {
          yearsDifference: {
            diff: yearsDiff,
          },
        };
      }

      return null;
    }
    return null;
  };
}

/**
 * Función para comprobar que mínimo tenga un valor en el array
 * cuando se trata de un campo de tipo array
 * @param {number} min
 * @returns {ValidatorFn | null}
 */
export function minLengthArray(min: number): ValidatorFn | null {
  return (control: AbstractControl) => {
    if (control?.value?.length >= min) return null;
    return {
      invalidMinLengthArray: {
        min: min,
      },
    };
  };
}

/**
 * Función para comprobar que un campo sea requerido pero que admita el valor 0 como válido,
 * Muy útil para campos numéricos donde 0 es un valor válido.
 * @returns {ValidatorFn | null}
 */
export function requiredWithZero(): ValidatorFn | null {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value !== null &&
      control.value !== undefined &&
      control.value !== ''
      ? null
      : { required: true };
  };
}

/**
 * Validador para comprobar si una fecha es mayor o igual (opcional) a otra
 * @param {string} startDateField
 * @param {string} endDateField
 * @param {boolean} allowEqualDates
 * @returns {ValidatorFn | null}
 */
export function dateRangeValidator(
  startDateField: string,
  endDateField: string,
  allowEqualDates = false,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startDateControl = group.get(startDateField);
    const endDateControl = group.get(endDateField);

    if (!startDateControl || !endDateControl) return null; // Si los controles no existen, no validamos

    const startDate = startDateControl.value
      ? parseAnyDate(startDateControl.value)
      : null;
    const endDate = endDateControl.value
      ? parseAnyDate(endDateControl.value)
      : null;

    let errors: ValidationErrors = {};

    // Validamos las fechas
    if (startDate && isNaN(startDate.getTime())) {
      errors = { ...errors, startDateInvalid: true };
    } else if (endDate && isNaN(endDate.getTime())) {
      errors = { ...errors, endDateInvalid: true };
    }

    // Si hay errores de fechas inválidas, los aplicamos a los controles
    if (errors['startDateInvalid'] || errors['endDateInvalid']) {
      if (errors['startDateInvalid']) {
        startDateControl.setErrors({
          invalidDate: {
            value: startDateControl.value,
          },
        });
      } else {
        endDateControl.setErrors({
          invalidDate: {
            value: endDateControl.value,
          },
        });
      }
      return null;
    }

    // Validación de rango de fechas
    if (
      startDate &&
      endDate &&
      !isNaN(startDate.getTime()) &&
      !isNaN(endDate.getTime())
    ) {
      if (
        startDate > endDate ||
        (!allowEqualDates && startDate.getTime() === endDate.getTime())
      ) {
        errors[startDateField] = {
          message: 'startDateRangeInvalid',
          startDate,
          endDate,
          formattedStartDate: formatDefaultDate(startDate),
        };
        errors[endDateField] = {
          message: 'endDateRangeInvalid',
          startDate,
          endDate,
          formattedEndDate: formatDefaultDate(endDate),
        };
      }
    }

    // Devolvemos los errores al grupo de controles
    return Object.keys(errors).length ? errors : null;
  };
}

/**
 * Función para validar que dos campos numéricos no sean iguales o que el campo "desde" sea menor al campo "hasta"
 * @param {string} fieldFrom
 * @param {string} fieldTo
 * @returns {ValidatorFn | null}
 */
export function numericRangeValidator(
  fieldFrom: string,
  fieldTo: string,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fromControl = group.get(fieldFrom);
    const toControl = group.get(fieldTo);

    if (!fromControl || !toControl) return null;

    const fromValue = fromControl.value;
    const toValue = toControl.value;

    const errors: ValidationErrors = {};

    // Validación de rango numérico
    if (
      fromValue != null &&
      toValue != null &&
      fromValue !== '' &&
      toValue !== ''
    ) {
      if (Number(fromValue) > Number(toValue)) {
        errors[fieldFrom] = {
          message: 'startNumericRangeInvalid',
          fromValue,
          toValue,
        };
        errors[fieldTo] = {
          message: 'endNumericRangeInvalid',
          fromValue,
          toValue,
        };
      }
    }

    // Si no hay errores, retornamos null
    return Object.keys(errors).length ? errors : null;
  };
}

/**
 * Función para validar que un campo sea alfabético y que "desde" sea menor a "hasta"
 * @param {string} fieldDesde
 * @param {string} fieldHasta
 * @returns {ValidatorFn | null}
 */
export function alphabeticalRangeValidator(
  fieldDesde: string,
  fieldHasta: string,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fromControl = group.get(fieldDesde);
    const toControl = group.get(fieldHasta);

    if (!fromControl || !toControl) return null;

    const fromValue = fromControl.value?.trim();
    const toValue = toControl.value?.trim();

    const errors: ValidationErrors = {};

    if (fromValue && toValue && fromValue !== '' && toValue !== '') {
      if (fromValue.localeCompare(toValue, 'es', { sensitivity: 'base' }) > 0) {
        errors[fieldDesde] = {
          message: 'alphabeticalRangeFromInvalid',
          value: fromValue,
          to: toValue,
        };
        errors[fieldHasta] = {
          message: 'alphabeticalRangeToInvalid',
          value: toValue,
          from: fromValue,
        };
      }
    }

    return Object.keys(errors).length ? errors : null;
  };
}

/**
 * Función para validar que un campo sea alfanumérico y que "desde" sea menor a "hasta"
 * @param {string} fieldDesde
 * @param {string} fieldHasta
 * @returns {ValidatorFn | null}
 */
export function alphanumericRangeValidator(
  fieldDesde: string,
  fieldHasta: string,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fromControl = group.get(fieldDesde);
    const toControl = group.get(fieldHasta);

    if (!fromControl || !toControl) return null;

    const fromValue = fromControl.value?.trim();
    const toValue = toControl.value?.trim();

    const errors: ValidationErrors = {};

    if (fromValue && toValue && fromValue !== '' && toValue !== '') {
      if (
        fromValue.localeCompare(toValue, 'es', {
          numeric: true,
          sensitivity: 'base',
        }) > 0
      ) {
        errors[fieldDesde] = {
          message: 'alphanumericRangeFromInvalid',
          value: fromValue,
          to: toValue,
        };
        errors[fieldHasta] = {
          message: 'alphanumericRangeToInvalid',
          value: toValue,
          from: fromValue,
        };
      }
    }

    return Object.keys(errors).length ? errors : null;
  };
}
