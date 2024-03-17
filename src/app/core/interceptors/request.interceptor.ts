import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from "@angular/core";
import { catchError, map } from 'rxjs/operators';
import { InterceptorService } from './services/interceptors.service';

export const requestInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  return next(request).pipe(

    // Para el cambio y comprobación de estados desde backend
    map((event: HttpEvent<any>) => {
      return event;
    }),
    catchError((err) => {
      const _interceptorService = inject(InterceptorService);
      return _interceptorService.interceptorError(err, request);
    }),

  );

}
