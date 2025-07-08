import { InjectionToken } from '@angular/core';
import { NarTranslations } from './translations.model';
import { NAR_DEFAULT_I18N } from './translations';

/**
 * Token de inyección para proporcionar traducciones personalizadas al componente Select.
 */
export const NAR_TRANSLATIONS = new InjectionToken<NarTranslations>(
  'NAR_TRANSLATIONS',
  {
    providedIn: 'root', // Asegura que esté disponible globalmente
    factory: () => NAR_DEFAULT_I18N, // Provee la implementación por defecto
  },
);
