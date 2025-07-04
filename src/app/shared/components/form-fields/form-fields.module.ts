import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { FormErrorComponent } from './form-error/form-error.component';
import { FormFieldComponent } from './form-field/form-field.component';
import { InputDatePickerComponent } from './input-date-picker/input-date-picker.component';
import { InputFileComponent } from './input-file/input-file.component';
import { InputPasswordComponent } from './input-password/input-password.component';
import { InputComponent } from './input/input.component';
import { RadioButtonModule } from './radio-button/radio-button.module';
import { SelectModule } from './select/select.module';
import { TextAreaComponent } from './text-area/text-area.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputComponent,
    TextAreaComponent,
    InputPasswordComponent,
    CheckboxComponent,
    FormErrorComponent,
    RadioButtonModule,
    SelectModule,
    FormFieldComponent,
    InputFileComponent,
    InputDatePickerComponent,
  ],
  exports: [
    InputComponent,
    TextAreaComponent,
    InputPasswordComponent,
    FormErrorComponent,
    CheckboxComponent,
    RadioButtonModule,
    SelectModule,
    FormFieldComponent,
    InputFileComponent,
    InputDatePickerComponent,
  ],
})
export class FormFieldsModule {}
