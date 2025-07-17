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
import { TextAreaComponent } from './text-area/text-area.component';
import { FormHintComponent } from './form-hint/form-hint.component';
import { DropdownModule } from './dropdown/dropdown.module';
import { InputNumberComponent } from './input-number/input-number.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputComponent,
    InputNumberComponent,
    TextAreaComponent,
    InputPasswordComponent,
    CheckboxComponent,
    FormErrorComponent,
    FormHintComponent,
    RadioButtonModule,
    FormFieldComponent,
    InputFileComponent,
    InputDatePickerComponent,
    DropdownModule,
  ],
  exports: [
    InputComponent,
    InputNumberComponent,
    TextAreaComponent,
    InputPasswordComponent,
    FormErrorComponent,
    FormHintComponent,
    CheckboxComponent,
    RadioButtonModule,
    FormFieldComponent,
    InputFileComponent,
    InputDatePickerComponent,
    DropdownModule,
  ],
})
export class FormFieldsModule {}
