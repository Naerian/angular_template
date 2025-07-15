import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DropdownManagerService {
  // Este subject actuará como un emisor de eventos.
  // Emitirá una referencia al componente que se acaba de abrir.
  // Los demás componentes se suscribirán a este Observable para recibir notificaciones.
  // En este caso, notificará cuando un dropdown se abra.
  // Esto es útil para manejar la lógica de apertura/cierre de dropdown en toda la aplicación.
  // Por ejemplo, si un dropdown se abre, los demás dropdown pueden cerrarse automáticamente.
  // Esto ayuda a evitar que múltiples dropdown estén abiertos al mismo tiempo, lo que
  // puede ser confuso para el usuario.
  private dropdownOpenedSource = new Subject<any>();

  // Los demás componentes se suscribirán a este Observable para recibir notificaciones.
  public dropdownOpened$ = this.dropdownOpenedSource.asObservable();

  /**
   * Notifica a todos los suscriptores que un dropdown se ha abierto.
   * @param componentInstance La instancia del componente que se abre.
   */
  public notifyOpened(componentInstance: any): void {
    this.dropdownOpenedSource.next(componentInstance);
  }
}
