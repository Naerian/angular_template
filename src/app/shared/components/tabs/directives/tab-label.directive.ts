import { Directive, TemplateRef } from '@angular/core';

/**
 * @name
 * neoTabsItemLabel
 * @description
 * Directiva para crear el label de un tab en el componente "neo-tabs-item"
 * de forma personalizada. Se puede utilizar tanto con `*neoTabsItemLabel` en HTML como con `[neoTabsItemLabel]` en un `ng-template`.
 */
@Directive({
  selector: '[neoTabsItemLabel]'
})
export class TabLabelDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}
