import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ActionMenuComponent } from '../../action-menu.component';

@Injectable({ providedIn: 'root' })
export class ActionMenuManagerService {
  // Este subject actuará como un emisor de eventos.
  // Emitirá una referencia al componente que se acaba de abrir.
  // Los demás componentes se suscribirán a este Observable para recibir notificaciones.
  // En este caso, notificará cuando un action-menu se abra.
  // Esto es útil para manejar la lógica de apertura/cierre de action-menu en toda la aplicación.
  // Por ejemplo, si un action-menu se abre, los demás action-menu pueden cerrarse automáticamente.
  // Esto ayuda a evitar que múltiples action-menu estén abiertos al mismo tiempo, lo que
  // puede ser confuso para el usuario.
  private actionMenuOpenedSource = new Subject<any>();

  // Los demás componentes se suscribirán a este Observable para recibir notificaciones.
  public actionMenuOpened$ = this.actionMenuOpenedSource.asObservable();

  /**
   * Notifica a todos los suscriptores que un action-menu se ha abierto.
   * @param componentInstance La instancia del componente que se abre.
   */
  public notifyOpened(componentInstance: ActionMenuComponent): void {
    this.actionMenuOpenedSource.next(componentInstance);
  }
}
