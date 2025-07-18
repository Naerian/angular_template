// Define los tipos de entrada para los campos de formulario
export type InputType =
  | 'text'
  | 'number'
  | 'hidden'
  | 'tel'
  | 'color'
  | 'url'
  | 'email'
  | 'range';

// Define el modo de entrada del teclado en dispositivos móviles
export type InputMode =
  | 'none'
  | 'text'
  | 'tel'
  | 'url'
  | 'email'
  | 'numeric'
  | 'decimal'
  | 'search';

// Define los valores de autocompletado para los campos de formulario
export type InputAutocomplete = 'on' | 'off';

// Define el tipo para el input numérico
export type InputNumberType = 'integer' | 'decimal' | 'currency';

// Define la posición del símbolo de moneda en el input numérico
export type InputNumberCurrencyPosition = 'left' | 'right';

export type InputNumberTextAlign = 'left' | 'right' | 'center';

// Define el modo de entrada del teclado para inputs numéricos
export type InputNumberMode = Extract<InputMode, 'decimal' | 'numeric'>;

// Define la posición de los botones para el input numérico
export type InputNumberButtons = 'horizontal' | 'vertical' | 'inside' | null;

// Define el tipo de botón para el input numérico
export type InputNumberButtonType = 'increment' | 'decrement';

export enum InputNumberButton {
  INCREMENT = 'increment',
  DECREMENT = 'decrement',
}
