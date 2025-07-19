import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuContextComponent } from '../../menu-context.component';

@Injectable({ providedIn: 'root' })
export class MenuContextManagerService {
  // Este subject actuará como un emisor de eventos.
  // Emitirá una referencia al componente que se acaba de abrir.
  // Los demás componentes se suscribirán a este Observable para recibir notificaciones.
  // En este caso, notificará cuando un menu-context se abra.
  // Esto es útil para manejar la lógica de apertura/cierre de menu-context en toda la aplicación.
  // Por ejemplo, si un menu-context se abre, los demás menu-context pueden cerrarse automáticamente.
  // Esto ayuda a evitar que múltiples menu-context estén abiertos al mismo tiempo, lo que
  // puede ser confuso para el usuario.
  private menuContextOpenedSource = new Subject<any>();

  // Los demás componentes se suscribirán a este Observable para recibir notificaciones.
  public menuContextOpened$ = this.menuContextOpenedSource.asObservable();

  /**
   * Notifica a todos los suscriptores que un menu-context se ha abierto.
   * @param componentInstance La instancia del componente que se abre.
   */
  public notifyOpened(componentInstance: MenuContextComponent): void {
    this.menuContextOpenedSource.next(componentInstance);
  }
}
