import { Component, ViewEncapsulation } from '@angular/core';

/**
 * Componente para crear el header de una tarjeta e incluir contenido dentro de ella junto con el componente `neo-card`.
 * @example
 * <neo-card label="Título de la tarjeta" icon="icono" size="s" [collapsable]="true">
 *    <neo-card-header>
*       <div>Título de la card</div>
 *    </neo-card-header>
 *    <p>Contenido de la card</p>
 * </neo-card>
 */
@Component({
  selector: 'neo-card-header',
  templateUrl: './card-header.component.html',
  styleUrl: './card-header.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CardHeaderComponent {

}
