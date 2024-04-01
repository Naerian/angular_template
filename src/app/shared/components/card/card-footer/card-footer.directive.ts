import { Directive } from '@angular/core';

@Directive({
  selector: 'neo-card-footer',
  exportAs: 'neoCardFooter',
  standalone: true
})
export class CardFooterDirective {

  constructor() { }

}
