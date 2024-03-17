import { Component, ViewEncapsulation } from '@angular/core';

/**
 * @name
 * neo-form-error
 * @description
 * Componente para mostrar un mensaje de error en un campo de formulario
 * @example
 * <neo-form-error>Mensaje de error</neo-form-error>
 */
@Component({
  selector: 'neo-form-error',
  standalone: true,
  imports: [],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FormErrorComponent {

}
