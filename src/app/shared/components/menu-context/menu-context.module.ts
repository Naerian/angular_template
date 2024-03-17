import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { ClickableDirective } from '@shared/directives/clickable.directive';
import { EscapeKeyDirective } from '@shared/directives/escape-key.directive';
import { ButtonComponent } from '../button/button.component';
import { MenuContextComponent } from './menu-context.component';
import { ItemMenuContextComponent } from './item-menu-context/item-menu-context.component';

@NgModule({
  declarations: [
    MenuContextComponent,
    ItemMenuContextComponent,
  ],
  imports: [
    CommonModule,
    ClickableDirective,
    ClickOutsideDirective,
    EscapeKeyDirective,
    ButtonComponent,
    TranslateModule,
    A11yModule,
    OverlayModule
  ],
  exports: [
    MenuContextComponent,
    ItemMenuContextComponent
  ]
})
export class MenuContextModule { }
