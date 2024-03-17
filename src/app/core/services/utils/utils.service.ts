import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * Función para comprobar si un `string` es un `JSON`
   * @example '{"test": "test"}' => true
   * @example 'test' => false
   * @param {string} string - `string` a comprobar si es un `JSON`
   * @returns {boolean} - `true` si es un `JSON`, `false` si no lo es
   */
  isJsonString(string: string): boolean {

    if (typeof string !== "string")
      return false;

    try {
      JSON.parse(string);
      return true;
    } catch (e) {
      return false;
    }

  }

  /**
   * Función para convertir un `string` en formato `slug`
   * @example 'hola test' => 'hola_test'
   * @param {string} str - `string` a convertir en `slug` (por defecto '')
   * @param {string} separator - Caracter para separar las palabras del `slug` (por defecto '-')
   * @returns {string} - `string` en formato `slug` separado por el `separator` indicado
   */
  stringToSlug(str: string = '', separator: string = '-'): string {

    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to = "aaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, separator) // collapse whitespace and replace by -
      .replace(/-+/g, separator); // collapse dashes

    return str;
  }

  /**
   * Función para separar el nombre de una columna en `CamelCase` a palabras separadas por espacios
   * @example 'holaTest' => 'hola Test'
   * @param {string} name - `string` a convertir en palabras separadas por espacios
   * @returns {string} - `string` con palabras separadas por espacios
   */
  splitCamelCase(name: string): string {
    return name.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  /**
   * Función para establecer un badge en formato span en HTML al texto indicado
   */
  setBadgeSpan(text: string, className: string): string {
    return `<span class="badge ${className}">${text}</span>`;
  }

}
