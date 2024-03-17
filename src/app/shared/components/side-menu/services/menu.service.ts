import { Injectable, WritableSignal, signal } from '@angular/core';
import { MenuEntity } from '../model/menu.entity';

/**
 * Servicio que se encarga de gestionar el menú lateral de la aplicación.
 */
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private _isMenuVisible: WritableSignal<boolean> = signal(false);
  currentMenu: MenuEntity[] = [];

  constructor() { }

  /**
   * Método para obtener el menú de la aplicación y guardarlo en la variable `currentMenu`.
   */
  setMenu(menu: MenuEntity[]): void {
    this.currentMenu = menu;
  }

  /**
   * Método para obtener el menú de la aplicación
   * @returns {MenuEntity[]} Array con la estructura del menú de la aplicación.
   */
  getMenu(): MenuEntity[] {
    return this.currentMenu || [];
  }

  /**
   * Método para obtener si el menú lateral de la aplicación está visible o no.
   * @returns {boolean} Indica si el menú lateral de la aplicación está visible o no.
   */
  public isMenuVisible(): boolean {
    return this._isMenuVisible();
  }

  /**
   * Método para establecer si el menú lateral de la aplicación está visible o no.
   * @param isVisible
   */
  private setMenuVisibility(isVisible: boolean): void {
    this._isMenuVisible.set(isVisible);
  }

  /**
   * Método para cerrar el menú lateral de la aplicación.
   */
  close() {
    this.setMenuVisibility(false);
  }

  /**
   * Método para abrir el menú lateral de la aplicación.
   */
  open() {
    this.setMenuVisibility(true);
  }
  /**
   * Método para abrir o cerrar el menú lateral de la aplicación.
   */
  toggle() {
    this.setMenuVisibility(!this._isMenuVisible());
  }
}
