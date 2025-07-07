import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeHtmlPipe } from '@shared/pipes/safeHtml/safe-html.pipe';
import { StripHtmlPipe } from '@shared/pipes/striphtml/striphtml.pipe';
import { OptionGroupsComponent } from './option-groups/option-groups.component';
import { OptionComponent } from './option/option.component';
import { SelectComponent } from './select.component';

@NgModule({
  declarations: [SelectComponent, OptionComponent, OptionGroupsComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    A11yModule,
    OverlayModule,
    SafeHtmlPipe,
    StripHtmlPipe,
  ],
  exports: [SelectComponent, OptionComponent, OptionGroupsComponent],
})
export class SelectModule {}
