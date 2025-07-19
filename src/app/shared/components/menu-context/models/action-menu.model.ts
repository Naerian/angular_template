import { ConnectedPosition } from '@angular/cdk/overlay';
import { ActionMenuComponent } from '../action-menu.component';
import { InjectionToken } from '@angular/core';
import { ActionMenuItemComponent } from '../action-menu-item/action-menu-item.component';

/**
 * Interfaz que define la estructura de un item del menú contextual.
 * Permite definir un label, un icono, un título y si el item está deshabilitado.
 */
export interface ActionMenuItem {
  label?: string;
  icon?: string;
  title?: string;
  disabled?: boolean;
  action?: (event?: Event) => void; // Función opcional para manejar el clic
}

/**
 * Permite inyectar el componente ActionMenuComponent en el componente ActionMenuItemComponent
 * para poder acceder a sus propiedades y métodos desde el componente hijo
 */
export const ACTION_MENU = new InjectionToken<ActionMenuComponent>(
  'ActionMenuComponent',
);

/**
 * Permite inyectar el componente ActionMenuItemComponent en el componente ActionMenuComponent
 * para poder acceder a sus propiedades y métodos desde el componente padre
 */
export const ACTION_MENU_ITEM =
  new InjectionToken<ActionMenuItemComponent>('ActionMenuItemComponent');

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
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
  },
];
