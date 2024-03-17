import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

/**
 * Auth guard para proteger rutas de la aplicación que requieran autenticación
 *  - Si el usuario no está autenticado, se redirige a la página de login
 *  - Si el usuario está autenticado, se permite el acceso a la ruta
 * @param {ActivatedRouteSnapshot} route
 * @param {RouterStateSnapshot} state
 * @returns {boolean}
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const _authService = inject(AuthService);

  if (!_authService.isUserAuthenticated()) {
    _authService.logout();
    return false;
  }

  return true;
};

/**
 * Auth guard para proteger rutas hijas de la aplicación que requieran autenticación
 * utilizando el guard `authGuard` para comprobar si el usuario está autenticado
 * @param {ActivatedRouteSnapshot} route
 * @param {RouterStateSnapshot} state
 * @returns {boolean}
 */
export const authGuardChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => authGuard(route, state);
