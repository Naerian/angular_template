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
import { ActionMenuComponent } from '../action-menu.component';
import { FocusableOption } from '@angular/cdk/a11y';
import {
  ACTION_MENU_ITEM,
  ACTION_MENU,
} from '../models/action-menu.model';

/**
 * @name
 * neo-action-menu-item
 * @description
 * Componente para crear un item de un menú contextual en el componente `neo-action-menu`.
 * @example
 * <neo-action-menu [icon]="'ri-more-2-fill'" [size]="'xm'" [title]="'Título'">
 *    <neo-action-menu-item [title]="'Título diferente al contenido'"">Test 1</neo-action-menu-item>
 *    <neo-action-menu-item [label]="'Texto del item'" [icon]="'icono-del-item'"></neo-action-menu-item>
 *    <neo-action-menu-item>Test 2</neo-action-menu-item>
 * </neo-action-menu>
 */
@Component({
  selector: 'neo-action-menu-item',
  templateUrl: './action-menu-item.component.html',
  styleUrls: ['./action-menu-item.component.scss'],
  host: {
    role: 'menuitem',
    '[attr.id]': 'this.actionMenu?.id + "-item"',
    '[attr.title]': 'title',
    '[attr.aria-label]': 'title',
    '[attr.aria-disabled]': 'disabled',
    '[class.action-menu__item]': 'true',
    '[class.action-menu__item--disabled]': 'disabled',
    '[tabindex]': 'disabled ? -1 : 0',
    '(click)': 'onClickItem($event)',
    '(keydown.enter)': 'onClickItem()',
    '(keydown.space)': 'onClickItem()',
  },
  providers: [
    {
      provide: ACTION_MENU_ITEM,
      useExisting: ActionMenuItemComponent,
    },
  ],
})
export class ActionMenuItemComponent
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

  private readonly elementRef = inject(ElementRef);

  // Inyectamos el componente ActionMenuComponent para poder acceder a sus propiedades y métodos
  // desde el componente ActionMenuItemComponent hijo.
  private readonly actionMenu = inject(ACTION_MENU, {
    optional: true,
  }) as ActionMenuComponent | null;

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
    this.actionMenu?.close(event);
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
          this.elementRef?.nativeElement?.innerHTML?.replace(
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
   * del teclado gracias al uso de `FocusKeyManager` en el componente `neo-action-menu`.
   */
  focus() {
    this.elementRef?.nativeElement?.focus();
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
