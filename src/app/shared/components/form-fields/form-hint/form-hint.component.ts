import {
  Component,
  Input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

/**
 * @name
 * neo-form-hint
 * @description
 * Componente que muestra un texto de ayuda o sugerencia para un control de formulario.
 * @example
 * <neo-form-hint text="Este es un campo de texto" id="campo-texto-hint"></neo-form-hint>
 */
@Component({
  selector: 'neo-form-hint',
  standalone: true,
  templateUrl: './form-hint.component.html',
  styleUrls: ['./form-hint.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormHintComponent {
  /**
   * Texto que se mostrará como hint o sugerencia.
   * Este texto debe ser claro y conciso para ayudar al usuario a entender el propósito del campo.
   */
  @Input() text!: string;

  /**
   * Input para añadir un aria-describedby al campo
   * Este ID se usará para asociar el hint con el control de formulario.
   */
  _id = signal('');
  @Input() set id(value: string) {
    this._id.set(value);
  }
  get id() {
    return this._id();
  }
}
