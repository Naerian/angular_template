import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { UtilsService } from '../utils/utils.service';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(
    private readonly _utilsService: UtilsService,
  ) { }

  /**
   * Función para añadir un elemento al `localStorage` según una KEY y un VALUE
   * @param {string} key
   * @param {any} value
   */
  setLocalStorageItem(key: string, value: any) {

    // Si es producción, encriptamos el valor y la key
    if (environment.production) {
      key = CryptoJS.AES.encrypt(key, environment.STORAGE.SECRET_KEY).toString();
      value = CryptoJS.AES.encrypt(value, environment.STORAGE.SECRET_KEY).toString();
    }

    localStorage.setItem(key, value);
  }

  /**
   * Función para obetener un elemento del `localStorage` según una KEY
   * @param {string} key
   * @returns {string}
   */
  getLocalStorageItem(key: string): string {

    // Si es producción, desencriptamos la key
    if (environment.production)
      key = CryptoJS.AES.decrypt(key, environment.STORAGE.SECRET_KEY).toString();

    const value = localStorage.getItem(key) || '';

    // Si es producción, desencriptamos el valor
    if (value && environment.production)
      return CryptoJS.AES.decrypt(value, environment.STORAGE.SECRET_KEY).toString(CryptoJS.enc.Utf8);

    return value;
  }

  /**
   * Función para obtener un elemento JSON parseado del `localStorage` según una KEY
   * @param {string} key
   * @returns {any}
   */
  getLocalStorageJsonParsed(key: string): any {
    const value = this.getLocalStorageItem(key);
    if (this._utilsService.isJsonString(value))
      return JSON.parse(value);

    return value;
  }

  /**
   * Función para limpiar un item del localStorage según una KEY
   * @param {string} key
   */
  clearItemStorage(key: string) {

    // Si es producción, desencriptamos la key
    if (environment.production)
      key = CryptoJS.AES.decrypt(key, environment.STORAGE.SECRET_KEY).toString();

    localStorage.removeItem(key);
  }

  /**
   * Función para limpiar el localStorage
   */
  clearLocalStorage() {
    localStorage.clear();
  }
}
