import { Injectable, Renderer2, RendererFactory2, WritableSignal, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { DARK_THEME, LIGHT_THEME, PREFIX_THEME_CLASS, ThemeType } from '../model/theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemesService {

  private renderer: Renderer2;
  private colorScheme: WritableSignal<ThemeType> = signal(LIGHT_THEME);

  constructor(rendererFactory: RendererFactory2) {
    // Crea un nuevo renderizador desde renderFactory, para que sea posible usar renderer2 en un servicio
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Función para detectar si el navegador admite `prefers-color-scheme` y establecer el tema en consecuencia
   * - Si el navegador admite `prefers-color-scheme`, establecemos el tema en función del tema del sistema operativo o del navegador
   * - Si el navegador no admite `prefers-color-scheme`, establecer el tema claro por defecto
   */
  private _detectPrefersColorScheme() {
    if (window.matchMedia('(prefers-color-scheme)').media !== 'not all')
      this.setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_THEME : LIGHT_THEME);
    else
      this.setTheme(LIGHT_THEME);
  }

  /**
   * Función para establecer el tema en el servicio y en localStorage
   * @param {ThemeType} scheme - Tema a establecer
   */
  private _setColorScheme(scheme: ThemeType) {
    this.colorScheme.set(scheme);
    localStorage.setItem(environment.THEME_STORAGE_KEY, scheme);
  }

  /**
   * Función para obtener el tema del localStorage o del sistema operativo
   * - Si el tema del localStorage existe, lo establecemos.
   * - Si no, detectamos el tema del sistema operativo o del navegador.
   */
  private _getColorScheme() {

    // Obtenemos el tema del localStorage si existe
    const localStorageColorScheme: ThemeType | null = (localStorage.getItem(environment.THEME_STORAGE_KEY) as ThemeType) || null;

    // Si el tema del localStorage existe, lo establecemos. Si no, detectamos el tema del sistema operativo
    if (localStorageColorScheme) {
      this.colorScheme.set(localStorageColorScheme);
    } else {
      this._detectPrefersColorScheme();
    }
  }

  /**
   * Función para inicializar el tema en el servicio y establecer la clase correspondiente en el body
   */
  initTheme() {
    this._getColorScheme();
    this.renderer.addClass(document.body, PREFIX_THEME_CLASS + this.colorScheme());
  }

  /**
   * Función para establecer el tema en el servicio y establecer la clase correspondiente en el body.
   * Esta función se usa para cambiar el tema manualmente desde el componente `theme-toggle`
   * @param scheme
   */
  setTheme(scheme: ThemeType) {
    this._setColorScheme(scheme);
    this.renderer.removeClass(document.body, PREFIX_THEME_CLASS + (this.colorScheme() === DARK_THEME ? LIGHT_THEME : DARK_THEME));
    this.renderer.addClass(document.body, PREFIX_THEME_CLASS + scheme);
  }

  /**
   * Función para obtener el tema actual
   * @returns {ThemeType}
   */
  getCurrentTheme(): ThemeType {
    return this.colorScheme();
  }

}
