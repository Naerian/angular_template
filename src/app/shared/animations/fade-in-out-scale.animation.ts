import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const FADE_IN_OUT_SCALE = trigger('fadeInOutScale', [
  // Estado 'void' es cuando el elemento no está en el DOM (antes de aparecer)
  state(
    'void',
    style({
      opacity: 0,
      transform: 'scale(0.95)', // Ligeramente más pequeño para un efecto sutil de "zoom in"
    }),
  ),
  // Estado '*' es cuando el elemento está presente en el DOM (después de aparecer)
  state(
    '*',
    style({
      opacity: 1,
      transform: 'scale(1)', // Tamaño normal y completamente visible
    }),
  ),
  // Transición para la entrada (cuando el overlay aparece)
  transition('void => *', [
    animate('150ms ease-out'), // Duración y curva de velocidad
  ]),
  // Transición para la salida (cuando el overlay desaparece)
  transition('* => void', [
    animate('100ms ease-in'), // Duración y curva de velocidad
  ]),
]);
