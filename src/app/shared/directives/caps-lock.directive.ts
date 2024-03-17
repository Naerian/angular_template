import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * @name
 * pesCapsLock
 * @description
 * Directiva para detectar si la tecla de bloqueo de mayúsculas está activada.
 * @example
 * <input pesCapsLock (capsLock)="onCapsLock($event)">
 */
@Directive({
  selector: '[pesCapsLock]',
  standalone: true
})
export class CapsLockDirective {

  @Output('capsLock') capsLock = new EventEmitter<boolean>();

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keyup', ['$event'])
  @HostListener('window:click', ['$event'])
  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  checkCapsLock(event: KeyboardEvent): void {
    this.capsLock.emit(event.getModifierState && event.getModifierState('CapsLock'));
  }
}
