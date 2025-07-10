import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioButtonGroupComponent } from './radio-button-group/radio-button-group.component';
import { RadioButtonComponent } from './radio-button.component';

@NgModule({
  declarations: [RadioButtonGroupComponent, RadioButtonComponent],
  imports: [FormsModule, CommonModule],
  exports: [RadioButtonGroupComponent, RadioButtonComponent],
})
export class RadioButtonModule {}
