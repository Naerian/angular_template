import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

/**
 * @name
 * escapeKey
 * @description
 * Directiva que permite detectar el evento de escape y emitir un evento para, por ejemplo, cerrar un modal, un menú, etc.
 * @example
 * <div escapeKey (escapeKey)="onEscapeKey($event)"></div>
 */
@Directive({
  selector: '[escapeKey]',
  standalone: true
})
export class EscapeKeyDirective {
  constructor() {}

  @Output()
  public escapeKey = new EventEmitter();

  @HostListener('keydown', ['$event'])
  _onKeydownHandler(event: KeyboardEvent) {
    const keyCode = event.key;
    if (keyCode === 'Escape') {
      this.escapeKey.emit(event);
    }
  }
}
