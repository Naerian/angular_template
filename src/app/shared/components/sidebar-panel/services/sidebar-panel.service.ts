import { Injectable, Inject } from '@angular/core';
import { SidebarbarPanelEntity } from '../models/sidebar-panel.entity';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarPanelService {

  private readonly _isPanelVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _sidebarPanelContent: BehaviorSubject<SidebarbarPanelEntity | null> = new BehaviorSubject<SidebarbarPanelEntity | null>(null);

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  /**
   * Método para comprobar si el panel está visible
   * @returns {Observable<boolean>}
   */
  public isPanelVisible(): Observable<boolean> {
    return this._isPanelVisible.asObservable();
  }

  /**
   * Método para establecer la visibilidad del panel
   * @param {boolean} isVisible
   */
  private setPanelVisibility(isVisible: boolean): void {
    this._isPanelVisible.next(isVisible);
  }

  /**
   * Método para comprobar si el panel está visible
   * @returns {boolean}
   */
  private isPanelVisibleValue(): boolean {
    return this._isPanelVisible.value;
  }

  /**
   * Método para comprobar si el contenido del panel ha cambiado
   * @returns {Observable<SidebarbarPanelEntity | null>}
   */
  public panelContentChanged(): Observable<SidebarbarPanelEntity | null> {
    return this._sidebarPanelContent.asObservable();
  }

  /**
   * Método para obtener el contenido del panel
   * @returns {SidebarbarPanelEntity | null}
   */
  public getPanelContent(): SidebarbarPanelEntity | null {
    return this._sidebarPanelContent.value;
  }

  /**
   * Método para establecer el contenido del panel
   * @param {SidebarbarPanelEntity | null} data
   */
  private setPanelContent(data: SidebarbarPanelEntity | null): void {
    this._sidebarPanelContent.next(data);
  }

  /**
   * Método para abrir el panel con un contenido
   * @param {SidebarbarPanelEntity} data
   */
  public open(data?: SidebarbarPanelEntity): void {

    this.setPanelVisibility(true);
    this.document.body.classList.remove('sidebar-opened');
    this.document.body.classList.add('sidebar-opened');

    setTimeout(() => {
      if (data && Object.keys(data).length > 0)
        this.setPanelContent(data);
    }, 0);
  }

  /**
   * Método para cerrar el panel
   */
  public close(): void {
    this.setPanelVisibility(false);
    this.setPanelContent(null);
    this.document.body.classList.remove('sidebar-opened');
  }

}
