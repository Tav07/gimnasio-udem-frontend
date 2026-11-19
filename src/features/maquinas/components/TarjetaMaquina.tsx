import Link from 'next/link';
import { Maquina, etiquetaDeCategoria, etiquetaDeEstado } from '../domain/tipos';

const ESTILOS_DE_ESTADO: Record<string, string> = {
  DISPONIBLE: 'border-green-600 text-green-700',
  MANTENIMIENTO: 'border-amber-500 text-amber-700',
  INACTIVA: 'border-neutral-400 text-neutral-500',
};

export function TarjetaMaquina({ maquina }: { maquina: Maquina }) {
  return (
    <Link
      href={`/maquinas/${maquina.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="flex h-44 items-center justify-center bg-neutral-100">
        {maquina.imagenUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={maquina.imagenUrl}
            alt={`Foto de la máquina ${maquina.nombre}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden="true" className="text-4xl text-neutral-300">
            🏋️
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-neutral-900 group-hover:text-udem">
            {maquina.nombre}
          </h3>
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${ESTILOS_DE_ESTADO[maquina.estado] ?? 'border-neutral-400 text-neutral-500'}`}
          >
            {etiquetaDeEstado(maquina.estado)}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-neutral-600">{maquina.descripcion}</p>
        <p className="mt-auto text-xs font-medium uppercase tracking-wide text-udem">
          {etiquetaDeCategoria(maquina.categoria)}
        </p>
      </div>
    </Link>
  );
}
