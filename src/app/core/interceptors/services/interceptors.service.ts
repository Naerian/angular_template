import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { throwError, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  // Utilizamos una cache en el interceptor 'CancelSameRequest' para cancelar peticiones duplicadas
  private cache = new Map<string, Subject<void>>();

  constructor(
    private readonly _router: Router,
    private readonly _authService: AuthService,
    private readonly _toastrService: ToastrService,
  ) { }

  /**
   * Método para obtener la petición cacheada
   * @param {HttpRequest<any>} request
   * @returns
   */
  getCachedRequest(request: HttpRequest<any>) {
    return this.cache.get(request.urlWithParams);
  }

  /**
   * Método para guardar la petición cacheada
   * @param {HttpRequest<any>} request
   * @returns
   */
  setCachedRequest(request: HttpRequest<any>, cancelRequests$: Subject<void>) {
    this.cache.set(request.urlWithParams, cancelRequests$);
  }

  /**
   * Método para eliminar la petición cacheada
   * @param {HttpRequest<any>} request
   * @returns
   */
  deleteCachedRequest(request: HttpRequest<any>) {
    this.cache.delete(request.urlWithParams);
  }

  /**
   * Método para manejar los errores de las peticiones
   * @param {HttpErrorResponse} err
   * @param {HttpRequest<any>} request
   * @returns
   */
  interceptorError(err: HttpErrorResponse, request: HttpRequest<any>) {

    if (err instanceof HttpErrorResponse) {
      switch (err.status) {
        case 400:
          return this.error400(err, request);
        case 401:
          return this.error401(err, request);
        case 403:
          return this.error403(err, request);
        case 404:
          return this.error404(err, request);
        case 500:
        case 501:
        case 502:
        case 504:
        case 508:
          return this.error500(err, request);
        default:
          return throwError(() => err);
      }
    }

    return throwError(() => err);
  }

  /**
   * Método para mostrar un mensaje de error
   * @param {string} errorMessage
   */
  private showErrorMessage(errorMessage: string = '') {
    if (errorMessage)
      this._toastrService.error(errorMessage);
  }

  /**
   * Método para manejar el error 400, petición incorrecta
   * @param {HttpErrorResponse} err
   * @param {HttpRequest<any>} request
   */
  private error400(err: HttpErrorResponse, request: HttpRequest<any>) {
    this.showErrorMessage(err?.error?.message || 'request.bad_request');
    return throwError(() => err);
  }

  /**
   * Este error por lo general será para informar de que la sesión del usuario ha caducado
   * @param {HttpErrorResponse} err
   * @param {HttpRequest<any>} request
   */
  private error401(err: HttpErrorResponse, request: HttpRequest<any>) {
    this._authService.setIsAuthenticated(false);
    this.showErrorMessage(err?.error?.message || null);
    return throwError(() => err);
  }

  /**
   * Método para manejar el error 403, por lo general será para informar de que el usuario no tiene permisos para acceder a la ruta
   * @param {HttpErrorResponse} err
   * @param {HttpRequest<any>} request
   */
  private error403(err: HttpErrorResponse, request: HttpRequest<any>) {
    this.showErrorMessage(err?.error?.message || 'request.forbidden');
    return throwError(() => err);
  }

  /**
   * Método para manejar el error 404, por lo general será para informar de que la ruta no existe
   * @param {HttpErrorResponse} err
   * @param {HttpRequest<any>} request
   */
  private error404(err: HttpErrorResponse, request: HttpRequest<any>) {
    this._router.navigate(['/error/not-found-error']);
    return throwError(() => err);
  }

  /**
   * Método para manejar el error 500, por lo general será para informar de que ha ocurrido un error en el servidor
   * @param {HttpErrorResponse} err
   * @param {HttpRequest<any>} request
   */
  private error500(err: HttpErrorResponse, request: HttpRequest<any>) {
    this.showErrorMessage(err?.error?.message || 'request.server_error');
    return throwError(() => err);
  }
}
