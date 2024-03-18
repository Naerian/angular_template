import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'neo-tabs-header, [neo-tabs-header], [neoTabsHeader]',
  exportAs: 'neoTabsHeader',
  standalone: true
})
export class TabsHeaderDirective {

  @HostBinding('class.tabs__content__item__header')
  get contentItem() {
    return true;
  }

}
