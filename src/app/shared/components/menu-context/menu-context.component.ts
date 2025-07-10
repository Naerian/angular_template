import { Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import {
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { FADE_IN_OUT_SCALE } from '@shared/animations/fade-in-out-scale.animation';
import { Subject, takeUntil } from 'rxjs';
import { ButtonColor, ButtonSize } from '../button/models/button.model';
import {
  NEO_ITEMS_MENU_CONTEXT,
  NEO_MENU_CONTEXT,
  OVERLAY_POSITIONS,
} from './models/menu-context.model';
import { MenuContextManagerService } from './services/menu-context-manager/menu-context-manager.service';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { ItemMenuContextComponent } from './item-menu-context/item-menu-context.component';

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
  providers: [
    {
      provide: NEO_MENU_CONTEXT,
      useExisting: MenuContextComponent,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MenuContextComponent {
  @ViewChild('menuContextOverlay', { read: ElementRef })
  menuContextOverlayRef!: ElementRef;
  @ViewChild('menuContext') menuContextRef!: ElementRef<HTMLElement>;

  @ContentChildren(ItemMenuContextComponent)
  menuItems!: QueryList<ItemMenuContextComponent>; // Obtener los ítems del menú

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

  /**
   * Output para notificar si el menú contextual se ha abierto o cerrado.
   */
  @Input() isOpened: WritableSignal<boolean> = signal(false);

  /**
   * Input para crear un id único para el menú contextual.
   */
  _id: WritableSignal<string> = signal('');
  @Input() set id(value: string) {
    this._id.set(value);
  }
  get id() {
    return this._id();
  }

  isMenuContextOpened: WritableSignal<boolean> = signal(false);
  scrollStrategy: ScrollStrategy;
  overlayPositions = OVERLAY_POSITIONS;

  // Manager para el control de teclas en las opciones
  private _focusKeyManager!: FocusKeyManager<ItemMenuContextComponent>;

  private readonly overlay = inject(Overlay);
  private readonly _menuContextManagerService = inject(
    MenuContextManagerService,
  );

  private readonly itemMenuContext = inject(NEO_ITEMS_MENU_CONTEXT, {
    optional: true,
  }) as ItemMenuContextComponent | null;

  private destroy$ = new Subject<void>();

  constructor() {
    this.scrollStrategy = this.overlay.scrollStrategies.close();
  }

  /**
   * Método para cerrar el panel al pulsar la tecla "Escape"
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    const keyCode = event.key;
    if (keyCode === 'Escape') this.close();
  }

  /**
   * Método para cerrar el menú contextual al hacer click fuera del panel
   */
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    // Verificar si las referencias a los elementos existen para evitar errores
    const clickedInsideBtnMenu = this.menuContextRef?.nativeElement?.contains(
      event.target as Node,
    );
    const clickedInsideMenuCtxtOverlay =
      this.menuContextOverlayRef?.nativeElement?.contains(event.target as Node);

    // Si el menú está abierto y el clic no fue dentro del botón NI dentro del overlay
    if (
      this.isMenuContextOpened() &&
      !clickedInsideBtnMenu &&
      !clickedInsideMenuCtxtOverlay
    ) {
      this.close();
    }
  }

  ngOnInit(): void {
    // Nos suscribimos a las notificaciones del servicio MenuContextManagerService
    this.menuContextManager();
  }

  ngAfterViewInit(): void {
    // Creamos un id único para el menú contextual
    this.createUniqueId();

    // Inicialización del manager de teclas para las opciones.
    // Con la opción "withWrap" permitimos que el foco se mueva cíclicamente entre los elementos del menú.
    // Esto permite que al presionar la tecla "Tab" o "Shift + Tab" también se pueda navegar por los ítems del menú contextual.
    this._focusKeyManager = new FocusKeyManager(this.menuItems).withWrap();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Función para crear un id único para el label del input
   */
  createUniqueId(): void {
    this._id?.set('menu-context_' + crypto.randomUUID());
  }

  /**
   * Método para suscribirse a las notificaciones del servicio MenuContextManagerService
   * para cerrar el menú contextual si otro componente de tipo MenuContext se abre.
   */
  menuContextManager() {
    // Nos suscribimos a las notificaciones del servicio
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
   * Función para abrir el menú contextual
   */
  open() {
    this._menuContextManagerService.notifyOpened(this);
    this.isMenuContextOpened.set(true);
    this.isOpened.set(true);
  }

  /**
   * Función para cerrar el menú contextual
   */
  close() {
    this.isMenuContextOpened.set(false);
    this.isOpened.set(false);
  }

  /**
   * Función para abrir o cerrar el menú contextual
   * @param {Event} event
   */
  toggleMenuContext(event: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    // Si el menú contextual ya está abierto, lo cerramos.
    // Si no, lo abrimos.
    if (this.isMenuContextOpened()) this.close();
    else this.open();
  }

  /**
   * Método para controlar cuando se pulsa una tecla
   * @param {KeyboardEvent} event
   */
  onKeyDown(event: KeyboardEvent) {
    if (!this.isMenuContextOpened()) return;
    // Permitir que el FocusKeyManager maneje las flechas de dirección
    this._focusKeyManager.onKeydown(event);
  }
}
