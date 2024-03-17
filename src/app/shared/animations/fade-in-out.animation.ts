import { trigger, style, animate, transition } from '@angular/animations';

export const FADE_IN_OUT = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('350ms', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('350ms', style({ opacity: 0 }))
  ])
])
