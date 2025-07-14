import { ConnectedPosition } from '@angular/cdk/overlay';

// Para las opciones del dropdown
export interface DropdownOption {
  value: any;
  label: string;
  disabled?: boolean;
  id: string; // ID único de la opción
  idGroup?: string | null; // ID del grupo al que pertenece, si aplica
}

// Para las opciones agrupadas
export interface DropdownGroup {
  label: string; // Nombre del grupo
  options: DropdownOption[];
  disabled?: boolean;
  id: string; // ID único del grupo
}

// Un tipo genérico para el contenido de las opciones, que puede ser plano o agrupado
export type DropdownContent = (DropdownOption | DropdownGroup)[];

// Tamaños del input
export type DropdownSize = 'xs' | 's' | 'xm' | 'm' | 'l' | 'xl';

// Umbral para el scroll virtual, ajusta según tus necesidades
export const VIRTUAL_SCROLL_THRESHOLD = 100; // Umbral para el scroll virtual, ajusta según tus necesidades

// Mismo tamaño que hay definido en el fichero `_config.scss` para los componentes, bajo `$component-heights`
export enum DropdownSizesInPx {
  xs = 28, // 1.75rem * 16px/rem = 28px
  s = 32, // 2rem * 16px/rem = 32px
  xm = 36, // 2.25rem * 16px/rem = 36px
  m = 40, // 2.5rem * 16px/rem = 40px
  l = 48, // 3rem * 16px/rem = 48px
  xl = 56, // 3.5rem * 16px/rem = 56px
}

export const VERTICAL_GAP_IN_PX = 2; // La mitad spacio vertical (4px) entre opciones, ajusta según tus necesidades
export const PADDING_OPTIONS_IN_PX = 1; // Espacio de padding horizontal en las opciones, ajusta según tus necesidades

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
    panelClass: 'neo-dropdown__panel--below', // Clase CSS opcional para cuando está abajo
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    panelClass: 'neo-dropdown__panel--above', // Clase CSS opcional para cuando está arriba
  },
];
