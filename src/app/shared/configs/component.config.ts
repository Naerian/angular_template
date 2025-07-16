import { InjectionToken, Provider } from '@angular/core';
import { NeoComponentConfig } from './component.model';

// Creamos el InjectionToken
export const NEOUI_COMPONENT_CONFIG = new InjectionToken<NeoComponentConfig>(
  'NeoComponentConfig',
  {
    // Opcional: Proporciona un valor por defecto si no se configura explícitamente
    providedIn: 'root', // Asegura que el token esté disponible en toda la aplicación
    factory: () => ({} as NeoComponentConfig),
  },
);

/**
 * Proporciona la configuración global para los componentes de la librería NeoUI.
 * Permite establecer valores por defecto como tamaño, color, etc.
 *
 * @param config Las opciones de configuración para la librería NeoUI.
 * @returns Un Provider que configura NEO_COMPONENT_CONFIG.
 */
export function provideNeoUiConfig(config: NeoComponentConfig): Provider {
  return {
    provide: NEOUI_COMPONENT_CONFIG,
    useValue: config, // Simplemente pasamos el objeto de configuración que recibimos
  };
}
