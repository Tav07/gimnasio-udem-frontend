'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Paginacion } from '@/features/common/components/Paginacion';
import { EstadoCargando } from '@/features/common/components/EstadoCargando';
import { EstadoError } from '@/features/common/components/EstadoError';
import { EstadoVacio } from '@/features/common/components/EstadoVacio';
import { ConfirmarDialogo } from '@/features/common/components/ConfirmarDialogo';
import { Maquina, etiquetaDeCategoria, etiquetaDeEstado } from '@/features/maquinas/domain/tipos';
import { useAdminMaquinas } from '@/features/maquinas/hooks/useAdminMaquinas';

type FiltroEstado = Maquina['estado'] | null;

const FILTROS: { valor: FiltroEstado; texto: string }[] = [
  { valor: null, texto: 'Activas' },
  { valor: 'DISPONIBLE', texto: 'Disponibles' },
  { valor: 'MANTENIMIENTO', texto: 'En mantenimiento' },
  { valor: 'INACTIVA', texto: 'Inactivas' },
];

export default function PaginaAdminMaquinas() {
  const [pagina, setPagina] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>(null);
  const [porEliminar, setPorEliminar] = useState<Maquina | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const { maquinas, paginaActual, totalPaginas, cargando, error, recargar, eliminar } =
    useAdminMaquinas({ pagina, estado: filtroEstado });

  async function confirmarEliminar() {
    if (!porEliminar) {
      return;
    }
    const falla = await eliminar(porEliminar.id);
    setPorEliminar(null);
    setAviso(falla ? falla.mensaje : `La máquina ${porEliminar.nombre} quedó eliminada.`);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Máquinas</h1>
          <p className="mt-2 text-neutral-600">
            Administra el catálogo del gimnasio. Eliminar oculta la máquina sin borrarla.
          </p>
        </div>
        <Link
          href="/admin/maquinas/nueva"
          className="rounded bg-udem px-4 py-2 text-sm font-medium text-white hover:bg-udem-oscuro"
        >
          Nueva máquina
        </Link>
      </div>

      {aviso && (
        <div
          role="status"
          className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-green-600 bg-green-50 p-4 text-green-900"
        >
          <p>{aviso}</p>
          <button
            type="button"
            aria-label="Quitar aviso"
            className="text-lg"
            onClick={() => setAviso(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-1">
        {FILTROS.map((opcion) => (
          <button
            key={opcion.valor ?? 'activas'}
            type="button"
            aria-pressed={filtroEstado === opcion.valor}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              filtroEstado === opcion.valor
                ? 'border-udem bg-udem text-white'
                : 'border-neutral-300 text-neutral-700 hover:border-udem hover:text-udem'
            }`}
            onClick={() => {
              setFiltroEstado(opcion.valor);
              setPagina(1);
            }}
          >
            {opcion.texto}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {cargando && <EstadoCargando texto="Cargando máquinas…" />}

        {!cargando && error && <EstadoError mensaje={error.mensaje} onReintentar={recargar} />}

        {!cargando && !error && maquinas.length === 0 && (
          <EstadoVacio mensaje="No hay máquinas con este filtro" />
        )}

        {!cargando && !error && maquinas.length > 0 && (
          <ul className="flex flex-col gap-3">
            {maquinas.map((maquina) => (
              <li
                key={maquina.id}
                className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3"
              >
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded bg-neutral-100">
                  {maquina.imagenUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={maquina.imagenUrl}
                      alt={`Foto de la máquina ${maquina.nombre}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-full w-full items-center justify-center text-2xl text-neutral-300"
                    >
                      🏋️
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-neutral-900">
                    {maquina.nombre}
                    {maquina.estado === 'INACTIVA' && (
                      <span className="ml-2 text-sm font-normal text-neutral-500">
                        {etiquetaDeEstado(maquina.estado)}
                      </span>
                    )}
                  </p>
                  <p className="truncate text-sm text-neutral-600">
                    {etiquetaDeCategoria(maquina.categoria)} · {maquina.descripcion}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/admin/maquinas/${maquina.id}/editar`}
                    className="rounded px-3 py-2 text-sm font-medium text-udem hover:bg-udem/10"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    className="rounded px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                    onClick={() => setPorEliminar(maquina)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {!cargando && !error && maquinas.length > 0 && (
          <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
        )}
      </div>

      <ConfirmarDialogo
        abierto={porEliminar !== null}
        titulo="Eliminar máquina"
        mensaje={
          porEliminar
            ? `Vas a eliminar "${porEliminar.nombre}". Ya no aparecerá en el catálogo. ¿Continuar?`
            : ''
        }
        textoConfirmar="Sí, eliminar"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setPorEliminar(null)}
      />
    </div>
  );
}
