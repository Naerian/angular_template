import { IColumnsRequest } from "./table.entity";

/**
 * Interface para la respuesta de la API, donde `data` es el tipo de dato que se espera recibir
 * y que puede ser cualquier tipo de dato.
 */
export interface IApiResponse<T> {
  pageIndex: number;
  totalCount: number;
  pageSize: number;
  columns: IColumnsRequest[];
  data: T[];
  isSuccess: boolean;
  message: string | null;
  errors: string[] | null;
}
