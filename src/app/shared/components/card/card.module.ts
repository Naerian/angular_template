import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from './card.component';
import { CardHeaderComponent } from './card-header/card-header.component';

@NgModule({
  declarations: [
    CardComponent,
    CardHeaderComponent
  ],
  imports: [
    CommonModule,
    ButtonComponent,
    TranslateModule
  ],
  exports: [
    CardComponent,
    CardHeaderComponent
  ]
})
export class CardModule { }
