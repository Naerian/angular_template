import { Component, Input, Signal, computed, signal } from '@angular/core';
import {
  DEFAULT_MENU_POSITION,
  MenuEntity,
  SideMenuPosition,
} from './model/menu.entity';
import { MenuService } from './services/menu.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { FADE_IN_OUT_MENU } from './animations/fade-in-out.animation';
import { SLIDE_BY_POSITION } from './animations/slide-by-position.animation';
import { FADE_IN_OUT } from '@shared/animations/fade-in-out.animation';

/**
 * @name
 * neo-side-menu
 * @description
 * Componente que representa el menú lateral de la aplicación y que se encarga de mostrar las opciones de navegación mediante el componente `neo-side-menu-item` de su interior.
 * @example
 * <neo-side-menu></neo-side-menu>
 */
@Component({
  selector: 'neo-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  host: {
    class: 'neo-side-menu',
    '[class.neo-side-menu--left]': 'position === LEFT_MENU_POSITION',
    '[class.neo-side-menu--right]': 'position === RIGHT_MENU_POSITION',
    '[class.neo-side-menu--opened]': 'isMenuOpened()',
    '[class.neo-side-menu--closed]': '!isMenuOpened()',
  },
  animations: [FADE_IN_OUT, SLIDE_BY_POSITION],
})
export class SideMenuComponent {
  LEFT_MENU_POSITION = SideMenuPosition.LEFT;
  RIGHT_MENU_POSITION = SideMenuPosition.RIGHT;

  /**
   * Input para mantener abiertos varios elementos desplegables del menú a la vez.
   */
  @Input() keepMultipleOpen: boolean = false;

  /**
   * Input para establecer la posición del menú lateral de la aplicación. Por defecto es `SideMenuPosition.LEFT`.
   */
  @Input() position: SideMenuPosition = DEFAULT_MENU_POSITION;

  menu: MenuEntity[] = [];
  isMenuOpened: Signal<boolean> = signal(false);

  constructor(
    private readonly _menuService: MenuService,
    private readonly router: Router,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.closeSideMenu());
  }

  ngOnInit() {
    this.isMenuOpened = computed(() => this._menuService.isMenuVisible());
    this.getMenu();
  }

  /**
   * Método para obtener el menú de la aplicación y guardarlo en la variable `menu`.
   * Este método se ejecuta al inicializar el componente.
   */
  getMenu() {
    this.menu = this._menuService.getMenu();
  }

  /**
   * Método para cerrar o abrir el menú lateral de la aplicación.
   */
  toogleMenu() {
    this._menuService.toggle();
  }

  /**
   * Método para cerrar el menú lateral de la aplicación.
   */
  closeSideMenu() {
    this._menuService.close();
  }

  /**
   * Método para expandir o contraer los elementos desplegables del menú
   * @param {MenuEntity} item
   */
  shrinkItems(item: MenuEntity): void {
    if (!this.keepMultipleOpen) {
      for (let modelItem of this.menu) {
        if (item.label !== modelItem.label && modelItem.expanded) {
          modelItem.expanded = false;
          modelItem.active = false;
        }
      }
    }
  }
}
