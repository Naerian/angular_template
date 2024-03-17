import { Directive, ElementRef, HostListener } from "@angular/core";

/**
 * @name
 * clickable
 * @description
 * Con esta directiva permitimos que un elemento sea "interactuable" tanto mediante un click normal de ratón,
 * como al posicionarnos encima tabulando (de ahí el tabindex=0), y pulsar enter / space para ello.
 * Podemos usar, junto con esta, la propia directiva "(click)" para ejecutar lo que queramos
 * @example
 * <button clickable (click)="doSomething()">Click me!</button>
 */
@Directive({
  selector: "[clickable]",
  host: {
    "tabindex": "0",
    "role": "button"
  },
  standalone: true
})
export class ClickableDirective {

  constructor(protected eleRef: ElementRef) { }

  @HostListener('keydown.enter', ["$event"])
  @HostListener('keydown.space', ["$event"])
  public onClickElement(): void {
    this.eleRef.nativeElement.click();
  }

}
