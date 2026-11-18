export interface Pagina {
  total: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}

export interface Paginado<T> {
  data: T[];
  pagination: Pagina;
}

export interface ErrorApi {
  mensaje: string;
  detalles?: string[];
}

// El error que lanza httpClient cuando la API responde con un código de error;
// la interfaz lo muestra directo al usuario.
export class ErrorDeApi extends Error {
  readonly respuesta: ErrorApi;
  readonly estado: number;

  constructor(respuesta: ErrorApi, estado: number) {
    super(respuesta.mensaje);
    this.respuesta = respuesta;
    this.estado = estado;
  }
}
