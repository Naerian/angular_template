import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@environments/environment';
import { LocalService } from '../storage/local.service';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  public jwtHelperService: JwtHelperService = new JwtHelperService();

  constructor(private readonly _localService: LocalService) { }

  /**
   * Función para establecer el token del usuario en el `localStorage`
   * @param {string} token
   */
  setUserToken(token: string) {
    this._localService.setLocalStorageItem(
      environment.TOKEN_STORAGE_KEY,
      token
    );
  }

  /**
   * Función para obtener el usuario almacenado en el token
   * @returns {any} // TODO: Definir el tipo de retorno
   */
  getUserToken(): any {
    if (this.getToken()) {
      const decodeToken = this.jwtHelperService.decodeToken(this.getToken());
      return decodeToken['uem_token'];
    } else {
      return null;
    }
  }

  /**
   * Función para obtener el token que hay actualmente almacenado en el navegador
   * @returns {string}
   */
  getToken(): string {
    const accessToken = this._localService.getLocalStorageJsonParsed(environment.TOKEN_STORAGE_KEY);
    return accessToken !== null ? accessToken : '';
  }

  /**
   * Función para obtener la fecha de expiración del token
   * @param {string} token
   * @returns {Date}
   */
  getTokenExpirationDate(token: string): Date {
    const decoded = this.decodeToken(token);

    if (decoded && decoded.exp === undefined) return new Date();

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  /**
   * Función para decodificar el token JWT del usuario
   * @param {string} token
   * @returns {any}
   */
  decodeToken(token: string): any {

    if (this.isAToken(token))
      return this.jwtHelperService.decodeToken(token);

    return null;
  }

  /**
   * Función para comprobar si una cadena de texto es un token JWT válido
   * @param {string} token
   * @returns {boolean}
   */
  isAToken(token: string): boolean {
    var pattern = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
    if (!pattern.test(token))
      return false;

    return true;
  }

  /**
   * Función para comprobar si un token JWT ha expirado
   * @param {string} token
   * @returns {boolean}
   */
  isTokenExpired(token?: string): boolean {

    if (!token) token = this.getToken();
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }
}
