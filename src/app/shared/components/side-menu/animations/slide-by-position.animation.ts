import { trigger, state, style, transition, animate } from "@angular/animations";

/**
 * Animación para deslizar el panel hacia arriba, abajo, derecha o izquierda utilizando transform: translateX()
 * según la posición pasado por parámetro que puede ser "left" o "right".
 * Deberá desplazarse 100% o -100% según la posición hasta llegar a 0%. Al cerrarse, deberá hacer el recorrido inverso.
 * --
 * El parametro "left" o "right" indica la posición final del panel
 */
export const SLIDE_BY_POSITION = trigger('slideByPosition', [

  state('left', style({ transform: 'translateX(0%)' })),
  state('right', style({ transform: 'translateX(0%)' })),

  // Desplazamiento de derecha hacia izquierda al abrirse y de izquierda hacia derecha al cerrarse
  transition('void => left', [
    style({ transform: 'translateX(-100%)' }),
    animate('350ms ease-in', style({ transform: 'translateX(0%)' })),
  ]),
  transition('left => void', [
    animate('350ms ease-out', style({ transform: 'translateX(-100%)' })),
  ]),

  // Desplazamiento de izquierda hacia derecha al abrirse y de derecha hacia izquierda al cerrarse
  transition('void => right', [
    style({ transform: 'translateX(100%)' }),
    animate('350ms ease-in', style({ transform: 'translateX(0%)' })),
  ]),
  transition('right => void', [
    animate('350ms ease-out', style({ transform: 'translateX(100%)' })),
  ])
]);

