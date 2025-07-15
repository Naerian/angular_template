import { InjectionToken, Provider } from '@angular/core';
import { NeoUITranslations } from './translations.model';
import { NEOUI_DEFAULT_I18N } from './translations';

/**
 * Token de inyección para proporcionar traducciones personalizadas al componente Select.
 */
export const NEOUI_TRANSLATIONS = new InjectionToken<NeoUITranslations>(
  'NeoUITranslations',
  {
    providedIn: 'root', // Asegura que esté disponible globalmente
    factory: () => NEOUI_DEFAULT_I18N, // Provee la implementación por defecto
  },
);

/**
 * Proporciona las traducciones globales para los componentes de la librería NeoUI.
 * Fusiona las traducciones proporcionadas con las por defecto.
 *
 * @param translations Las traducciones personalizadas a aplicar.
 * @returns Un Provider que configura NEOUI_TRANSLATIONS.
 */
export function provideNeoUiTranslations(
  translations: Partial<NeoUITranslations>,
): Provider {
  // Fusionamos las traducciones por defecto con las proporcionadas
  // asegurando que las traducciones personalizadas tengan prioridad.
  // Esto permite que el desarrollador pueda personalizar las traducciones
  // sin perder las traducciones por defecto de la librería.
  const mergedTranslations: NeoUITranslations = {
    ...NEOUI_DEFAULT_I18N,
    ...translations,
  };

  return {
    provide: NEOUI_TRANSLATIONS,
    useValue: mergedTranslations,
  };
}
