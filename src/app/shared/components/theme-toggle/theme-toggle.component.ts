import {
  Component,
  Input,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DARK_THEME, LIGHT_THEME } from './model/theme.model';
import { ThemesService } from './service/themes.service';
import { ComponentColor, ComponentSize } from '@shared/configs/component.model';
import { NEOUI_COMPONENT_CONFIG } from '@shared/configs/component.config';
import { DEFAULT_COLOR, DEFAULT_SIZE } from '@shared/configs/component.consts';

/**
 * @name
 * neo-theme-toggle
 * @description
 * Componente para crear un toggle de tema mediante un botón y el servicio `ThemesService`.
 * @example
 * <neo-theme-toggle color='primary' size='m'></neo-theme-toggle>
 */
@Component({
  selector: 'neo-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
  LIGHT_THEME = LIGHT_THEME;
  DARK_THEME = DARK_THEME;

  _color: WritableSignal<ComponentColor> = signal(DEFAULT_COLOR);
  @Input()
  set color(value: ComponentColor) {
    this._color.set(value || this.globalConfig.defaultColor || DEFAULT_COLOR);
  }
  get color(): ComponentColor {
    return this._color();
  }

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

  currentTheme: Signal<string> = signal(LIGHT_THEME);

  private readonly _themesService = inject(ThemesService);
  private readonly globalConfig = inject(NEOUI_COMPONENT_CONFIG);

  constructor() {
    // Inicializamos los atributos por defecto
    this._size.set(this.globalConfig.defaultSize || DEFAULT_SIZE);
    this._color.set(this.globalConfig.defaultColor || DEFAULT_COLOR);
    this._transparent.set(this.globalConfig.transparentButton || true);
  }

  ngOnInit(): void {
    this.currentTheme = computed(() => this._themesService.getCurrentTheme());
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
   * Método para alternar el tema entre claro y oscuro.
   * @param {Event} event - Evento de clic para cambiar el tema.
   */
  toggleTheme(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (this._themesService.getCurrentTheme() === LIGHT_THEME)
      this._themesService.setTheme(DARK_THEME);
    else this._themesService.setTheme(LIGHT_THEME);
  }
}
