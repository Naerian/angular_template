import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationsService {
  /**
   * Función para validar si un campo coincide con otro dentro de un formulario `FormControl`
   * @param {string} field
   * @example field => 'password' (Campo con el que quieres comparar)
   * @returns {ValidatorFn}
   */
  static matchValidator(field: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (control?.parent) {
        const controlValue = control.value;
        const group = control.parent;
        const fieldMatchedValue = group.get(field)?.value;

        if (controlValue === fieldMatchedValue) return null;

        return { invalidMatch: true };
      }
      return null;
    };
  }

  /**
   * Función para validar si un campo fecha es inferior a otro
   * @param {string} field
   * @example field => 'end_date' (Campo con el que quieres comparar)
   * @returns {ValidatorFn}
   */
  static lessThanDateValidator(field: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (control?.parent) {
        const controlValue = control.value;
        const group = control.parent;
        const fieldMatchedValue = group.get(field)?.value;

        if (controlValue.length > 0 && fieldMatchedValue.length > 0) {
          const controlValueDate = new Date(control.value);
          const fieldMatchedValueDate = new Date(group.get(field)?.value);

          if (controlValueDate.getTime() > fieldMatchedValueDate.getTime())
            return null;

          return { dateLessThanField: true, initDate: fieldMatchedValue };
        }

        return null;
      }
      return null;
    };
  }

  /**
   * Función para validar si un campo fecha es inferior a otro con X años de diferencia
   * @param {string} field
   * @param {number} yearsDiff
   * @example field => 'end_date' (Campo con el que quieres comparar)
   * @returns {ValidatorFn}
   */
  static lessThanDateYearValidator(field: string, yearsDiff = 1): ValidatorFn {
    return (control: AbstractControl) => {
      if (control?.parent) {
        const controlValue = control.value;
        const group = control.parent;
        const fieldMatchedValue = group.get(field)?.value;

        if (controlValue.length > 0 && fieldMatchedValue.length > 0) {
          const controlValueDate = new Date(control.value);
          const fieldMatchedValueDate = new Date(group.get(field)?.value);

          let diff =
            (controlValueDate.getTime() - fieldMatchedValueDate.getTime()) /
            1000;
          diff /= 60 * 60 * 24;
          const yearsDiffBetweenDates = Math.abs(
            Math.round((diff / 365.25) * 10) / 10,
          );

          if (yearsDiffBetweenDates >= yearsDiff) return null;

          return { lessThanDateYear: true, requiredValue: yearsDiff };
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
  static minLengthArray(min: number): ValidatorFn | null {
    return (control: AbstractControl) => {
      if (control?.value?.length >= min) return null;
      return { invalidMinLengthArray: true };
    };
  }
}
