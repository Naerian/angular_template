import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Component, Input, WritableSignal, signal } from '@angular/core';
import { ButtonColor, ButtonSize } from '../button/models/button.entity';

/**
 * @name
 * neo-menu-context
 * @description
 * Componente para crear un menú contextual junto con el componente `neo-item-menu-context`.
 * @example
 * <neo-menu-context [icon]="'ri-more-2-fill'" [size]="'xm'" [title]="'Título'">
 *    <neo-item-menu-context [title]='Título diferente al contenido'>Test 1</neo-item-menu-context>
 *    <neo-item-menu-context>Test 2</neo-item-menu-context>
 * </neo-menu-context>
 */
@Component({
  selector: 'neo-menu-context',
  templateUrl: './menu-context.component.html',
  styleUrls: ['./menu-context.component.scss'],
})
export class MenuContextComponent {

  /**
   * Input que recibe el icono del menú, por defecto es 'ri-more-2-fill'
   */
  @Input() icon: string = 'ri-more-2-fill';

  /**
   * Input que recibe el color del icono del menú, por defecto es 'primary'
   */
  @Input() color: ButtonColor = 'primary';

  /**
   * Input que recibe el tamaño del icono del menú, por defecto es 'xm'
   */
  @Input() size: ButtonSize = 'xm';

  /**
   * Input que recibe el color del icono del menú, por defecto es 'primary'
   */
  @Input() transparent: boolean = true;

  /**
   * Input que recibe el título del menú
   */
  @Input() title: string = '';

  isMenuContextOpened: WritableSignal<boolean> = signal(false);
  scrollStrategy: ScrollStrategy;

  constructor(
    scrollStrategyOptions: ScrollStrategyOptions
  ) {
    this.scrollStrategy = scrollStrategyOptions.close();
  }

  /**
   * Función para cerrar el menú contextual
   */
  close() {
    this.isMenuContextOpened.set(false);
  }

  /**
   * Función para abrir o cerrar el menú contextual
   * @param {Event} event
   */
  toggleMenuContext(event: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.isMenuContextOpened.set(!this.isMenuContextOpened());
  }

}
