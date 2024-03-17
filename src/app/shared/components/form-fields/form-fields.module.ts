import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { TextAreaComponent } from './text-area/text-area.component';
import { InputPasswordComponent } from './input-password/input-password.component';
import { SelectModule } from './select/select.module';
import { CalendarDatePickerModule } from './input-date-picker/calendar-date-picker.module';
import { FormErrorComponent } from './form-error/form-error.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { RadioButtonModule } from './radio-button/radio-button.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputComponent,
    TextAreaComponent,
    InputPasswordComponent,
    SelectModule,
    CheckboxComponent,
    FormErrorComponent,
    CalendarDatePickerModule,
    RadioButtonModule
  ],
  exports: [
    InputComponent,
    TextAreaComponent,
    InputPasswordComponent,
    FormErrorComponent,
    SelectModule,
    CheckboxComponent,
    CalendarDatePickerModule,
    RadioButtonModule
  ]
})
export class FormFields { }
