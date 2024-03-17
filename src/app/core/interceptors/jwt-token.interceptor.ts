import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { JwtService } from "@services/jwt/jwt.service";
import { inject } from "@angular/core";
import moment from "moment";
import { Observable } from "rxjs";

export const jwtTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {

  const _jwtService: JwtService = inject(JwtService);
  const authToken: string = _jwtService.getToken();

  let request = req;

  if (authToken) {
    request = req.clone({
      setHeaders: {
        'x-auth-token': `Bearer ${authToken}`,
        'Current-Time': moment().format(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
      }
    });
  }

  return next(request);
}
