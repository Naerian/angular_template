import { CommonModule } from '@angular/common';
import { Component, Signal, computed, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@services/auth/auth.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { SidebarPanelComponent } from '@shared/components/sidebar-panel/sidebar-panel.component';
import { RouterOutlet } from '@angular/router';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { ClickableDirective } from '@shared/directives/clickable.directive';
import { BreadcrumComponent } from '@shared/components/breadcrum/breadcrum.component';
import { FullscreenToggleComponent } from '@shared/components/fullscreen-toggle/fullscreen-toggle.component';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { ThemeToggleModule } from '@shared/components/theme-toggle/theme-toggle.module';
import { SideMenuModule } from '@shared/components/side-menu/side-menu.module';
import { MenuService } from '@shared/components/side-menu/services/menu.service';

@Component({
  selector: 'neo-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, BreadcrumComponent ,LogoComponent, CdkScrollable, SideMenuModule, ButtonComponent, ThemeToggleModule, FullscreenToggleComponent, SidebarPanelComponent, RouterOutlet, ClickableDirective]
})
export class MainComponent {


  isMenuOpened: Signal<boolean> = signal(false);

  constructor(
    private readonly _authService: AuthService,
    private readonly _menuService: MenuService
  ) {

  }

  ngOnInit(): void {
    this.isMenuOpened = computed(() => this._menuService.isMenuVisible());
  }

  logout() {
    this._authService.logout();
  }

  toggleMenu() {
    this._menuService.toggle();
  }

}
