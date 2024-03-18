import { Component, ContentChild, ContentChildren, Input, OnInit, QueryList, ViewEncapsulation, forwardRef } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None
})
export class TabsItemComponent implements OnInit {

  @ContentChild(TabsHeaderDirective) tabHeader!: TabsHeaderDirective;
  @ContentChild(TabsBodyDirective) tabBody!: TabsBodyDirective;
  @ContentChild(TabsFooterDirective) tabFooter!: TabsFooterDirective;

  // @ContentChildren(forwardRef(() => TabsHeaderDirective), { descendants: true }) tabHeader!: QueryList<TabsHeaderDirective>;
  // @ContentChildren(forwardRef(() => TabsBodyDirective), { descendants: true }) tabBody!: QueryList<TabsBodyDirective>;
  // @ContentChildren(forwardRef(() => TabsFooterDirective), { descendants: true }) tabFooter!: QueryList<TabsFooterDirective>;

  @ContentChild(TabLabelDirective) tabLabel!: TabLabelDirective;

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
