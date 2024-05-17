import { Component, Input, Signal, computed, signal } from '@angular/core';
import { DARK_THEME, LIGHT_THEME } from './model/theme.entity';
import { ThemesService } from './service/themes.service';
import { ButtonColor, ButtonSize } from '../button/models/button.entity';

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

  @Input() color: ButtonColor = 'primary';
  @Input() size: ButtonSize = 'm';
  @Input() transparent: boolean = true;
  currentTheme: Signal<string> = signal(LIGHT_THEME);

  constructor(
    private readonly _themesService: ThemesService
  ) { }

  ngOnInit(): void {
    this.currentTheme = computed(() => this._themesService.getCurrentTheme());
  }

  toggleTheme(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (this._themesService.getCurrentTheme() === LIGHT_THEME)
      this._themesService.setTheme(DARK_THEME);
    else
      this._themesService.setTheme(LIGHT_THEME);
  }

}
