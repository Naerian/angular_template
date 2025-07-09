import { InjectionToken } from '@angular/core';
import { NeoUITranslations } from './translations.model';
import { NEOUI_DEFAULT_I18N } from './translations';

/**
 * Token de inyección para proporcionar traducciones personalizadas al componente Select.
 */
export const NEOUI_TRANSLATIONS = new InjectionToken<NeoUITranslations>(
  'NEOUI_TRANSLATIONS',
  {
    providedIn: 'root', // Asegura que esté disponible globalmente
    factory: () => NEOUI_DEFAULT_I18N, // Provee la implementación por defecto
  },
);
