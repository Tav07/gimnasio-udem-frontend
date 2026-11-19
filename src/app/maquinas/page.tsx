'use client';

import { useState } from 'react';
import { Paginacion } from '@/features/common/components/Paginacion';
import { EstadoCargando } from '@/features/common/components/EstadoCargando';
import { EstadoError } from '@/features/common/components/EstadoError';
import { EstadoVacio } from '@/features/common/components/EstadoVacio';
import { CategoriaMaquina } from '@/features/maquinas/domain/tipos';
import { useMaquinas } from '@/features/maquinas/hooks/useMaquinas';
import { FiltrosDeMaquinas } from '@/features/maquinas/components/FiltrosDeMaquinas';
import { TarjetaMaquina } from '@/features/maquinas/components/TarjetaMaquina';

export default function PaginaMaquinas() {
  // La página es dueña de los filtros; el hook vuelve a consultar cuando cambian.
  const [pagina, setPagina] = useState(1);
  const [categoria, setCategoria] = useState<CategoriaMaquina | null>(null);
  const [buscar, setBuscar] = useState('');

  const { maquinas, paginaActual, totalPaginas, total, cargando, error, recargar } = useMaquinas({
    pagina,
    // 9 por página: la cuadrícula muestra tres filas de tres completas.
    limite: 9,
    categoria: categoria ?? undefined,
    buscar: buscar || undefined,
  });

  const resumen = cargando
    ? null
    : error
      ? null
      : total === 0
        ? 'Sin resultados'
        : total === 1
          ? '1 máquina'
          : `${total} máquinas`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-neutral-900">Catálogo de máquinas</h1>
      <p className="mt-2 max-w-xl text-neutral-600">
        Consulta todas las máquinas del gimnasio antes de reservar tu bloque.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        <FiltrosDeMaquinas
          categoria={categoria}
          buscar={buscar}
          onCambiarCategoria={(nueva) => {
            setCategoria(nueva);
            setPagina(1);
          }}
          onAplicarBusqueda={(texto) => {
            setBuscar(texto);
            setPagina(1);
          }}
        />

        <div>
          {resumen && (
            <p className="mb-3 text-sm text-neutral-500" aria-live="polite">
              {resumen}
            </p>
          )}

          {cargando && <EstadoCargando texto="Cargando máquinas…" />}

          {!cargando && error && <EstadoError mensaje={error.mensaje} onReintentar={recargar} />}

          {!cargando && !error && maquinas.length === 0 && (
            <EstadoVacio mensaje="No hay máquinas que coincidan con la búsqueda" />
          )}

          {!cargando && !error && maquinas.length > 0 && (
            <>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {maquinas.map((maquina) => (
                  <li key={maquina.id}>
                    <TarjetaMaquina maquina={maquina} />
                  </li>
                ))}
              </ul>
              <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
