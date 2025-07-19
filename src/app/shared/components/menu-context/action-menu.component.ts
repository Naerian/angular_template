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
import {
  ActionMenuItem,
  ACTION_MENU,
  OVERLAY_POSITIONS,
} from './models/action-menu.model';
import { ActionMenuManagerService } from './services/action-menu-manager/action-menu-manager.service';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { ActionMenuItemComponent } from './action-menu-item/action-menu-item.component';
import { NEOUI_COMPONENT_CONFIG } from '@shared/configs/component.config';
import { ComponentColor, ComponentSize } from '@shared/configs/component.model';
import { DEFAULT_COLOR, DEFAULT_SIZE } from '@shared/configs/component.consts';

/**
 * @name
 * neo-action-menu
 * @description
 * Componente para crear un menú contextual junto con el componente `neo-action-menu-item`.
 * @example
 * <neo-action-menu [icon]="'ri-more-2-fill'" [size]="'xm'" [title]="'Título'">
 *    <neo-action-menu-item [title]='Título diferente al contenido'>Test 1</neo-action-menu-item>
 *    <neo-action-menu-item>Test 2</neo-action-menu-item>
 * </neo-action-menu>
 */
@Component({
  selector: 'neo-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss'],
  animations: [FADE_IN_OUT_SCALE],
  providers: [
    {
      provide: ACTION_MENU,
      useExisting: ActionMenuComponent,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ActionMenuComponent {
  @ViewChild('actionMenuOverlay', { read: ElementRef })
  actionMenuOverlayRef!: ElementRef;
  @ViewChild('actionMenu') actionMenuRef!: ElementRef<HTMLElement>;

  @ContentChildren(ActionMenuItemComponent)
  menuItems!: QueryList<ActionMenuItemComponent>; // Obtener los ítems del menú

  /**
   * Input que recibe un array de objetos para crear dinámicamente los ítems del menú.
   */
  @Input() items: ActionMenuItem[] = [];

  /**
   * Input que recibe el icono del menú, por defecto es 'ri-more-2-fill'
   */
  @Input() icon: string = 'ri-more-2-fill';

  _size: WritableSignal<ComponentSize> = signal(DEFAULT_SIZE);
  @Input()
  set size(value: ComponentSize) {
    this._size.set(value || this.globalConfig.defaultSize || DEFAULT_SIZE);
  }
  get size(): ComponentSize {
    return this._size();
  }

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

  /**
   * Input que recibe el título del menú
   */
  @Input() title: string = '';

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

  scrollStrategy: ScrollStrategy;
  overlayPositions = OVERLAY_POSITIONS;

  isOpened: WritableSignal<boolean> = signal(false);

  // Manager para el control de teclas en las opciones
  private keyManager!: FocusKeyManager<ActionMenuItemComponent>;

  private readonly overlay = inject(Overlay);
  private readonly _ActionMenuManagerService = inject(
    ActionMenuManagerService,
  );

  private readonly globalConfig = inject(NEOUI_COMPONENT_CONFIG);
  private ngUnsubscribe$ = new Subject<void>();

  /**
   * Método para cerrar el menú contextual al hacer click fuera del panel
   */
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    // Verificar si las referencias a los elementos existen para evitar errores
    const clickedInsideBtnMenu = this.actionMenuRef?.nativeElement?.contains(
      event.target as Node,
    );
    const clickedInsideMenuCtxtOverlay =
      this.actionMenuOverlayRef?.nativeElement?.contains(event.target as Node);

    // Si el menú está abierto y el clic no fue dentro del botón NI dentro del overlay
    if (
      this.isOpened() &&
      !clickedInsideBtnMenu &&
      !clickedInsideMenuCtxtOverlay
    ) {
      this.close();
    }
  }

  constructor() {
    this.scrollStrategy = this.overlay.scrollStrategies.close();

    // Inicializamos los atributos por defecto
    this._size.set(this.globalConfig.defaultSize || DEFAULT_SIZE);
    this._color.set(this.globalConfig.defaultColor || DEFAULT_COLOR);
    this._transparent.set(this.globalConfig.transparentButton || true);
  }

  ngOnInit(): void {
    this.menuContextManager();
    this.setProperties();
  }

  ngAfterViewInit(): void {
    this.createUniqueId();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
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
   * Inicializa el KeyManager para manejar la navegación por teclado
   * a través de los elementos del menú contextual.
   */
  initKeyManager() {
    setTimeout(() => {
      this.keyManager = new FocusKeyManager(this.menuItems)
        .withWrap()
        .withVerticalOrientation()
        .withTypeAhead();

      // Enfocar el primer elemento del menú al abrirlo
      this.keyManager.setFirstItemActive();
    });
  }

  /**
   * Función para crear un id único para el label del input
   */
  createUniqueId(): void {
    this._id?.set('menu-context_' + crypto.randomUUID());
  }

  /**
   * Método para suscribirse a las notificaciones del servicio ActionMenuManagerService
   * para cerrar el menú contextual si otro componente de tipo MenuContext se abre.
   */
  menuContextManager() {
    // Nos suscribimos a las notificaciones del servicio
    this._ActionMenuManagerService.actionMenuOpened$
      .pipe(takeUntil(this.ngUnsubscribe$))
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
    this._ActionMenuManagerService.notifyOpened(this);
    this.initKeyManager(); // Inicializamos el KeyManager para manejar la navegación por teclado
    this.isOpened.set(true);
  }

  /**
   * Función para cerrar el menú contextual
   */
  close(event?: Event) {
    event?.stopPropagation();
    this.isOpened.set(false);
  }

  /**
   * Función para abrir o cerrar el menú contextual
   * @param {Event} event
   */
  toggleActionMenu(event: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    // Si el menú contextual ya está abierto, lo cerramos.
    // Si no, lo abrimos.
    if (this.isOpened()) this.close();
    else this.open();
  }

  // Si necesitas manejar los clics de los ítems definidos en el array
  // podrías tener un método que los emita o los maneje directamente aquí
  onDynamicItemClick(item: ActionMenuItem, event: Event) {
    if (item.action) {
      item.action(event);
    }
    this.close(event);
  }

  /**
   * Método para controlar cuando se pulsa una tecla
   * @param {KeyboardEvent} event
   */
  onKeyDown(event: KeyboardEvent) {
    if (!this.isOpened()) return;
    // Permitir que el FocusKeyManager maneje las flechas de dirección
    this.keyManager.onKeydown(event);

    // Control de teclas pulsadas para poder hacer diferentes acciones
    // y además, después, seguir manteniendo el foco en el input de búsqueda.
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        event.stopPropagation();
        const active = this.keyManager.activeItem;
        if (active) {
          active.focus(); // Enfocar el elemento activo
          active.onClickItem(event); // Ejecutar el click del item activo
          this.close(); // Cerrar el menú después de seleccionar
        }
        break;

      case 'End':
        event.preventDefault();
        this.keyManager.setLastItemActive();
        break;

      case 'Home':
        event.preventDefault();
        this.keyManager.setFirstItemActive();
        break;

      case 'Escape':
        event.preventDefault();
        this.close();
        break;

      default:
        break;
    }
  }
}
