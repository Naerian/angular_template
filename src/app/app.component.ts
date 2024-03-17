import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ThemesService } from '@shared/components/theme-toggle/service/themes.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MenuService } from '@shared/components/side-menu/services/menu.service';
import MENU_ITEMS from '@config/menu.conf';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CdkScrollable],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  isAuthenticated: boolean = false;

  constructor(
    private readonly _menuService: MenuService,
    private readonly _themeService: ThemesService,
    private readonly _translateService: TranslateService,
  ) {
    this._menuService.setMenu(MENU_ITEMS);
    this._translateService.setDefaultLang('es');
    this._themeService.initTheme();
  }


}
