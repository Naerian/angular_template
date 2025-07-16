import {
  Component,
  HostListener,
  Inject,
  Input,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentColor, ComponentSize } from '@shared/configs/component.model';
import { NEOUI_COMPONENT_CONFIG } from '@shared/configs/component.config';
import { DEFAULT_COLOR, DEFAULT_SIZE } from '@shared/configs/component.consts';

@Component({
  selector: 'neo-fullscreen-toggle',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonComponent],
  templateUrl: './fullscreen-toggle.component.html',
})
export class FullscreenToggleComponent {
  _transparent: WritableSignal<boolean> = signal(true);
  @Input()
  set transparent(value: boolean) {
    this._transparent.set(value || this.globalConfig.transparentButton || true);
  }
  get transparent(): boolean {
    return this._transparent();
  }

  _size: WritableSignal<ComponentSize> = signal(DEFAULT_SIZE);
  @Input()
  set size(value: ComponentSize) {
    this._size.set(value || this.globalConfig.defaultSize || DEFAULT_SIZE);
  }
  get size(): ComponentSize {
    return this._size();
  }

  _color: WritableSignal<ComponentColor> = signal(DEFAULT_COLOR);
  @Input()
  set color(value: ComponentColor) {
    this._color.set(value || this.globalConfig.defaultColor || DEFAULT_COLOR);
  }
  get color(): ComponentColor {
    return this._color();
  }

  isFullScreen: WritableSignal<boolean> = signal(false);
  docElement!: HTMLElement;

  /**
   * Listener al pulsar la tecla `F11` para cambiar el estado de pantalla completa
   * @param {KeyboardEvent} event
   */
  @HostListener('document:keydown.F11', ['$event'])
  onKeyF11(event: KeyboardEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    this.toggleFullScreen();
  }

  /**
   * Listener para detectar el cambio de pantalla completa y cambiar el estado
   */
  @HostListener('document:fullscreenchange')
  @HostListener('document:webkitfullscreenchange')
  @HostListener('document:mozfullscreenchange')
  @HostListener('document:MSFullscreenChange')
  screenChange() {
    this.isFullScreen.set(!this.isFullScreen());
  }

  private readonly globalConfig = inject(NEOUI_COMPONENT_CONFIG);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.docElement = document.documentElement;

    // Inicializamos los atributos por defecto
    this._size.set(this.globalConfig.defaultSize || DEFAULT_SIZE);
    this._color.set(this.globalConfig.defaultColor || DEFAULT_COLOR);
    this._transparent.set(this.globalConfig.transparentButton || true);
  }

  ngOnInit(): void {
    this.setProperties();
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
   * Función para comprobar si la pantalla está en modo completo o no y cambiar el estado
   */
  toggleFullScreen() {
    if (!this.isFullScreen()) this.docElement?.requestFullscreen();
    else this.document?.exitFullscreen();
  }
}
