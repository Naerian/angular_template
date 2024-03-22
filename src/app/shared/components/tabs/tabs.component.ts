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

  /**
   * Input para establecer el tipo de tab que se va a utilizar (tab o router-tab)
   */
  @Input() type: TabType = 'tab';

  /**
   * Input para establecer la orientación de los tabs (vertical u horizontal)
   */
  @Input() orientation: TabOrientation = 'v';

  /**
   * Output para emitir el índice de la tab seleccionada
   */
  @Output() tabSelectedIdx = new EventEmitter<number>();


  ngAfterContentInit() {

    // Obtenemos la tab activa si la hay
    const activeTab = this.tabs.find((tab: TabsItemComponent) => tab.isActiveTab());

    // Si no hubiese ninguna activa, activamos la primera por defecto
    if (!activeTab) {

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

      // Desactivamos todas las tabs
      this.tabs.forEach((tabItem: TabsItemComponent) => tabItem.deactivateTab());

      // Activamos la tab actual
      tab.activateTab();

      // Emitimos el índice de la tab seleccionada
      this.setIndex(tabIdx);
    }
  }
}
