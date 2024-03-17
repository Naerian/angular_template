import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonGroupComponent } from './radio-button-group/radio-button-group.component';
import { FormsModule } from '@angular/forms';
import { RadioButtonComponent } from './radio-button.component';

@NgModule({
  declarations: [
    RadioButtonGroupComponent,
    RadioButtonComponent,
  ],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    RadioButtonGroupComponent,
    RadioButtonComponent
  ]
})
export class RadioButtonModule { }
