import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu.component';
import { SideMenuItemComponent } from './side-menu-item/side-menu-item.component';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

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
  ],
  exports: [
    SideMenuComponent,
    SideMenuItemComponent
  ]
})
export class SideMenuModule { }
