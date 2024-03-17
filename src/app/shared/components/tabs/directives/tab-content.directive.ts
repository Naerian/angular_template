import { ContentChild, Directive, HostBinding } from '@angular/core';
import { TabsHeaderComponent } from '../tabs-item/tabs-header/tabs-header.component';

/**
 * @name
 * TabContentDirective
 * @description
 * Directiva para indicar donde irá el contenido de una tab junto con los componentes `neo-tabs-header`, `neo-tabs-body` y `neo-tabs-footer`.
 * Útil cuándo se quiere tener un control de la estructura de las tabs y el contenido de éstas no se encuentra como hijo directo del componente `neo-tabs`.
 * Por ejemplo: tenemos <neo-tabs></neo-tabs> y dentro de éste un componente hijo diferente.
 * En este caso, se puede utilizar esta directiva para indicar que el contenido de las tabs se encuentra dentro de este componente hijo.
 * @example
 * <div neoTabContent>
 *  <neo-tabs-header></neo-tabs-header>
 *  <neo-tabs-body></neo-tabs-body>
 *  <neo-tabs-footer></neo-tabs-footer>
 * </div>
 */
@Directive({
  selector: '[neoTabContent]',
  standalone: true
})
export class TabContentDirective {

  @ContentChild(TabsHeaderComponent) tabHeader: TabsHeaderComponent | null = null;

  @HostBinding('class.tabs__content__item')
  get contentItem() {
    return true;
  }

  @HostBinding('class.tabs__content__item--no_header')
  get noHeader() {
    return !this.tabHeader;
  }

  constructor() {

  }

}
