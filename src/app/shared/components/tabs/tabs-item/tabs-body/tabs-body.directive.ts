import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'neo-tabs-body',
  exportAs: 'neoTabsBody',
  standalone: true
})
export class TabsBodyDirective {

  @HostBinding('class.tabs__content__item__body')
  get contentItem() {
    return true;
  }

}
