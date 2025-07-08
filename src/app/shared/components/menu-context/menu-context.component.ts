import { Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { FADE_IN_OUT_SCALE } from '@shared/animations/fade-in-out-scale.animation';
import { Subject, takeUntil } from 'rxjs';
import { ButtonColor, ButtonSize } from '../button/models/button.model';
import { OVERLAY_POSITIONS } from './models/menu-context.model';
import { MenuContextManagerService } from './services/menu-context-manager/menu-context-manager.service';

/**
 * @name
 * neo-menu-context
 * @description
 * Componente para crear un menú contextual junto con el componente `neo-item-menu-context`.
 * @example
 * <neo-menu-context [icon]="'ri-more-2-fill'" [size]="'xm'" [title]="'Título'">
 *    <neo-item-menu-context [title]='Título diferente al contenido'>Test 1</neo-item-menu-context>
 *    <neo-item-menu-context>Test 2</neo-item-menu-context>
 * </neo-menu-context>
 */
@Component({
  selector: 'neo-menu-context',
  templateUrl: './menu-context.component.html',
  styleUrls: ['./menu-context.component.scss'],
  animations: [FADE_IN_OUT_SCALE],
})
export class MenuContextComponent {
  @ViewChild('menuContext', { read: ElementRef })
  menuContextOverlayRef!: ElementRef;

  /**
   * Input que recibe el icono del menú, por defecto es 'ri-more-2-fill'
   */
  @Input() icon: string = 'ri-more-2-fill';

  /**
   * Input que recibe el color del icono del menú, por defecto es 'primary'
   */
  @Input() color: ButtonColor = 'primary';

  /**
   * Input que recibe el tamaño del icono del menú, por defecto es 'xm'
   */
  @Input() size: ButtonSize = 'xm';

  /**
   * Input que recibe el color del icono del menú, por defecto es 'primary'
   */
  @Input() transparent: boolean = true;

  /**
   * Input que recibe el título del menú
   */
  @Input() title: string = '';

  isMenuContextOpened: WritableSignal<boolean> = signal(false);
  scrollStrategy: ScrollStrategy;
  overlayPositions = OVERLAY_POSITIONS;

  /**
   * Método para cerrar el panel al pulsar la tecla "Escape"
   */
  @HostListener('keydown', ['$event'])
  _onKeydownHandler(event: KeyboardEvent) {
    const keyCode = event.key;
    if (keyCode === 'Escape') this.close();
  }

  /**
   * Método para cerrar el menú contextual al hacer click fuera del panel
   */
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    const clickedInside = this.menuContextOverlayRef?.nativeElement.contains(
      event.target as Node,
    );
    if (!clickedInside) this.close();
  }

  private readonly overlay = inject(Overlay);
  private readonly _menuContextManagerService = inject(
    MenuContextManagerService,
  );

  private destroy$ = new Subject<void>();

  constructor() {
    this.scrollStrategy = this.overlay.scrollStrategies.close();
  }

  ngOnInit(): void {
    // Nos suscribimos a las notificaciones del servicio MenuContextManagerService
    this.menuContextManager();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Método para suscribirse a las notificaciones del servicio MenuContextManagerService
   * para cerrar el calendario si otro componente de tipo MenuContext se abre.
   */
  menuContextManager() {
    // 📡 Nos suscribimos a las notificaciones del servicio
    this._menuContextManagerService.menuContextOpened$
      .pipe(takeUntil(this.destroy$))
      .subscribe((openedComponent) => {
        // Si el componente notificado no es este mismo, ciérrate.
        if (openedComponent !== this) {
          this.close();
        }
      });
  }

  /**
   * Función para cerrar el menú contextual
   */
  close() {
    this.isMenuContextOpened.set(false);
  }

  /**
   * Función para abrir o cerrar el menú contextual
   * @param {Event} event
   */
  toggleMenuContext(event: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.isMenuContextOpened.set(!this.isMenuContextOpened());
  }
}
