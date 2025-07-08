import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

/**
 * @name fadeInOutMenu
 * @description Esta animación se utiliza para hacer que el menú lateral aparezca y desaparezca
 * con un efecto de desvanecimiento. Se aplica al backdrop del menú.
 */
export const FADE_IN_OUT_MENU = trigger('fadeInOutMenu', [
  // Estado para el backdrop cuando no está en el DOM
  state('void', style({
    opacity: 0
  })),

  // Transición de entrada (aparecer)
  transition('void => *', [ // Cuando el elemento entra al DOM desde 'void' a cualquier estado
    style({ opacity: 0 }),
    animate('200ms ease-out', style({ opacity: 1 })) // Más rápido para el backdrop
  ]),

  // Transición de salida (desaparecer)
  transition('* => void', [ // Cuando el elemento sale del DOM hacia 'void'
    animate('200ms ease-in', style({ opacity: 0 }))
  ])
]);