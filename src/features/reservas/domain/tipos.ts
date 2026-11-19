export type EstadoReserva = 'ACTIVA' | 'CANCELADA';
export type TipoUsuario = 'ESTUDIANTE' | 'EMPLEADO' | 'EGRESADO';

export interface Reserva {
  id: string;
  fecha: string;
  estado: EstadoReserva;
  canceladaEn: string | null;
  usuario: { id: string; nombre: string; documento: string; tipo: TipoUsuario };
  bloque: { id: string; horaInicio: string; horaFin: string; aforo: number };
  creadoEn: string;
  actualizadoEn: string;
}
