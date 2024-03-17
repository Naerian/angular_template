/**
 * Interface para definitr el formato de las columnas de la tabla
 */
export interface IColumnsFormat {
  def: string;
  label: string;
  visible: boolean;
  sticky?: boolean;
  width?: string | number;
}

/*
  Interface para las columnas de la tabla que se obtienen de la API
*/
export interface IColumnsRequest {
  name: string;
  isOptional: boolean;
}
