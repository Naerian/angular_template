import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { ButtonMode, ButtonType } from './models/button.model';
import { NEOUI_COMPONENT_CONFIG } from '@shared/configs/component.config';
import { ComponentColor, ComponentSize } from '@shared/configs/component.model';
import { DEFAULT_COLOR, DEFAULT_SIZE } from '@shared/configs/component.consts';

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
    '[class.all-width]': 'allWidth',
  },
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
})
export class ButtonComponent implements AfterViewInit, OnInit {
  @ViewChild('btnContent') btnContent!: ElementRef;

  /**
   * Color del botón
   */
  _color: WritableSignal<ComponentColor> = signal(DEFAULT_COLOR);
  @Input()
  set color(value: ComponentColor) {
    this._color.set(value || this.globalConfig.defaultColor || DEFAULT_COLOR);
  }
  get color(): ComponentColor {
    return this._color();
  }

  /**
   * Tamaño del botón
   */
  _size: WritableSignal<ComponentSize> = signal(DEFAULT_SIZE);
  @Input()
  set size(value: ComponentSize) {
    this._size.set(value || this.globalConfig.defaultSize || DEFAULT_SIZE);
  }
  get size(): ComponentSize {
    return this._size();
  }

  _transparent: WritableSignal<boolean> = signal(false);
  @Input()
  set transparent(value: boolean) {
    this._transparent.set(value || this.globalConfig.transparentButton || false);
  }
  get transparent(): boolean {
    return this._transparent();
  }

  /**
   * Título del botón
   */
  _title: WritableSignal<string> = signal('');
  @Input()
  set title(value: string) {
    this._title.set(value);
  }
  get title(): string {
    return this._title();
  }

  /**
   * Modo del botón
   */
  @Input() mode: ButtonMode = 'button';

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
   * Evento que se emite al hacer click en el botón
   */
  @Output() onClick: EventEmitter<Event> = new EventEmitter();

  private readonly globalConfig = inject(NEOUI_COMPONENT_CONFIG);
  private readonly elementRef = inject(ElementRef);

  constructor() {
    // Inicializamos los atributos por defecto
    this._size.set(this.globalConfig.defaultSize || DEFAULT_SIZE);
    this._color.set(this.globalConfig.defaultColor || DEFAULT_COLOR);
    this._transparent.set(this.globalConfig.transparentButton || false);
  }

  ngOnInit(): void {
    this.setProperties();
  }

  ngAfterViewInit(): void {
    if (this.getTitle() === '')
      this._title.set(
        this.btnContent?.nativeElement?.innerHTML
          .replace(/(<([^>]+)>)/gi, '')
          .trim() || '',
      );
  }

  /**
   * Método para establecer las propiedades por defecto del componente.
   */
  setProperties() {
    if (this.size) this._size.set(this.size);
    if (this.color) this._color.set(this.color);
    if (this.transparent) this._transparent.set(this.transparent);
  }

  /**
   * Al hacer click en el botón, emitimos su evento
   * @param {Event} event
   */
  clickOnButton(event: Event) {
    if (this.disabled) return;

    this.onClick.emit(event);
  }

  /**
   * Función para obtener el título del botón
   */
  getTitle(): string {
    return this._title();
  }

  /**
   * Método para obtener el elemento HTML del botón.
   */
  get nativeElement(): HTMLButtonElement {
    return this.elementRef.nativeElement;
  }
}
