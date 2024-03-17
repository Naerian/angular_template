import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'neo-not-found-error',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterLink, TranslateModule],
  templateUrl: './not-found-error.component.html',
  styleUrl: './not-found-error.component.scss'
})
export class NotFoundErrorComponent {

}
