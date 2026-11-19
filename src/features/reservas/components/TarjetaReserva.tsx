'use client';

import { Boton } from '@/features/common/components/Boton';
import { Reserva } from '../domain/tipos';
import {
  bloqueYaIniciado,
  diaHabilAnterior,
  hoyEnBogota,
  nombreDeFecha,
} from '../domain/calendario';

interface Propiedades {
  reserva: Reserva;
  cancelando: boolean;
  onCancelar: (reserva: Reserva) => void;
  onCambiar: (reserva: Reserva) => void;
}

const ETIQUETAS: Record<Reserva['estado'], string> = {
  ACTIVA: 'Activa',
  CANCELADA: 'Cancelada',
};

export function TarjetaReserva({ reserva, cancelando, onCancelar, onCambiar }: Propiedades) {
  const activa = reserva.estado === 'ACTIVA';
  const yaIniciado = bloqueYaIniciado(reserva.fecha, reserva.bloque.horaInicio);
  const diaDeCambio = diaHabilAnterior(reserva.fecha) === hoyEnBogota();

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-semibold capitalize text-neutral-900">
            {nombreDeFecha(reserva.fecha)}
          </p>
          <span
            className={`rounded-full border px-2 py-0.5 text-xs ${
              activa ? 'border-green-600 text-green-700' : 'border-neutral-400 text-neutral-500'
            }`}
          >
            {ETIQUETAS[reserva.estado]}
          </span>
        </div>
        <p className="mt-1 text-sm text-neutral-600">
          Bloque {reserva.bloque.horaInicio} – {reserva.bloque.horaFin}
          {reserva.canceladaEn && ' (cancelada)'}
        </p>
        {/* RN5: el cambio de bloque solo vale el día hábil anterior. */}
        {!yaIniciado && !diaDeCambio && (
          <p className="mt-1 text-xs text-neutral-500">
            El cambio de bloque solo se permite el día hábil anterior a la reserva.
          </p>
        )}
        {/* RN6: después de la hora de inicio ya no se puede cancelar. */}
        {activa && yaIniciado && (
          <p className="mt-1 text-xs text-neutral-500">
            El bloque ya inició, por eso ya no se puede cancelar.
          </p>
        )}
      </div>

      {activa && (
        <div className="flex flex-wrap gap-2">
          <Boton className="self-start" disabled={yaIniciado} onClick={() => onCambiar(reserva)}>
            Cambiar bloque
          </Boton>
          <Boton
            className="self-start"
            disabled={yaIniciado || cancelando}
            onClick={() => onCancelar(reserva)}
          >
            {cancelando ? 'Cancelando…' : 'Cancelar'}
          </Boton>
        </div>
      )}
    </article>
  );
}
