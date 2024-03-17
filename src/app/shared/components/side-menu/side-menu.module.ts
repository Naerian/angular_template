import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu.component';
import { SideMenuItemComponent } from './side-menu-item/side-menu-item.component';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ClickableDirective } from '@shared/directives/clickable.directive';

@NgModule({
  declarations: [
    SideMenuComponent,
    SideMenuItemComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterLinkActive,
    RouterLink,
    ClickableDirective
  ],
  exports: [
    SideMenuComponent,
    SideMenuItemComponent
  ]
})
export class SideMenuModule { }
