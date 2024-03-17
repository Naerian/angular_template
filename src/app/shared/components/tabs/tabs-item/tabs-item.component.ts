import { Component, ContentChild, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TabLabelDirective } from '@shared/components/tabs/directives/tab-label.directive';
import { DEFAULT_TITLE } from '../models/tabs.entity';
import { TabsFooterComponent } from './tabs-footer/tabs-footer.component';
import { TabsBodyComponent } from './tabs-body/tabs-body.component';
import { TabsHeaderComponent } from './tabs-header/tabs-header.component';

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
  encapsulation: ViewEncapsulation.None
})
export class TabsItemComponent implements OnInit {

  @ContentChild(TabsHeaderComponent) tabHeader: TabsHeaderComponent | null = null;
  @ContentChild(TabsBodyComponent) tabBody: TabsBodyComponent | null = null;
  @ContentChild(TabsFooterComponent) tabFooter: TabsFooterComponent | null = null;

  @ContentChild(TabLabelDirective) tabLabel: TabLabelDirective | null = null;

  @Input() active: boolean = false;
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() route: string = '';

  isActive: boolean = false;
  _title: string = DEFAULT_TITLE;

  constructor() { }

  ngOnInit(): void {
    this.isActive = this.active;
  }

  ngAfterContentInit() {
    if (this.title) {
      this._title = this.title;
    } else {
      this._title = DEFAULT_TITLE;
    }
  }

}
