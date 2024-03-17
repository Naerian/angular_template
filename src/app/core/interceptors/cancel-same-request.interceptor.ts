import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Subject, Observable, takeUntil, tap } from 'rxjs';
import { InterceptorService } from './services/interceptors.service';

export const cancelSameRequestInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {

  const _interceptorService = inject(InterceptorService);

  // Only cancel GET requests
  if (request.method !== 'GET')
    return next(request);

  // check if the request is already cached
  const cachedResponse = _interceptorService.getCachedRequest(request);

  // cancel any previous requests
  if (cachedResponse)
    cachedResponse.next();

  const cancelRequests$ = new Subject<void>();

  // cache the new request , so that we can cancel it if needed.
  _interceptorService.setCachedRequest(request, cancelRequests$);

  const newRequest = next(request).pipe(

    // cancel the request if a same request comes in.
    takeUntil(cancelRequests$),

    // complete the subject when the request completes.
    tap((event) => {
      if (event instanceof HttpResponse)
        _interceptorService.deleteCachedRequest(request);
    })
  );

  return newRequest;

}
