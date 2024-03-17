import { trigger, state, style, transition, animate } from "@angular/animations";

/**
 * Animación para deslizar el panel hacia arriba, abajo, derecha o izquierda utilizando transform: translateX() o transform: translateY()
 * según la posición pasado por parámetro que puede ser "top", "bottom", "left" o "right".
 * Deberá desplazarse 100% o -100% según la posición hasta llegar a 0%. Al cerrarse, deberá hacer el recorrido inverso.
 * --
 * El parametro "top", "bottom", "left" o "right" indica la posición final del panel
 */
export const SLIDE_BY_POSITION = trigger('slideByPosition', [

  state('top', style({ transform: 'translateY(0%)' })),
  state('bottom', style({ transform: 'translateY(0%)' })),
  state('left', style({ transform: 'translateX(0%)' })),
  state('right', style({ transform: 'translateX(0%)' })),

  // Desplazamiento de arriba hacia abajo al abrirse y de abajo hacia arriba al cerrarse
  transition('void => top', [
    style({ transform: 'translateY(-100%)', top: 0, left: 0, right: 'auto', bottom: 'auto' }),
    animate('350ms ease-in', style({ transform: 'translateY(0%)', top: 0, left: 0, right: 'auto', bottom: 'auto' })),
  ]),
  transition('top => void', [
    animate('350ms ease-out', style({ transform: 'translateY(-100%)', top: 0, left: 0, right: 'auto', bottom: 'auto' })),
  ]),

  // Desplazamiento de abajo hacia arriba al abrirse y de arriba hacia abajo al cerrarse
  transition('void => bottom', [
    style({ transform: 'translateY(100%)', bottom: 0, left: 0, right: 'auto', top: 'auto' }),
    animate('350ms ease-in', style({ transform: 'translateY(0%)', bottom: 0, left: 0, right: 'auto', top: 'auto' })),
  ]),
  transition('bottom => void', [
    animate('350ms ease-out', style({ transform: 'translateY(100%)', bottom: 0, left: 0, right: 'auto', top: 'auto' })),
  ]),

  // Desplazamiento de izquierda hacia derecha al abrirse y de derecha hacia izquierda al cerrarse
  transition('void => left', [
    style({ transform: 'translateX(-100%)', top: 0, left: 0, right: 'auto', bottom: 'auto' }),
    animate('350ms ease-in', style({ transform: 'translateX(0%)', top: 0, left: 0, right: 'auto', bottom: 'auto' })),
  ]),
  transition('left => void', [
    animate('350ms ease-out', style({ transform: 'translateX(-100%)', top: 0, left: 0, right: 'auto', bottom: 'auto' })),
  ]),

  // Desplazamiento de derecha hacia izquierda al abrirse y de izquierda hacia derecha al cerrarse
  transition('void => right', [
    style({ transform: 'translateX(100%)', top: 0, right: 0, left: 'auto', bottom: 'auto' }),
    animate('350ms ease-in', style({ transform: 'translateX(0%)', top: 0, right: 0, left: 'auto', bottom: 'auto' })),
  ]),
  transition('right => void', [
    animate('350ms ease-out', style({ transform: 'translateX(100%)', top: 0, right: 0, left: 'auto', bottom: 'auto' })),
  ])
]);

