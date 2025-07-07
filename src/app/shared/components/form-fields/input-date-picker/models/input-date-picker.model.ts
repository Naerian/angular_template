import { ConnectedPosition } from '@angular/cdk/overlay';

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
