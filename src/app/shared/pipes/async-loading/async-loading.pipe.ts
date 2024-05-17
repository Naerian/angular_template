import { Pipe, PipeTransform } from '@angular/core';
import { Observable, isObservable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

export interface ObsWithStatusResult<T> {
  loading?: boolean;
  value?: T;
  error?: string;
}

const defaultError = '-';

@Pipe({
  name: 'asyncLoading',
  standalone: true
})
export class AsyncLoadingPipe implements PipeTransform {
  transform<T = any>(val: Observable<T>): Observable<ObsWithStatusResult<T>> {
    return isObservable(val) ? val.pipe(
      map((value: any) => {
        return {
          loading: value.type === 'start',
          error: value.type === 'error' ? defaultError : '',
          value: value.type ? value.value : value,
        };
      }),
      startWith({ loading: true }),
      catchError(error => of({ loading: false, error: typeof error === 'string' ? error : defaultError }))
    )
      : val;
  }
}
