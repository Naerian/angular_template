import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from './card.component';
import { CardHeaderDirective } from './card-header/card-header.directive';

@NgModule({
  declarations: [
    CardComponent,
  ],
  imports: [
    CommonModule,
    ButtonComponent,
    CardHeaderDirective,
    TranslateModule
  ],
  exports: [
    CardComponent,
    CardHeaderDirective
  ]
})
export class CardModule { }
