import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { SideMenuPosition } from '../model/menu.entity'; // Asegúrate de que esta ruta sea correcta

/**
 * @name slideByPosition
 * @description Esta animación se utiliza para deslizar el menú lateral hacia la izquierda o la derecha según su posición.
 * Maneja las transiciones de entrada y salida del menú, así como su estado cuando está abierto o cerrado.
 */
export const SLIDE_BY_POSITION = trigger('slideByPosition', [
  // Estado para el menú cerrado (cuando no está en el DOM, o en su posición inicial)
  state('void', style({
    transform: 'translateX(-100%)', // Por defecto, menú a la izquierda, oculto a la izquierda
    opacity: 0 // También lo hacemos invisible
  })),

  // Transición de entrada (menú aparece)
  transition('void => ' + SideMenuPosition.LEFT, [
    style({ transform: 'translateX(-100%)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition('void => ' + SideMenuPosition.RIGHT, [
    style({ transform: 'translateX(100%)', opacity: 0 }), // Oculto a la derecha
    animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),

  // Transición de salida (menú desaparece)
  transition(SideMenuPosition.LEFT + ' => void', [
    animate('300ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))
  ]),
  transition(SideMenuPosition.RIGHT + ' => void', [
    animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
  ]),

  // Estados fijos (cuando está abierto)
  state(SideMenuPosition.LEFT, style({
    transform: 'translateX(0)',
    opacity: 1
  })),
  state(SideMenuPosition.RIGHT, style({
    transform: 'translateX(0)',
    opacity: 1
  })),
]);