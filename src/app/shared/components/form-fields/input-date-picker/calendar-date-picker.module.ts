import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { ClickableDirective } from '@shared/directives/clickable.directive';
import { EscapeKeyDirective } from '@shared/directives/escape-key.directive';
import { CalendarPickerComponent } from './calendar-picker/calendar-picker.component';
import { InputDatePickerComponent } from './input-date-picker.component';

@NgModule({
  declarations: [
    InputDatePickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    A11yModule,
    CalendarPickerComponent,
    ClickableDirective,
    ClickOutsideDirective,
    EscapeKeyDirective
  ],
  exports: [
    InputDatePickerComponent,
    CalendarPickerComponent
  ]
})
export class CalendarDatePickerModule { }
