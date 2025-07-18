import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { DropdownOptionComponent } from './dropdown-option/dropdown-option.component';
import { DropdownOptionGroupComponent } from './dropdown-option-group/dropdown-option-group.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ShowClearFieldDirective } from '@shared/directives/show-clear-field.directive';
import { InputComponent } from '../input/input.component';
import { A11yModule } from '@angular/cdk/a11y';
import { FocusableItemDirective } from './directives/focusable-item.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    OverlayModule,
    A11yModule,
    ShowClearFieldDirective,
    FocusableItemDirective,
    SpinnerComponent,
    InputComponent,
  ],
  declarations: [
    DropdownComponent,
    DropdownOptionComponent,
    DropdownOptionGroupComponent,
  ],
  exports: [
    DropdownComponent,
    DropdownOptionComponent,
    DropdownOptionGroupComponent,
  ],
})
export class DropdownModule {}
