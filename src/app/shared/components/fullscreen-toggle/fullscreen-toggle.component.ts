import {
  Component,
  HostListener,
  Inject,
  Input,
  WritableSignal,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ButtonColor, ButtonSize } from '../button/models/button.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'neo-fullscreen-toggle',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonComponent],
  templateUrl: './fullscreen-toggle.component.html',
})
export class FullscreenToggleComponent {
  @Input() color: ButtonColor = 'primary';
  @Input() size: ButtonSize = 'm';
  @Input() transparent: boolean = true;
  isFullScreen: WritableSignal<boolean> = signal(false);
  docElement!: HTMLElement;

  /**
   * Función al pulsar la tecla `F11` para cambiar el estado de pantalla completa
   * @param {KeyboardEvent} event
   */
  @HostListener('document:keydown.F11', ['$event'])
  onKeyF11(event: KeyboardEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    this.toggleFullScreen();
  }

  /**
   * Función para detectar el cambio de pantalla completa y cambiar el estado
   * @param {Event} event
   */
  @HostListener('document:fullscreenchange')
  @HostListener('document:webkitfullscreenchange')
  @HostListener('document:mozfullscreenchange')
  @HostListener('document:MSFullscreenChange')
  screenChange() {
    this.isFullScreen.set(!this.isFullScreen());
  }

  constructor(@Inject(DOCUMENT) readonly document: any) {
    this.docElement = document.documentElement;
  }

  /**
   * Función para comprobar si la pantalla está en modo completo o no y cambiar el estado
   */
  toggleFullScreen() {
    if (!this.isFullScreen()) this.docElement?.requestFullscreen();
    else document?.exitFullscreen();
  }
}
