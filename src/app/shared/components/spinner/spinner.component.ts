import { Component, InputSignal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerPosition, SpinnerSize } from './models/spinner.model';

@Component({
  selector: 'neo-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true, // Marcamos como standalone para que no necesite un NgModule
  host: {
    class: 'neo-spinner-container',
    '[class.neo-spinner-container--absolute]': 'position() === "absolute"',
    '[class.neo-spinner-container--inline]': 'position() === "inline"',
    '[class.neo-spinner-container--has-label]': 'label() !== null',
    '[style.backgroundColor]': 'backdropColor()',
  },
  imports: [CommonModule],
})
export class SpinnerComponent {
  /**
   * Texto opcional a mostrar como etiqueta (label) del spinner.
   * Si no se proporciona, no se muestra el label.
   * @type {InputSignal<string | null>}
   * @default null
   */
  label: InputSignal<string | null> = input<string | null>(null);

  /**
   * Color del texto de la etiqueta (label). Puede ser un nombre de color, hex, o variable CSS.
   * @type {InputSignal<string>}
   * @default 'var(--color-primary)'
   */
  labelColor: InputSignal<string> = input<string>('var(--color-primary)');

  /**
   * Color del spinner. Puede ser un nombre de color, hex, o variable CSS.
   * @type {InputSignal<string>}
   * @default 'var(--color-primary)'
   */
  spinnerColor: InputSignal<string> = input<string>('var(--color-primary)');

  /**
   * Color del fondo (backdrop) del spinner cuando `position` es 'absolute'.
   * @type {InputSignal<string | null>}
   * @default 'rgba(255, 255, 255, 0.7)' (un blanco semitransparente)
   */
  backdropColor: InputSignal<string | null> = input<string | null>(
    'rgba(255, 255, 255, 0.7)',
  );

  /**
   * Tamaño del spinner y, opcionalmente, de la etiqueta.
   * @type {InputSignal<SpinnerSize>}
   * @default 'm'
   */
  size: InputSignal<SpinnerSize> = input<SpinnerSize>('m');

  /**
   * Define la posición del spinner:
   * - 'absolute': El spinner se posiciona absolutamente, ideal para superponerse a un contenedor.
   * - 'inline': El spinner se posiciona en el flujo normal del documento.
   * @type {InputSignal<SpinnerPosition>}
   * @default 'inline'
   */
  position: InputSignal<SpinnerPosition> = input<SpinnerPosition>('inline');
}
