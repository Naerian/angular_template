import { trigger, style, animate, transition, state } from '@angular/animations';

/**
 * Animación para deslizar el hacia la derecha
 */
export const SLIDE_TO_RIGHT = trigger('slideToRight', [
  state('previous', style({ transform: 'translateX(-100%)' })),
  transition(':enter', [
    style({ transform: 'translateX(-100%)' }),
    animate('350ms ease-in', style({ transform: 'translateX(0%)' })),
  ]),
  transition(":leave", [
    animate('350ms ease-out', style({ transform: 'translateX(-100%)' })),
  ])
]);
