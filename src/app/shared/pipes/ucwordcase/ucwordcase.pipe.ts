import { Pipe, PipeTransform } from '@angular/core';

/**
 * @name
 * ucwordcase
 * @description
 * Pipe para convertir la primera letra del string a mayúsculas y el resto a minúsculas
 * @example
 * <div>{{ text | ucwordcase }}</div>
 * hola mundo => Hola mundo
 * Hola Mundo => Hola mundo
 */
@Pipe({
  name: 'ucwordcase',
  standalone: true
})
export class UcwordcasePipe implements PipeTransform {

  transform(text: any): string {
    return typeof text === 'string'
      ? (text.toLowerCase().slice(0, 1).toUpperCase() + text.toLowerCase().slice(1))
      : text;
  }

}
