import {
  AfterViewInit,
  Component,
  ContentChildren,
  Input,
  QueryList,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { OptionComponent } from '../option/option.component';
import { InputSize } from '../../models/form-field.model';
import { NEO_SELECT, NEO_OPTION_GROUPS } from '../models/select.model';
import { SelectComponent } from '../select.component';

@Component({
  selector: 'neo-option-groups',
  templateUrl: './option-groups.component.html',
  host: {
    role: 'group',
    '[title]': 'label',
    '[attr.id]': '_id',
    '[attr.aria-label]': 'label',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-hidden]': 'isAllOptionsHideBySearch()',
    '[class.neo-select__dropdown__options__group]': 'true',
    '[class.neo-select__dropdown__options__group--hidden]':
      'isAllOptionsHideBySearch()', // Oculta el grupo si todas las opciones están ocultas
  },
  encapsulation: ViewEncapsulation.None,
})
export class OptionGroupsComponent implements AfterViewInit {
  @ContentChildren(forwardRef(() => OptionComponent), { descendants: true })
  options!: QueryList<OptionComponent>;

  @Input()
  _id = signal('');
  set id(value: string) {
    this._id.set(value);
  }
  get id(): string {
    return this._id();
  }
  @Input() label!: string;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;

  size = signal<InputSize>('m');

  // Inyectamos el componente SelectComponent para poder acceder a sus propiedades y métodos
  // desde el componente OptionComponent y OptionGroupComponent.
  private readonly selectParent = inject(NEO_SELECT, {
    optional: true,
  }) as SelectComponent | null;

  // Inyectamos el componente OptionGroupsComponent para poder acceder a sus propiedades y métodos
  // desde el componente OptionComponent y OptionGroupComponent.
  private readonly groupOption = inject(NEO_OPTION_GROUPS, {
    optional: true,
  }) as OptionGroupsComponent | null;

  ngAfterViewInit() {
    // Actualizamos el tamaño del grupo de opciones al tamaño del componente select padre
    if (this.selectParent) this.size.set(this.selectParent.inputSize);
  }

  /**
   * Método para comprobar si las opciones del grupo están ocultas por la búsqueda realizada
   * en el componente `neo-select`
   */
  isAllOptionsHideBySearch(): boolean {
    return this.options.toArray().every((option) => option.isHideBySearch());
  }
}
