import { Component, Output, EventEmitter, ElementRef, ViewChild, Input, WritableSignal, signal } from '@angular/core';
import { MenuContextComponent } from '../menu-context.component';

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
})
export class ItemMenuContextComponent {

  @ViewChild('itemMenuContent') itemMenuContent!: ElementRef;

  /**
   * Label para darle nombre al item del menú en caso de no utilizar el contenido `ng-content` para ello
   */
  @Input() label: string = '';

  /**
   * Si hemos utilizado `label` para mostrar texto podemos asignarle también un icono
   */
  @Input() icon: string = '';

  _title: WritableSignal<string> = signal('');
  get title(): string {
    return this._title();
  }

  /**
   * Título que recibirá el item si éste no consta de un `label`
   */
  @Input() set title(title: string) {
    this._title.set(title);
  }

  @Output() click: EventEmitter<any> = new EventEmitter();

  constructor(
    private menuContextParent: MenuContextComponent,
  ) { }

  /**
   * Trigger al hacer click en el item del menú que emite el evento `click`
   * @param {Event} event
   */
  onClickItem(event: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.menuContextParent.close(); // Cerramos el menú padre
    this.click.emit(event);
  }

  /**
   * Función que se ejecuta después de que el componente se haya inicializado
   */
  ngAfterViewInit(): void {
    if (this._title() === '' || this._title().length === 0 && this.label !== '')
      this._title.set(this.label);
    else {
      if (this._title() === '' || this._title().length === 0)
        this._title.set(this.itemMenuContent.nativeElement.innerHTML.replace(/(<([^>]+)>)/gi, ""));
    }
  }
}
