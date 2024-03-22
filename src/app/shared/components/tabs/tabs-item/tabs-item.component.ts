import { Component, ContentChild, Input, TemplateRef, ViewEncapsulation, WritableSignal, signal } from '@angular/core';
import { TabLabelDirective } from '@shared/components/tabs/directives/tab-label.directive';
import { DEFAULT_TITLE } from '../models/tabs.entity';
import { TabsHeaderDirective } from './tabs-header/tabs-header.directive';
import { TabsBodyDirective } from './tabs-body/tabs-body.directive';
import { TabsFooterDirective } from './tabs-footer/tabs-footer.directive';

/**
 * @name
 * neo-tabs-item
 * @description
 * Componente para crear un item de un tab en el componente `neo-tabs`.
 * @example
 * <neo-tabs [type]="'tab'" [orientation]="'v'">
 *    <neo-tabs-item title="Tab 1">
 *        <p>Contenido tab 1</p>
 *    </neo-tabs-item>
 *    <neo-tabs-item title="Tab 2">
 *        <neo-tabs-header>
 *            CABECERA
 *        </neo-tabs-header>
 *        <neo-tabs-body>
 *            CONTENIDO
 *        </neo-tabs-body>
 *        <neo-tabs-footer>
 *            PIE
 *        </neo-tabs-footer>
 *    </neo-tabs-item>
 * </neo-tabs>
 */
@Component({
  selector: 'neo-tabs-item',
  templateUrl: './tabs-item.component.html',
  styleUrls: ['./tabs-item.component.scss'],
  host: {
    '[class.active]': 'isActiveTab()',
    '[hidden]': '!isActiveTab()',
  },
  encapsulation: ViewEncapsulation.None
})
export class TabsItemComponent {

  @ContentChild(TabsHeaderDirective) tabHeader!: TabsHeaderDirective;
  @ContentChild(TabsBodyDirective) tabBody!: TabsBodyDirective;
  @ContentChild(TabsFooterDirective) tabFooter!: TabsFooterDirective;
  @ContentChild(TabLabelDirective) tabLabel!: TabLabelDirective;

  /**
   * Input para establecer el título del tab
   */
  @Input() title: string = '';

  /**
   * Input para establecer un icono en el tab
   */
  @Input() icon: string = '';

  /**
   * Input para establecer una ruta en el tab si `tab` es de tipo "router-tab"
   */
  @Input() route: string = '';

  /**
   * Input para activar o desactivar el tab
   */
  @Input() set active(status: boolean) {
    this._active.set(status);
  }
  get active() {
    return this._active();
  }

  private _active: WritableSignal<boolean> = signal(false);
  private _title: string = DEFAULT_TITLE;
  private _id: string = `tab_${Math.floor(Math.random() * 999999)}`;
  private _contentId: string = `content_${Math.floor(Math.random() * 999999)}`;

  ngAfterContentInit() {
    if (this.title) {
      this._title = this.title;
    } else {
      this._title = DEFAULT_TITLE;
    }
  }

  /**
   * Función para obtener el estado del tab
   */
  isActiveTab(): boolean {
    return this._active();
  }

  /**
   * Función para activar el tab
   */
  activateTab() {
    this._active.set(true);
  }

  /**
   * Función para desactivar el tab
   */
  deactivateTab() {
    this._active.set(false);
  }

  /**
   * Función para cambiar el estado del tab
   */
  toggleTab() {
    this._active.set(!this._active());
  }

  /**
   * Función para obtener el id del tab
   */
  getId(): string {
    return this._id;
  }

  /**
   * Función para obtener el id del contenido del tab
   */
  getContentId(): string {
    return this._contentId;
  }

  /**
   * Función para obtener el título del tab
   */
  getTitle(): string {
    return this._title;
  }

  /**
   * Función para obtener el icono del tab
   */
  getIcon(): string {
    return this.icon;
  }

  /**
   * Función para obtener la ruta del tab
   */
  getRoute(): string {
    return this.route;
  }

  /**
   * Función para obtener el contenido del tab
   */
  getLabelContent(): TemplateRef<any> {
    return this.tabLabel?.templateRef || null;
  }

}
