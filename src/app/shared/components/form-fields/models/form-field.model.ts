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
