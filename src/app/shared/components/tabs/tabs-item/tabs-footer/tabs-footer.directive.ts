import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'neo-tabs-footer, [neo-tabs-footer], [neoTabsFooter]',
  exportAs: 'neoTabsFooter',
  standalone: true
})
export class TabsFooterDirective {

  @HostBinding('class.tabs__content__item__footer')
  get contentItem() {
    return true;
  }

}
