import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../jwt/jwt.service';
import { LocalService } from '../storage/local.service';
import { AuthUserEntity, LoginAuthUserEntity } from '@entities/auth.entity';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _authUser: WritableSignal<AuthUserEntity | null> = signal(null);
  private _isUserAuthenticated: WritableSignal<boolean> = signal(false);

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly _jwtService: JwtService,
    private readonly _localService: LocalService,
  ) { }

  /**
   * Función para devolver un Observable de tipo boolean
   * para comprobar si el usuario está autenticado
   * @returns {boolean}
   */
  isUserAuthenticated(): boolean {
    return this._isUserAuthenticated();
  }

  /**
   * Función para establecer en el Observable que el usuario está autenticado
   * @param {boolean} status
   */
  setIsAuthenticated(status: boolean) {
    this._isUserAuthenticated.set(status);
  }

  /**
   * Función para asignar en un observable el usuario actual de tipo AuthUserEntity
   * @param {AuthUserEntity} data
   */
  setAuthUser(data: AuthUserEntity | null) {
    this._authUser.set(data);
  }

  /**
   * Función para devolver un observable de tipo AuthUserEntity con el usuario actual
   * @returns {Observable<AuthUserEntity>}
   */
  getAuthUser(): AuthUserEntity | null {
    return this._authUser();
  }

  /**
   * Función para comprobar si hay un token de usuario en el `localStorage`
   * y si es así, establecer el usuario actual y autenticarlo.
   */
  checkAuthUser() {
    const userToken = this._jwtService.getToken();

    // Si no hay un token, desconectamos al usuario
    if (!userToken) {
      this.logout();
      return;
    }

    // Si hay un token, establecemos el usuario actual y autenticamos al usuario
    this.setAuthUser(this.getUserDataFromToken());
    this.setIsAuthenticated(true);
  }


  /**
   * Método para obtener los datos del usuario del PAYLOAD del token JWT
   * @returns {AuthUserEntity}
   */
  getUserDataFromToken(): AuthUserEntity {
    return this._jwtService.getUserToken() as AuthUserEntity;
  }

  /**
   * Función para limpiar todo lo relacionado con el login:
   * `localStorage`, observables de autenticación, usuario actual, libro activo...
   */
  clearLogin() {
    this._localService.clearLocalStorage();
    this.setIsAuthenticated(false);
    this.setAuthUser(null);
  }

  /**
   * Método para loguear al usuario
   * @param {LoginAuthUserEntity} data
   * @returns {AuthUserEntity}
   */
  login(data: LoginAuthUserEntity): AuthUserEntity {
    return {} as AuthUserEntity; // TODO: Implementar lógica de login
  }

  /**
   * Método para desconectar al usuario
   */
  logout() {
    this.clearLogin();
    if (this.router.url !== '/login')
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }

}
