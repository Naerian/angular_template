import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList, ViewEncapsulation, forwardRef } from '@angular/core';
import { TabsItemComponent } from './tabs-item/tabs-item.component';
import { TabOrientation, TabType } from './models/tabs.entity';

/**
 * @name
 * neo-tabs
 * @description
 * Componente para crear un conjunto de tabs utilizando el componente `neo-tabs-item` para cada uno de ellos
 * @example
 * <neo-tabs [type]="'tab'" [orientation]="'v'">
 *    <neo-tabs-item title="Tab 1">
 *        <p>Contenido tab 1</p>
 *    </neo-tabs-item>
 *    <neo-tabs-item title="Tab 2">
 *        <p>Contenido tab 2</p>
 *    </neo-tabs-item>
 * </neo-tabs>
 */
@Component({
  selector: 'neo-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TabsComponent implements AfterContentInit {

  @ContentChildren(forwardRef(() => TabsItemComponent), { descendants: true }) tabs!: QueryList<TabsItemComponent>;

  @Input() type: TabType = 'tab';
  @Input() orientation: TabOrientation = 'v';

  @Output() tabSelectedIdx = new EventEmitter<number>();

  constructor() { }

  ngAfterContentInit() {

    // Obtenemos las tabs activas, si las hay, mediante un loop con "filter"
    const activeTabs = this.tabs.filter((tab: TabsItemComponent) => tab.isActive);

    // Si no hubiese ninguna activa, activamos la primera por defecto
    if (activeTabs.length === 0) {

      // Si es de tipo "tab", marcamos como una pestaña normal
      // --
      // Si es de tipo "router-tab", marcamos mediante las rutas
      if (this.type === 'tab')
        setTimeout(() => this.selected(this.tabs.first, 0));
    }
  }

  /**
   * Función para emitir el índice de la tab seleccionada
   * @param {number} tabIdx
   */
  setIndex(tabIdx: number) {
    this.tabSelectedIdx.emit(tabIdx);
  }

  /**
   * Función para seleccionar una tab y desactivar el resto
   * @param {TabsItemComponent} tab
   * @param {number} tabIdx
   */
  selected(tab: TabsItemComponent, tabIdx: number) {
    if (tab) {

      // Emitimos el índice de la tab seleccionada
      this.setIndex(tabIdx);

      // Desactivamos todas las tabs, recorriéndolas
      this.tabs.forEach((tabItem: TabsItemComponent) => tabItem.isActive = false);

      // Activamos la tab actual, la llamada en la función
      tab.isActive = true;
    }
  }
}
