import { Injectable } from '@angular/core';
import { UtilsService } from '../../../../core/services/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class InputsUtilsService {

  constructor(
    private readonly _utilsService: UtilsService
  ) { }

  /**
   * Función para crear un ID único a partir del nombre, label u otro valor
   * @example 'Nombre del campo' => 'nombre_del_campo_1234567'
   * @param {string} name - Nombre o label del campo a convertir en labelId
   * @returns {string} - LabelId creado a partir del nombre o label del campo
   */
  createUniqueId(name: string): string {
    return `${this._utilsService.stringToSlug(name, '_')}_${(Math.floor(Math.random() * 999999))}`;
  }
}
