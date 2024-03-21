import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { TextAreaComponent } from './text-area/text-area.component';
import { InputPasswordComponent } from './input-password/input-password.component';
import { CalendarDatePickerModule } from './input-date-picker/calendar-date-picker.module';
import { FormErrorComponent } from './form-error/form-error.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { RadioButtonModule } from './radio-button/radio-button.module';
import { SelectModule } from './select/select.module';
import { FormFieldComponent } from './form-field/form-field.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputComponent,
    TextAreaComponent,
    InputPasswordComponent,
    CheckboxComponent,
    FormErrorComponent,
    CalendarDatePickerModule,
    RadioButtonModule,
    SelectModule,
    FormFieldComponent
  ],
  exports: [
    InputComponent,
    TextAreaComponent,
    InputPasswordComponent,
    FormErrorComponent,
    CheckboxComponent,
    CalendarDatePickerModule,
    RadioButtonModule,
    SelectModule,
    FormFieldComponent
  ]
})
export class FormFields { }
