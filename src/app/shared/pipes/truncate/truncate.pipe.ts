import { Pipe, PipeTransform } from '@angular/core';

/**
 * @name
 * truncate
 * @description
 * Pipe para truncar un texto a un número de caracteres determinado y añadir puntos suspensivos al final
 * @example
 * <div>{{ text | truncate:25:true:'...' }}</div>
 * Hola mundo perfecto -> Hola mundo perfe...
 */
@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 25, completeWords = false, ellipsis = '...') {
    if (completeWords) {
      limit = value.substring(0, limit).lastIndexOf(' ');
    }
    return value.length > limit ? value.substring(0, limit) + ellipsis : value;
  }
}
