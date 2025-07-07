import { ConnectedPosition } from '@angular/cdk/overlay';

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
    panelClass: 'neo-input-date-picker__calendar--below', // Clase CSS opcional para cuando está abajo
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    panelClass: 'neo-input-date-picker__calendar--above', // Clase CSS opcional para cuando está arriba
  },
];
