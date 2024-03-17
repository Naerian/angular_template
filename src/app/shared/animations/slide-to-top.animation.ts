import { trigger, style, animate, transition } from '@angular/animations';

/**
 * Animación para deslizar hacia arriba
 */
export const SLIDE_TO_TOP = trigger('slideToTop', [
  transition(':enter', [
    style({ transform: 'translateY(100%)' }),
    animate('350ms ease-in', style({ transform: 'translateY(0%)' })),
  ]),
  transition(":leave", [
    style({ transform: 'translateY(0%)' }),
    animate('350ms ease-out', style({ transform: 'translateY(100%)' })),
  ])
]);
