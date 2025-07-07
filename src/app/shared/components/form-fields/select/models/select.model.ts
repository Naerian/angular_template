import { ConnectedPosition } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';
import { OptionGroupsComponent } from '../option-groups/option-groups.component';
import { SelectComponent } from '../select.component';

/**
 * Permite inyectar el componente SelectComponent en el componente OptionComponent y OptionGroupComponent
 * para poder acceder a sus propiedades y métodos desde el componente hijo
 */
export const NEO_SELECT = new InjectionToken<SelectComponent>(
  'SelectComponent',
);

/**
 * Permite inyectar el componente SelectComponent en el componente OptionComponent y OptionGroupComponent
 * para poder acceder a sus propiedades y métodos desde el componente hijo
 */
export const NEO_OPTION_GROUPS = new InjectionToken<OptionGroupsComponent>(
  'OptionGroupsComponent',
);

/**
 * Posiciones del overlay de opciones del componente Select.
 * Define cómo se posiciona el dropdown respecto al campo de entrada.
 * - `originX` y `originY`: Definen el punto de origen del campo de entrada.
 * - `overlayX` y `overlayY`: Definen el punto de anclaje del dropdown.
 * - `panelClass`: Clase CSS opcional para aplicar estilos específicos al dropdown.
 */
export const OVERLAY_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start', // El borde izquierdo del input
    originY: 'bottom', // El borde inferior del input
    overlayX: 'start', // El borde izquierdo del calendario
    overlayY: 'top', // El borde superior del calendario
    panelClass: 'neo-select__dropdown--below', // Clase CSS opcional para cuando está abajo
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    panelClass: 'neo-select__dropdown--above', // Clase CSS opcional para cuando está arriba
  },
];
