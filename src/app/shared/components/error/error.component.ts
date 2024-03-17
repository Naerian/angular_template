import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'neo-error',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {

  @Input() label?: string;
  @Input() textAlign?: 'left' | 'right' | 'center' = 'center';

  constructor(private readonly _translateService: TranslateService) { }

  ngOnInit(): void {
    if (typeof this.label === 'undefined' || !this.label || this.label === '') {
      this.label = this._translateService.instant('app.not_results');
    }
  }
}
