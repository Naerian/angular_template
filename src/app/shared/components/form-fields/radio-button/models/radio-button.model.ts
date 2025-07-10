import { InjectionToken } from "@angular/core";
import { RadioButtonGroupComponent } from "../radio-button-group/radio-button-group.component";

export type DirectionRadioButtonGroup = 'horizontal' | 'vertical';

/**
 * Permite inyectar el componente RadioButtonGroupComponent en el componente RadioButtonComponent
 * para poder acceder a sus propiedades y métodos desde el componente RadioButtonComponent hijo
 */
export const NEO_RADIO_BUTTON_GROUP =
  new InjectionToken<RadioButtonGroupComponent>('RadioButtonGroupComponent');
