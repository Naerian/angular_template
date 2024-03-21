import { Component, ElementRef, EventEmitter, HostBinding, Input, Output, ViewChild, ViewEncapsulation, WritableSignal, signal } from '@angular/core';
import { ButtonColor, ButtonMode, ButtonSize, ButtonType } from './models/button.entity';

/**
 * @name
 * neo-button
 * @description
 * Componente para crear un botón personalizado con diferentes tamaños, colores y modos.
 * @example
 * <neo-button [mode]="'button''" [color]="'red''" [size]="'xm'" (click)="clickButton($event)"></neo-button>
 */
@Component({
  selector: 'neo-button',
  host: {
    '[class.disabled]': 'disabled',
  },
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None
})
export class ButtonComponent {

  @ViewChild('btnContent') btnContent!: ElementRef;

  /**
   * Modo del botón (button, icon) de tipo `ButtonMode`
   */
  @Input() mode: ButtonMode = 'button';

  /**
   * Color del botón (primary, secondary) de tipo `ButtonColor`
   */
  @Input() color: ButtonColor = 'primary';

  /**
   * Tamaño del botón (xs, s, xm, m, l, xl) de tipo `ButtonSize`
   */
  @Input() size: ButtonSize = 'm';

  /**
   * Permite que el botón ocupe todo el ancho del contenedor padre (true, false)
   */
  @Input() disabled: boolean = false;

  /**
   * Permite que el botón ocupe todo el ancho del contenedor padre (true, false)
   */
  @Input() allWidth: boolean = false;

  /**
   * Tipo del botón (button, submit, reset) de tipo `ButtonType`
   */
  @Input() type: ButtonType = 'button';

  /**
   * Permite indicar si el botón tiene el foco (true, false)
   */
  @Input() focus: boolean = false;

  /**
   * Permite indicar si el botón es transparente (true, false)
   */
  @Input() transparent: boolean = false;

  /**
   * Título del botón
   */
  @Input()
  set title(value: string) {
    this._title.set(value);
  }
  get title(): string {
    return this._title();
  }

  /**
   * Evento que se emite al hacer click en el botón
   */
  @Output() onClick: EventEmitter<Event> = new EventEmitter();

  _title: WritableSignal<string> = signal('');

  ngAfterViewInit(): void {
    if (this._title() === '')
      this._title.set(this.btnContent?.nativeElement?.innerHTML.replace(/(<([^>]+)>)/gi, "") || '');
  }

  /**
   * Al hacer click en el botón, emitimos su evento
   * @param {Event} event
   */
  clickOnButton(event: Event) {

    if (this.disabled)
      return;

    this.onClick.emit(event);
  }
}
