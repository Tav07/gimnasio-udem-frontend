'use client';

import Link from 'next/link';
import { useMaquina } from '../hooks/useMaquina';
import { etiquetaDeCategoria, etiquetaDeEstado } from '../domain/tipos';
import { EstadoCargando } from '@/features/common/components/EstadoCargando';
import { EstadoError } from '@/features/common/components/EstadoError';
import { EstadoVacio } from '@/features/common/components/EstadoVacio';

export function DetalleMaquina({ id }: { id: string }) {
  const { maquina, cargando, noEncontrada, error, recargar } = useMaquina(id);

  if (cargando) {
    return <EstadoCargando texto="Cargando la máquina…" />;
  }
  if (noEncontrada) {
    return <EstadoVacio mensaje="No encontramos esta máquina, puede haber sido eliminada" />;
  }
  if (error || !maquina) {
    return <EstadoError mensaje="No se pudo cargar la máquina" onReintentar={recargar} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/maquinas" className="text-sm text-udem hover:underline">
          ← Volver al catálogo
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-neutral-900">{maquina.nombre}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex h-64 items-center justify-center overflow-hidden rounded-lg bg-neutral-100 md:h-80">
          {maquina.imagenUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={maquina.imagenUrl}
              alt={`Foto de la máquina ${maquina.nombre}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span aria-hidden="true" className="text-6xl text-neutral-300">
              🏋️
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-neutral-50 p-3">
              <dt className="text-xs uppercase tracking-wide text-neutral-500">Categoría</dt>
              <dd className="mt-1 font-medium text-neutral-900">
                {etiquetaDeCategoria(maquina.categoria)}
              </dd>
            </div>
            <div className="rounded-lg bg-neutral-50 p-3">
              <dt className="text-xs uppercase tracking-wide text-neutral-500">Estado</dt>
              <dd className="mt-1 font-medium text-neutral-900">
                {etiquetaDeEstado(maquina.estado)}
              </dd>
            </div>
          </dl>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Descripción
            </h2>
            <p className="mt-2 whitespace-pre-line text-neutral-700">{maquina.descripcion}</p>
          </div>

          <Link
            href="/reservar"
            className="mt-auto self-start rounded bg-udem px-4 py-2 text-sm font-medium text-white hover:bg-udem-oscuro"
          >
            Reservar un bloque
          </Link>
        </div>
      </div>
    </div>
  );
}
