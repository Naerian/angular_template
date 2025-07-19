import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../button/button.component';
import { ActionMenuComponent } from './action-menu.component';
import { ActionMenuItemComponent } from './action-menu-item/action-menu-item.component';

@NgModule({
  declarations: [
    ActionMenuComponent,
    ActionMenuItemComponent,
  ],
  imports: [
    CommonModule,
    ButtonComponent,
    TranslateModule,
    A11yModule,
    OverlayModule
  ],
  exports: [
    ActionMenuComponent,
    ActionMenuItemComponent
  ]
})
export class MenuContextModule { }
