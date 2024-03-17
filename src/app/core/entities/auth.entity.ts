/**
 * Interface para el token de autenticación que se utiliza en las peticiones
 * a la API asignándolo en el header `x-auth-token`.
 */
export interface LoginTokenEntity {
  'x-auth-token'?: string;
}

/**
 * Interface para el usuario autenticado
 */
export interface AuthUserEntity {
  id?: string;
  name?: string;
  surname?: string;
  access_token?: string;
}

/**
 * Interface para el usuario que se autentica obtenidos del formulario
 */
export interface LoginAuthUserEntity {
  id: string;
  password: string;
}
