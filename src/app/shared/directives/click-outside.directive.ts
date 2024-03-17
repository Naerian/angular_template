import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

/**
 * @name
 * clickOutside
 * @description
 * Directiva para detectar si se ha hecho click fuera de un elemento.
 * @example
 * <div clickOutside (clickOutside)="onClickedOutside($event)"></div>
 */
@Directive({
  selector: '[clickOutside]',
  standalone: true
})
export class ClickOutsideDirective {

  constructor(private _elementRef: ElementRef) {}

  @Output()
  public clickOutside = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: any) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside)
      this.clickOutside.emit(null);
  }
}
