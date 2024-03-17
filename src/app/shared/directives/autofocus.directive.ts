import { AfterContentInit, Directive, ElementRef, Input } from "@angular/core";

/**
 * @name
 * autoFocus
 * @description
 * Directiva para hacer focus en un elemento de forma automática.
 * @example
 * <input type='text' autoFocus/>
 * <button autoFocus>Botón</button>
 */
@Directive({
  selector: "[autoFocus]",
  standalone: true
})
export class AutofocusDirective implements AfterContentInit {

  public constructor(private el: ElementRef) { }

  public ngAfterContentInit() {
    setTimeout(() => this.el.nativeElement.focus(), 100);
  }
}
