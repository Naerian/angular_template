import { trigger, style, animate, transition } from '@angular/animations';

/**
 * Animación para deslizar hacia la izquierda
 */
export const SLIDE_TO_LEFT = trigger('slideToLeft',[
  transition(':enter', [
    style({ transform: 'translateX(100%)' }),
    animate('350ms ease-in', style({ transform: 'translateX(0%)' })),
  ]),
  transition(":leave", [
    style({ transform: 'translateX(0%)' }),
    animate('350ms ease-out', style({ transform: 'translateX(100%)' })),
  ])
]);
