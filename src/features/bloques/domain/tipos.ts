export type EstadoRegistro = 'ACTIVO' | 'INACTIVO';

export interface Bloque {
  id: string;
  horaInicio: string;
  horaFin: string;
  aforo: number;
  estado: EstadoRegistro;
  creadoEn: string;
  actualizadoEn: string;
}

// La API incluye los cupos cuando se lista con la fecha de la reserva.
export interface BloqueConCupos extends Bloque {
  cuposDisponibles: number;
}
