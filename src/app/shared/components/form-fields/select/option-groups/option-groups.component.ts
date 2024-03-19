import { Component, ContentChildren, Inject, InjectionToken, Input, Optional, QueryList, ViewEncapsulation, booleanAttribute, forwardRef } from '@angular/core';
import { NEO_SELECT, SelectComponent } from '../select.component';
import { OptionComponent } from '../option/option.component';

/**
 * Permite inyectar el componente SelectComponent en el componente OptionComponent y OptionGroupComponent
 * para poder acceder a sus propiedades y métodos desde el componente hijo
 */
export const NEO_OPTION_GROUPS = new InjectionToken<OptionGroupsComponent>('OptionGroupsComponent');

@Component({
  selector: 'neo-option-groups',
  templateUrl: './option-groups.component.html',
  styleUrl: './option-groups.component.scss',
  host: {
    '[class.neo-select__dropdown__options__group]': 'true',
    '[class.neo-select__dropdown__options__group--hidden]': 'isAllOptionsHideBySearch()', // Oculta el grupo si todas las opciones están ocultas
  },
  encapsulation: ViewEncapsulation.None
})
export class OptionGroupsComponent {

  @ContentChildren(forwardRef(() => OptionComponent), { descendants: true }) options!: QueryList<OptionComponent>;

  @Input() label!: string;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;

  constructor(
    @Optional() @Inject(NEO_SELECT) private selectParent: SelectComponent
  ) { }

  /**
   * Método para comprobar si las opciones del grupo están ocultas por la búsqueda realizada
   * en el componente `neo-select`
   */
  isAllOptionsHideBySearch(): boolean {
    return this.options.toArray().every(option => option.isHideBySearch());
  }

}
