import { Directive } from '@angular/core';

@Directive({
  selector: 'neo-card-header',
  exportAs: 'neoCardHeader',
  standalone: true
})
export class CardHeaderDirective {

  constructor() { }

}
