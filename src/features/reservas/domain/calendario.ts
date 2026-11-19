// Toda la lógica horaria usa America/Bogota (UTC−5 fijo, sin horario de
// verano). Son las mismas funciones puras que el backend, así que la
// interfaz y la API siempre calculan la misma fecha objetivo.

const DESFASE_BOGOTA_MILISEGUNDOS = 5 * 60 * 60 * 1000;

const DIAS_NO_HABILES = [0, 6]; // domingo y sábado

function aFechaUTC(fecha: string): Date {
  return new Date(`${fecha}T00:00:00.000Z`);
}

// Devuelve la fecha de hoy en Bogotá como YYYY-MM-DD.
export function hoyEnBogota(): string {
  return new Date(Date.now() - DESFASE_BOGOTA_MILISEGUNDOS).toISOString().slice(0, 10);
}

// Días hábiles: lunes a viernes, sin manejo de festivos.
export function esDiaHabil(fecha: string): boolean {
  return !DIAS_NO_HABILES.includes(aFechaUTC(fecha).getUTCDay());
}

export function diaHabilAnterior(fecha: string): string {
  const dia = aFechaUTC(fecha);
  dia.setUTCDate(dia.getUTCDate() - 1);
  while (DIAS_NO_HABILES.includes(dia.getUTCDay())) {
    dia.setUTCDate(dia.getUTCDate() - 1);
  }
  return dia.toISOString().slice(0, 10);
}

export function siguienteDiaHabil(fecha: string): string {
  const dia = aFechaUTC(fecha);
  dia.setUTCDate(dia.getUTCDate() + 1);
  while (DIAS_NO_HABILES.includes(dia.getUTCDay())) {
    dia.setUTCDate(dia.getUTCDate() + 1);
  }
  return dia.toISOString().slice(0, 10);
}

// La fecha para mostrarla en la interfaz: "sábado, 21 de noviembre".
export function nombreDeFecha(fecha: string): string {
  return new Date(`${fecha}T12:00:00Z`).toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
}

export function nombreDeDia(fecha: string): string {
  return new Date(`${fecha}T12:00:00Z`).toLocaleDateString('es-CO', {
    weekday: 'long',
    timeZone: 'UTC',
  });
}

// El instante actual en Bogotá, partido en fecha y hora para comparar fácil.
export function ahoraEnBogota(): { fecha: string; hora: string } {
  const instante = new Date(Date.now() - DESFASE_BOGOTA_MILISEGUNDOS).toISOString();
  return { fecha: instante.slice(0, 10), hora: instante.slice(11, 16) };
}

// RN6: la cancelación vale hasta la hora de inicio del bloque. Las cadenas
// "YYYY-MM-DD" y "HH:mm" se comparan lexicográficamente sin problema.
export function bloqueYaIniciado(fecha: string, horaInicio: string): boolean {
  const ahora = ahoraEnBogota();
  if (fecha !== ahora.fecha) {
    return fecha < ahora.fecha;
  }
  return horaInicio <= ahora.hora;
}
