/**
 * Interfaz para representar un mensaje de error con su clave y posibles parámetros.
 * El componente neo-form-error ya no se encarga de la traducción.
 * La propiedad 'message' contendrá el texto final (traducido o no).
 */
export interface NeoFormErrorMessage {
  key?: string; // Clave del error, opcional si se usa un mensaje ya traducido
  message?: string; // Mensaje de error
  params?: any; // Parámetros que provengan del validador
}
