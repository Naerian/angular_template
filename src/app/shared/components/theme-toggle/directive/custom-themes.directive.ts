import { Directive, HostBinding, Injector, OnInit, Signal, computed, effect, signal } from '@angular/core';
import { ThemesService } from '@shared/components/theme-toggle/service/themes.service';
import { LIGHT_THEME } from '../model/theme.entity';

/**
 * @name
 * theme
 * @description
 * Directiva que asignará el tema por actual mediante una clase a un div o cualquier otro elemento HTML que se le asigne
 * @example
 * <div theme></div>
 */
@Directive({
  selector: '[theme]',
  standalone: true,
})
export class CustomThemesDirective implements OnInit {

  @HostBinding('class') classTheme = LIGHT_THEME; // Por defecto el tema es light
  _classTheme: Signal<string> = signal(LIGHT_THEME);

  constructor(
    private readonly injector: Injector,
    private readonly _themeService: ThemesService
  ) { }

  ngOnInit() {
    this._classTheme = computed(() => this._themeService.getCurrentTheme());
    effect(() => this.classTheme = this._classTheme(), { injector: this.injector });
  }
}
