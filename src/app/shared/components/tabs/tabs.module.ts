import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClickableDirective } from '@shared/directives/clickable.directive';
import { TabsItemComponent } from './tabs-item/tabs-item.component';
import { TabsComponent } from './tabs.component';
import { TabLabelDirective } from './directives/tab-label.directive';
import { TabItemDirective } from './tabs-item/tabs-item.directive';
import { TabsHeaderDirective } from './tabs-item/tabs-header/tabs-header.directive';
import { TabsBodyDirective } from './tabs-item/tabs-body/tabs-body.directive';
import { TabsFooterDirective } from './tabs-item/tabs-footer/tabs-footer.directive';

@NgModule({
  declarations: [
    TabsComponent,
    TabsItemComponent,
    TabLabelDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    ClickableDirective,
    TabItemDirective,
    TabsHeaderDirective,
    TabsBodyDirective,
    TabsFooterDirective
  ],
  exports: [
    TabsComponent,
    TabsItemComponent,
    TabLabelDirective,
    TabItemDirective,
    TabsHeaderDirective,
    TabsBodyDirective,
    TabsFooterDirective
  ]
})
export class TabsModule { }
