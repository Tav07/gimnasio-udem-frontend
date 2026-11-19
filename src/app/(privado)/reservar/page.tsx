'use client';

import Link from 'next/link';
import { EstadoCargando } from '@/features/common/components/EstadoCargando';
import { EstadoError } from '@/features/common/components/EstadoError';
import { EstadoVacio } from '@/features/common/components/EstadoVacio';
import { Reserva } from '@/features/reservas/domain/tipos';
import {
  diaHabilAnterior,
  esDiaHabil,
  hoyEnBogota,
  nombreDeDia,
  nombreDeFecha,
  siguienteDiaHabil,
} from '@/features/reservas/domain/calendario';
import { useBloquesConCupos } from '@/features/bloques/hooks/useBloquesConCupos';
import { useCrearReserva } from '@/features/reservas/hooks/useCrearReserva';
import { TarjetaBloque } from '@/features/reservas/components/TarjetaBloque';

export default function PaginaReservar() {
  const hoy = hoyEnBogota();
  const fechaObjetivo = siguienteDiaHabil(hoy);
  // RN5: solo el día hábil anterior. Viernes → lunes; sábado y domingo → nada.
  // diaHabilAnterior siempre devuelve un día hábil, así que solo igualar basta.
  const reservable = diaHabilAnterior(fechaObjetivo) === hoy;

  const { bloques, cargando, error, recargar } = useBloquesConCupos(fechaObjetivo);
  const {
    crear,
    bloqueReservando,
    error: errorReserva,
    reservaCreada,
  } = useCrearReserva(fechaObjetivo);

  async function reservar(bloqueId: string) {
    await crear(bloqueId);
    recargar();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-neutral-900">Reservar</h1>
      <p className="mt-2 max-w-xl text-neutral-600">
        Las reservas se hacen el día hábil anterior. La fecha objetivo es{' '}
        <strong className="text-neutral-900">{nombreDeFecha(fechaObjetivo)}</strong>.
      </p>

      {!esDiaHabil(hoy) && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-amber-500 bg-amber-50 p-4 text-amber-900"
        >
          Hoy es {nombreDeDia(hoy)}, un día no hábil. El gimnasio recibe reservas de lunes a
          viernes; puedes volver el próximo día hábil.
        </div>
      )}

      {esDiaHabil(hoy) && !reservable && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-amber-500 bg-amber-50 p-4 text-amber-900"
        >
          Para reservar {nombreDeFecha(fechaObjetivo)} debes hacerlo desde{' '}
          {nombreDeFecha(diaHabilAnterior(fechaObjetivo))}.
        </div>
      )}

      {reservaCreada && <ConfirmacionReserva reserva={reservaCreada} />}

      <div className="mt-8">
        {cargando && <EstadoCargando texto="Cargando los bloques…" />}

        {!cargando && error && <EstadoError mensaje={error.mensaje} onReintentar={recargar} />}

        {!cargando && !error && bloques.length === 0 && (
          <EstadoVacio mensaje="No hay bloques activos para esta fecha" />
        )}

        {!cargando && !error && bloques.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bloques.map((bloque) => (
              <li key={bloque.id}>
                <TarjetaBloque
                  bloque={bloque}
                  reservable={reservable}
                  reservando={bloqueReservando === bloque.id}
                  error={
                    errorReserva && errorReserva.bloqueId === bloque.id
                      ? errorReserva.mensaje
                      : null
                  }
                  onReservar={reservar}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ConfirmacionReserva({ reserva }: { reserva: Reserva }) {
  return (
    <div
      role="status"
      className="mt-6 rounded-lg border border-green-600 bg-green-50 p-4 text-green-900"
    >
      <p className="font-medium">
        Reserva confirmada para el {nombreDeFecha(reserva.fecha)}, bloque{' '}
        {reserva.bloque.horaInicio} – {reserva.bloque.horaFin}.
      </p>
      <p className="mt-1 text-sm">
        Preséntate con tu documento. Puedes verla en{' '}
        <Link href="/mis-reservas" className="font-medium underline">
          Mis reservas
        </Link>
        .
      </p>
    </div>
  );
}
