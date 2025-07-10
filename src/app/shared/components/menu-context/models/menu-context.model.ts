import { ConnectedPosition } from '@angular/cdk/overlay';
import { MenuContextComponent } from '../menu-context.component';
import { InjectionToken } from '@angular/core';
import { ItemMenuContextComponent } from '../item-menu-context/item-menu-context.component';

/**
 * Permite inyectar el componente MenuContextComponent en el componente ItemMenuContextComponent
 * para poder acceder a sus propiedades y métodos desde el componente hijo
 */
export const NEO_MENU_CONTEXT = new InjectionToken<MenuContextComponent>(
  'MenuContextComponent',
);

/**
 * Permite inyectar el componente ItemMenuContextComponent en el componente MenuContextComponent
 * para poder acceder a sus propiedades y métodos desde el componente padre
 */
export const NEO_ITEMS_MENU_CONTEXT = new InjectionToken<ItemMenuContextComponent>(
  'ItemMenuContextComponent',
);

/**
 * Posiciones del overlay de calendario del componente InputDatePicker.
 * Define cómo se posiciona el calendario respecto al campo de entrada.
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
    panelClass: 'neo-date-picker__calendar--below', // Clase CSS opcional para cuando está abajo
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    panelClass: 'neo-date-picker__calendar--above', // Clase CSS opcional para cuando está arriba
  },
];
