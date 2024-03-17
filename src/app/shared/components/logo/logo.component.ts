import { Component, Injector, Input, Signal, computed, effect, signal } from '@angular/core';
import { ThemesService } from '../theme-toggle/service/themes.service';
import { ThemeType, LIGHT_THEME } from '../theme-toggle/model/theme.entity';
import { LOGO, LOGO_DARK, LOGO_SMALL, LOGO_SMALL_DARK, LogoSize } from './models/logo.entity';

/**
 * @name
 * neo-logo
 * @description
 * Componente para crear el logo de la aplicación con el tamaño deseado
 * @example
 * <neo-logo size="s" link="/"></neo-logo>
 */
@Component({
  selector: 'neo-logo',
  standalone: true,
  imports: [],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {

  /**
   * Tamaño del logo (s, m) de tipo `LogoSize`
   */
  @Input() size: LogoSize = 'm';

  /**
   * Enlace al que redirige el logo
   */
  @Input() link: string = '/';

  logo: string = LOGO;
  logoSmall: string = LOGO_SMALL;

  theme: Signal<ThemeType> = signal(LIGHT_THEME);

  constructor(
    private readonly injector: Injector,
    private readonly _themesService: ThemesService
  ) { }

  ngOnInit() {

    this.theme = computed(() => this._themesService.getCurrentTheme());

    // Cuando el tema cambie, cambiamos el logo
    effect(() => {
      switch (this.theme()) {
        case LIGHT_THEME:
          this.logo = LOGO;
          this.logoSmall = LOGO_SMALL;
          break;
        default:
          this.logo = LOGO_DARK
          this.logoSmall = LOGO_SMALL_DARK;
          break;
      }
    }, { injector: this.injector, allowSignalWrites: true });
  }

}
