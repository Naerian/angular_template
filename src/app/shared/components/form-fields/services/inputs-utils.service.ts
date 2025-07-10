import { Injectable } from '@angular/core';
import { UtilsService } from '../../../../core/services/utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class InputsUtilsService {
  private counter = 0;

  constructor(private readonly _utilsService: UtilsService) {}

  /**
   * Función para crear un ID único a partir del nombre, label u otro valor
   * @example 'Nombre del campo' => 'nombre_del_campo_1234567'
   * @param {string} name - Nombre o label del campo a convertir en labelId
   * @returns {string} - LabelId creado a partir del nombre o label del campo
   */
  createUniqueId(name?: string): string {
    return `${this._utilsService.stringToSlug(name, '_')}_${this.counter}_${crypto.randomUUID()}`;
  }

  /**
   * Función para crear un aria-describedby personalizado
   * y generar un ID único para el aria-describedby.
   * @param {string} id - ID del campo para el que se quiere crear el
   * @returns {string} - Aria-describedby personalizado
   */
  getAriaDescribedByCustom(id: string): string {
    if (!id) return '';
    const ids = [`${id}-hint`, `${id}-error`];
    return ids.join(' ');
  }
}
