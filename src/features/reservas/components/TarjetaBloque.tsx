'use client';

import { Boton } from '@/features/common/components/Boton';
import { BloqueConCupos } from '@/features/bloques/domain/tipos';

interface Propiedades {
  bloque: BloqueConCupos;
  reservable: boolean;
  reservando: boolean;
  error: string | null;
  onReservar: (bloqueId: string) => void;
}

export function TarjetaBloque({ bloque, reservable, reservando, error, onReservar }: Propiedades) {
  const lleno = bloque.cuposDisponibles <= 0;
  const inactivo = bloque.estado === 'INACTIVO';
  const deshabilitado = !reservable || lleno || inactivo || reservando;

  return (
    <article className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-lg font-semibold text-neutral-900">
          {bloque.horaInicio} – {bloque.horaFin}
        </p>
        {lleno ? (
          <span className="rounded-full border border-red-600 px-2 py-0.5 text-xs text-red-700">
            Lleno
          </span>
        ) : inactivo ? (
          <span className="rounded-full border border-neutral-400 px-2 py-0.5 text-xs text-neutral-500">
            Inactivo
          </span>
        ) : (
          <span className="rounded-full border border-green-600 px-2 py-0.5 text-xs text-green-700">
            {bloque.cuposDisponibles === 1
              ? '1 cupo disponible'
              : `${bloque.cuposDisponibles} cupos disponibles`}
          </span>
        )}
      </div>

      <p className="text-sm text-neutral-500">Aforo de {bloque.aforo} personas</p>

      <Boton className="mt-auto" disabled={deshabilitado} onClick={() => onReservar(bloque.id)}>
        {reservando ? 'Reservando…' : 'Reservar'}
      </Boton>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </article>
  );
}
