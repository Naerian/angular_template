import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DatePickerManagerService {
  // Este subject actuará como un emisor de eventos.
  // Emitirá una referencia al componente que se acaba de abrir.
  // Los demás componentes se suscribirán a este Observable para recibir notificaciones.
  // En este caso, notificará cuando un date-picker se abra.
  // Esto es útil para manejar la lógica de apertura/cierre de date-pickers en toda la aplicación.
  // Por ejemplo, si un date-picker se abre, los demás date-pickers pueden cerrarse automáticamente.
  // Esto ayuda a evitar que múltiples date-pickers estén abiertos al mismo tiempo, lo que
  // puede ser confuso para el usuario.
  private datePickerOpenedSource = new Subject<any>();

  // Los demás componentes se suscribirán a este Observable para recibir notificaciones.
  public datePickerOpened$ = this.datePickerOpenedSource.asObservable();

  /**
   * Notifica a todos los suscriptores que un date-picker se ha abierto.
   * @param componentInstance La instancia del componente que se abre.
   */
  public notifyOpened(componentInstance: any): void {
    this.datePickerOpenedSource.next(componentInstance);
  }
}
