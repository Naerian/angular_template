import {
  Component,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  Input,
  WritableSignal,
  signal,
  booleanAttribute,
  inject,
  AfterViewInit,
} from '@angular/core';
import { MenuContextComponent } from '../menu-context.component';
import { FocusableOption } from '@angular/cdk/a11y';
import {
  NEO_ITEMS_MENU_CONTEXT,
  NEO_MENU_CONTEXT,
} from '../models/menu-context.model';

/**
 * @name
 * neo-item-menu-context
 * @description
 * Componente para crear un item de un menú contextual en el componente `neo-menu-context`.
 * @example
 * <neo-menu-context [icon]="'ri-more-2-fill'" [size]="'xm'" [title]="'Título'">
 *    <neo-item-menu-context [title]="'Título diferente al contenido'"">Test 1</neo-item-menu-context>
 *    <neo-item-menu-context [label]="'Texto del item'" [icon]="'icono-del-item'"></neo-item-menu-context>
 *    <neo-item-menu-context>Test 2</neo-item-menu-context>
 * </neo-menu-context>
 */
@Component({
  selector: 'neo-item-menu-context',
  templateUrl: './item-menu-context.component.html',
  styleUrls: ['./item-menu-context.component.scss'],
  host: {
    role: 'menuitem',
    '[attr.id]': 'this.menuContext?.id + "-item"',
    '[attr.title]': 'title',
    '[attr.aria-label]': 'title',
    '[attr.aria-disabled]': 'disabled',
    '[class.menu-context__item-menu]': 'true',
    '[class.menu-context__item-menu--disabled]': 'disabled',
    '[tabindex]': 'disabled ? -1 : 0',
    '(click)': 'onClickItem($event)',
    '(keydown.enter)': 'onClickItem()',
    '(keydown.space)': 'onClickItem()',
  },
  providers: [
    {
      provide: NEO_ITEMS_MENU_CONTEXT,
      useExisting: ItemMenuContextComponent,
    },
  ],
})
export class ItemMenuContextComponent
  implements AfterViewInit, FocusableOption
{
  /**
   * Label para darle nombre al item del menú en caso de no utilizar el contenido `ng-content` para ello
   */
  @Input() label: string = '';

  /**
   * Si hemos utilizado `label` para mostrar texto podemos asignarle también un icono
   */
  @Input() icon: string = '';

  /**
   * Título que recibirá el item si éste no consta de un `label`
   */
  @Input()
  set title(title: string) {
    this._title.set(title);
  }
  get title(): string {
    return this._title();
  }

  /**
   * Input para deshabilitar el item del menú contextual.
   * Si está deshabilitado, no se podrá hacer clic en él y se aplicará
   */
  @Input({ transform: booleanAttribute }) disabled: boolean = false; // Nuevo input disabled

  /**
   * Output que emite un evento al hacer clic en el item del menú contextual.
   * Este evento se emite solo si el item no está deshabilitado.
   */
  @Output() itemClick: EventEmitter<any> = new EventEmitter();

  private _title: WritableSignal<string> = signal('');
  private _elementRef: ElementRef;

  private readonly elementRef = inject(ElementRef);

  // Inyectamos el componente MenuContextComponent para poder acceder a sus propiedades y métodos
  // desde el componente ItemMenuContextComponent hijo.
  private readonly menuContext = inject(NEO_MENU_CONTEXT, {
    optional: true,
  }) as MenuContextComponent | null;

  constructor() {
    this._elementRef = this.elementRef;
  }

  /**
   * Función que se ejecuta después de que el componente se haya inicializado
   */
  ngAfterViewInit() {
    this._createTitle();
  }

  /**
   * Trigger al hacer click en el item del menú que emite el evento `click`
   * @param {Event} event
   */
  onClickItem(event?: Event) {
    event?.stopPropagation();
    if (this.disabled) return;
    this.itemClick.emit(event);
    this.menuContext?.close(event);
  }

  /**
   * Función para crear un título para el item del menú contextual.
   * Si no se ha proporcionado un título, se utiliza el contenido del `ng-content`.
   * Si se ha proporcionado un `label`, se utiliza ese texto como título.
   */
  _createTitle() {
    const title = this._title();
    if (title === '' || title.length === 0) {
      if (this.label !== '') {
        this._title.set(this.label);
      } else {
        const innerText =
          this._elementRef?.nativeElement?.innerHTML?.replace(
            /(<([^>]+)>)/gi,
            '',
          ) ?? '';
        this._title.set(innerText);
      }
    }
  }

  /**
   * Método para enfocar la opción. Este método es necesario para implementar la interfaz `FocusableOption`
   * en la clase. Se enfoca el elemento nativo de la opción para poder seleccionarla las flechas
   * del teclado gracias al uso de `FocusKeyManager` en el componente `neo-menu-context`.
   */
  focus() {
    this._elementRef?.nativeElement?.focus();
  }

  /**
   * Método para obtener la referencia al elemento nativo del componente.
   * Este método es necesario para implementar la interfaz `FocusableOption`
   * @returns {string} El label del item del menú contextual.
   */
  getLabel(): string {
    return (
      this.label || this.elementRef.nativeElement.textContent?.trim() || ''
    );
  }
}
