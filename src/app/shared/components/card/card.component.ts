import { Component, ContentChild, HostBinding, Input, WritableSignal, signal, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ButtonSize } from '../button/models/button.entity';
import { CardHeaderDirective } from './card-header/card-header.directive';
import { CardFooterDirective } from './card-footer/card-footer.directive';

/**
 * Componente para crear una tarjeta e incluir contenido dentro de ella
 * @example
 * <neo-card label="Título de la tarjeta" icon="icono" size="s" [collapsable]="true">
 *    <neo-card-header>
*       <div>Tipos de botones</div>
 *    </neo-card-header>
 *    <p>Contenido de la tarjeta</p>
 * </neo-card>
 */
@Component({
  selector: 'neo-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  host: {
    'class': 'neo-card',
    '[class.neo-card--collapsed-label]': '_isCollapsed() && (iconCollpased || labelCollpased) && !neoCardHeader',
    '[class.neo-card--has-structure]': 'neoCardFooter || neoCardHeader',
  },
  encapsulation: ViewEncapsulation.None
})
export class CardComponent {

  /**
   * Contenido del header de la tarjeta (si lo hubiera) mediante el componente `neo-card-header`
   */
  @ContentChild(CardHeaderDirective) neoCardHeader!: CardHeaderDirective;

  /**
   * Contenido del footer de la tarjeta (si lo hubiera) mediante el componente `neo-card-footer`
   */
  @ContentChild(CardFooterDirective) neoCardFooter!: CardFooterDirective;

  /**
   * Título de la tarjeta (si lo hubiera) que se muestra en el header de la tarjeta
   */
  @Input() labelCollpased: string = '';

  /**
   * Icono para el título de la tarjeta (si lo hubiera) que se muestra en el header de la tarjeta al colapsarla
   */
  @Input() iconCollpased: string = '';

  /**
   * Tamaño del botón al que pasará el tamaño de la tarjeta (si lo hubiera) cuando se colapse
   */
  @Input() sizeIconCollapsed: ButtonSize = 's';

  /**
   * Indica si la tarjeta es colapsable
   */
  @Input() collapsable?: boolean = false;

  /**
   * Indica si la tarjeta está colapsada o no añadiendo la clase "card-collapsed-icon" al componente
   */
  @HostBinding('class.card-collapsed-icon')
  get isCollapsedIcon(): boolean {
    return (this.collapsable && this._isCollapsed() && this.iconCollpased !== '') || false;
  };

  /**
   * Evento que se emite cuando la tarjeta se colapsa o se expande
   */
  @Output() collapsed: EventEmitter<boolean> = new EventEmitter(false);

  /**
   * Indica si la tarjeta está colapsada o no
   */
  _isCollapsed: WritableSignal<boolean> = signal(false);

  /**
   * Función para colapsar o expandir la tarjeta
   * @param {Event} event Evento de click
   */
  public toggleCollapse(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this._isCollapsed.set(!this._isCollapsed());
    this.collapsed.emit(this._isCollapsed());
  }

  /**
   * Función para colapsar la tarjeta
   * @param {Event} event Evento de click
   */
  public collapse(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this._isCollapsed.set(true);
    this.collapsed.emit(true);
  }

  /**
   * Función para expandir la tarjeta
   * @param {Event} event Evento de click
   */
  public expand(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this._isCollapsed.set(false);
    this.collapsed.emit(false);
  }

  /**
   * Función para saber si la card está o no colapsada
   * @returns {boolean}
   */
  isCollapsed(): boolean {
    return this._isCollapsed();
  }
}
