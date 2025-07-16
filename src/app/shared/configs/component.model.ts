// Definimos los tipos de tamaño que se pueden usar en los componentes
export type ComponentSize = 'xs' | 's' | 'xm' | 'm' | 'l' | 'xl';
export type ComponentColor =
  | 'primary'
  | 'accent'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

// Definimos una interfaz para la configuración de los componentes
export interface NeoComponentConfig {
  defaultSize?: ComponentSize;
  defaultColor?: ComponentColor;
  transparentButton?: boolean;
}
