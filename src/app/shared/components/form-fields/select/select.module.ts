import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { ClickableDirective } from '@shared/directives/clickable.directive';
import { EscapeKeyDirective } from '@shared/directives/escape-key.directive';
import { SafeHtmlPipe } from '@shared/pipes/safeHtml/safe-html.pipe';
import { StripHtmlPipe } from '@shared/pipes/striphtml/striphtml.pipe';
import { SelectComponent } from './select.component';
import { OptionsDirective } from './options/options.directive';

@NgModule({
  declarations: [
    SelectComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    A11yModule,
    OverlayModule,
    SafeHtmlPipe,
    StripHtmlPipe,
    ClickableDirective,
    ClickOutsideDirective,
    EscapeKeyDirective,
    OptionsDirective
  ],
  exports: [
    SelectComponent,
    OptionsDirective
  ]
})
export class SelectModule { }
