import { Pipe, PipeTransform } from '@angular/core';

/**
 * @name
 * striphtml
 * @description
 * Pipe para eliminar las etiquetas HTML de un texto y devolver solo el texto plano
 * @example
 * <div>{{ html | striphtml }}</div>
 * const html = '<div>Texto</div>' => 'Texto'
 */
@Pipe({
  name: 'striphtml',
  standalone: true
})
export class StripHtmlPipe implements PipeTransform {
  transform(value: any): any {
    if ((value === null) || (value === '')) {
      return '';
    } else {
      return value?.replace(/<(?:.|\n)*?>/gm, ' ') || '';
    }
  }
}
