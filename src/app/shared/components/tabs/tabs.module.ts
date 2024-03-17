import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClickableDirective } from '@shared/directives/clickable.directive';
import { TabsItemComponent } from './tabs-item/tabs-item.component';
import { TabsComponent } from './tabs.component';
import { TabLabelDirective } from './directives/tab-label.directive';
import { TabsFooterComponent } from './tabs-item/tabs-footer/tabs-footer.component';
import { TabsBodyComponent } from './tabs-item/tabs-body/tabs-body.component';
import { TabsHeaderComponent } from './tabs-item/tabs-header/tabs-header.component';
import { TabContentDirective } from './directives/tab-content.directive';

@NgModule({
  declarations: [
    TabsComponent,
    TabsItemComponent,
    TabsHeaderComponent,
    TabsFooterComponent,
    TabsBodyComponent,
    TabLabelDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    ClickableDirective,
    TabContentDirective
  ],
  exports: [
    TabsComponent,
    TabsItemComponent,
    TabsHeaderComponent,
    TabsFooterComponent,
    TabsBodyComponent,
    TabLabelDirective,
    TabContentDirective
  ]
})
export class TabsModule { }
