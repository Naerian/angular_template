import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

/**
 * @name
 * ErrorComponent
 * @description
 * Componente para mostrar un mensaje de error en la aplicación. Si no se le pasa un mensaje, mostrará un mensaje por defecto.
 * @example
 * <neo-error>Mensaje de error</neo-error>
 */
@Component({
  selector: 'neo-error',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ErrorComponent implements OnInit {

  _defaultLabel: string = '';
  constructor(private readonly _translateService: TranslateService) { }

  ngOnInit(): void {
    this._defaultLabel = this._translateService.instant('app.not_results');
  }
}
