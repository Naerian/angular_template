import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../button/button.component';
import { ThemeToggleComponent } from './theme-toggle.component';
import { CustomThemesDirective } from './directive/custom-themes.directive';

@NgModule({
  declarations: [
    ThemeToggleComponent,
  ],
  imports: [
    CommonModule,
    ButtonComponent,
    TranslateModule,
    CustomThemesDirective
  ],
  exports: [
    ThemeToggleComponent,
    CustomThemesDirective
  ]
})
export class ThemeToggleModule { }
