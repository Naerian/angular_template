import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DropdownManagerService {
  // Este subject actuará como un emisor de eventos.
  // Emitirá una referencia al componente que se acaba de abrir.
  // Los demás componentes se suscribirán a este Observable para recibir notificaciones.
  // En este caso, notificará cuando un dropdown (select) se abra.
  // Esto es útil para manejar la lógica de apertura/cierre de dropdown (select) en toda la aplicación.
  // Por ejemplo, si un dropdown (select) se abre, los demás dropdown (select) pueden cerrarse automáticamente.
  // Esto ayuda a evitar que múltiples dropdown (select) estén abiertos al mismo tiempo, lo que
  // puede ser confuso para el usuario.
  private dropdownOpenedSource = new Subject<any>();

  // Los demás componentes se suscribirán a este Observable para recibir notificaciones.
  public dropdownOpened$ = this.dropdownOpenedSource.asObservable();

  /**
   * Notifica a todos los suscriptores que un dropdown (select) se ha abierto.
   * @param componentInstance La instancia del componente que se abre.
   */
  public notifyOpened(componentInstance: any): void {
    this.dropdownOpenedSource.next(componentInstance);
  }
}
