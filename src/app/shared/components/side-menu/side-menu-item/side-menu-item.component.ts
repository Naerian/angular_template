import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuEntity } from '../model/menu.entity';
import { MenuService } from '../services/menu.service';

/**
 * @name
 * neo-side-menu-item
 * @description
 * Componente que representa un item del menú lateral de la aplicación y que se encarga de mostrar las opciones de navegación de cada item.
 * @example
 * <neo-side-menu-item [itemMenu]="itemMenu"></neo-side-menu-item>
 */
@Component({
  selector: 'neo-side-menu-item',
  templateUrl: './side-menu-item.component.html',
  styleUrls: ['./side-menu-item.component.scss']
})
export class SideMenuItemComponent {

  /**
   * Variable para mantener abiertos varios elementos desplegables del menú a la vez.
   */
  @Input() keepMultipleOpen: boolean = false;

  /**
   * Objeto con la información del item del menú.
   */
  @Input() itemMenu: MenuEntity = {} as MenuEntity;

  /**
   * Nivel de profundiad del item del menú
   */
  @Input() depthLevel: number = 0;

  /**
   * Evento para notificar que se ha cerrado el elemento principal
   */
  @Output() closeMainItemsMenu: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  /**
   * Evento para notificar que un elemento del menú ha sido activado
   */
  @Output() setActive: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private readonly _menuService: MenuService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      if (this.router.url === this.itemMenu.route)
        this.activeItemMenu(this.itemMenu);
    });
  }

  /**
   * Método para manejar el evento de click en un item del menú.
   * @param {MenuEntity} item
   */
  handleClick(item: MenuEntity): void {

    this.shrinkItems(item);
    item.expanded = !item.expanded;

    if (this.depthLevel === 0)
      this.closeMainItemsMenu.emit(true);
    else
      this.activeItemMenu(item);
  }

  /**
   * Método para activar un item del menú y desactivar el resto de items
   * @param {MenuEntity} item
   */
  activeItemMenu(item: MenuEntity): void {

    item.active = true;
    item.expanded = true;

    const menu: MenuEntity[] = this._menuService.getMenu() || [];
    this.deactivateItemsMenu(menu, item);

    if (this.depthLevel !== 0)
      this.setActive.emit();
    else
      this.shrinkItems(item);
  }

  /**
   * Método para desactivar el resto de items del menú
   * @param {MenuEntity[]} items
   * @param {MenuEntity} currentItem
   */
  deactivateItemsMenu(items: MenuEntity[], currentItem: MenuEntity): void {
    for (let modelItem of items || []) {
      if (currentItem !== modelItem && modelItem.active) {
        modelItem.active = false;
        if (modelItem.childrens && modelItem.childrens.length > 0)
          this.deactivateItemsMenu(modelItem.childrens, currentItem);
      }
    }
  }

  /**
   * Método para expandir o contraer los elementos desplegables del menú
   * @param {MenuEntity} item
   */
  shrinkItems(item: MenuEntity): void {
    if (!this.keepMultipleOpen) {

      let menu: MenuEntity[] = [];

      if (this.depthLevel === 0)
        menu = this._menuService.getMenu() || [];
      else
        menu = this.itemMenu.childrens || [];

      for (let modelItem of menu || []) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
          modelItem.active = false;
        }
      }
    }
  }
}
