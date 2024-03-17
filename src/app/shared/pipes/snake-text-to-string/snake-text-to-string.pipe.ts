import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakeTextToString',
  standalone: true
})
export class SnakeTextToStringPipe implements PipeTransform {

  transform(text: any): string {
    const stakeToText = text.replace(/^[-_]*(.)/, (_: any, c: any) => c.toLowerCase()).replace(/[-_]+(.)/g, (_: any, c: any) => ' ' + c.toLowerCase());
    return typeof stakeToText === 'string'
      ? (stakeToText.slice(0, 1).toUpperCase() + stakeToText.slice(1))
      : stakeToText;
  }

}
