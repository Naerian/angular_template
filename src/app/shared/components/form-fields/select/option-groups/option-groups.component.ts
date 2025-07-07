import {
  Component,
  ContentChildren,
  Input,
  QueryList,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
} from '@angular/core';
import { OptionComponent } from '../option/option.component';

@Component({
  selector: 'neo-option-groups',
  templateUrl: './option-groups.component.html',
  styleUrl: './option-groups.component.scss',
  host: {
    '[class.neo-select__dropdown__options__group]': 'true',
    '[class.neo-select__dropdown__options__group--hidden]':
      'isAllOptionsHideBySearch()', // Oculta el grupo si todas las opciones están ocultas
  },
  encapsulation: ViewEncapsulation.None,
})
export class OptionGroupsComponent {
  @ContentChildren(forwardRef(() => OptionComponent), { descendants: true })
  options!: QueryList<OptionComponent>;

  @Input() label!: string;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;

  /**
   * Método para comprobar si las opciones del grupo están ocultas por la búsqueda realizada
   * en el componente `neo-select`
   */
  isAllOptionsHideBySearch(): boolean {
    return this.options.toArray().every((option) => option.isHideBySearch());
  }
}
