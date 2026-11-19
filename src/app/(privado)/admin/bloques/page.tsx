'use client';

import { useState } from 'react';
import { Paginacion } from '@/features/common/components/Paginacion';
import { EstadoCargando } from '@/features/common/components/EstadoCargando';
import { EstadoError } from '@/features/common/components/EstadoError';
import { EstadoVacio } from '@/features/common/components/EstadoVacio';
import { Modal } from '@/features/common/components/Modal';
import { ConfirmarDialogo } from '@/features/common/components/ConfirmarDialogo';
import { Boton } from '@/features/common/components/Boton';
import { EstadoRegistro } from '@/features/bloques/domain/tipos';
import { useAdminBloques } from '@/features/bloques/hooks/useAdminBloques';
import { eliminarBloque } from '@/features/bloques/services/bloquesServicio';
import { FormularioBloque } from '@/features/bloques/components/FormularioBloque';
import { ErrorDeApi } from '@/features/common/domain/tipos';

type ModalDeBloque =
  | { tipo: 'crear' }
  | {
      tipo: 'editar';
      id: string;
      horaInicio: string;
      horaFin: string;
      aforo: number;
      estado: EstadoRegistro;
    }
  | null;

const FILTROS: { valor: EstadoRegistro | null; texto: string }[] = [
  { valor: 'ACTIVO', texto: 'Activos' },
  { valor: 'INACTIVO', texto: 'Inactivos' },
];

export default function PaginaAdminBloques() {
  const [pagina, setPagina] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState<EstadoRegistro | null>('ACTIVO');
  const [modal, setModal] = useState<ModalDeBloque>(null);
  const [porEliminar, setPorEliminar] = useState<{ id: string; etiqueta: string } | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const { bloques, paginaActual, totalPaginas, cargando, error, recargar } = useAdminBloques({
    pagina,
    estado: filtroEstado,
  });

  async function confirmarEliminar() {
    if (!porEliminar) {
      return;
    }
    setEliminando(true);
    try {
      await eliminarBloque(porEliminar.id);
      setAviso(`El bloque ${porEliminar.etiqueta} quedó inactivo.`);
      recargar();
    } catch (excepcion) {
      setAviso(
        excepcion instanceof ErrorDeApi
          ? excepcion.respuesta.mensaje
          : 'No se pudo eliminar el bloque',
      );
    } finally {
      setEliminando(false);
      setPorEliminar(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Bloques</h1>
          <p className="mt-2 text-neutral-600">
            Franjas de 2 horas con aforo. Los usuarios solo reservan en bloques activos.
          </p>
        </div>
        <Boton onClick={() => setModal({ tipo: 'crear' })}>Nuevo bloque</Boton>
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
            key={opcion.valor}
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
        {cargando && <EstadoCargando texto="Cargando bloques…" />}

        {!cargando && error && <EstadoError mensaje={error.mensaje} onReintentar={recargar} />}

        {!cargando && !error && bloques.length === 0 && (
          <EstadoVacio mensaje="No hay bloques con este filtro" />
        )}

        {!cargando && !error && bloques.length > 0 && (
          <>
            <ul className="flex flex-col gap-3">
              {bloques.map((bloque) => (
                <li
                  key={bloque.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-4"
                >
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {bloque.horaInicio} – {bloque.horaFin}
                      {bloque.estado === 'INACTIVO' && (
                        <span className="ml-2 rounded-full border border-neutral-400 px-2 py-0.5 text-xs font-normal text-neutral-500">
                          Inactivo
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-neutral-600">Aforo de {bloque.aforo} personas</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      className="rounded px-3 py-2 text-sm font-medium text-udem hover:bg-udem/10"
                      onClick={() =>
                        setModal({
                          tipo: 'editar',
                          id: bloque.id,
                          horaInicio: bloque.horaInicio,
                          horaFin: bloque.horaFin,
                          aforo: bloque.aforo,
                          estado: bloque.estado,
                        })
                      }
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="rounded px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                      onClick={() =>
                        setPorEliminar({
                          id: bloque.id,
                          etiqueta: `${bloque.horaInicio}–${bloque.horaFin}`,
                        })
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
          </>
        )}
      </div>

      {modal && (
        <Modal
          abierto
          onCerrar={() => setModal(null)}
          titulo={modal.tipo === 'crear' ? 'Nuevo bloque' : 'Editar bloque'}
        >
          <FormularioBloque
            bloqueAEditar={
              modal.tipo === 'editar'
                ? {
                    id: modal.id,
                    horaInicio: modal.horaInicio,
                    horaFin: modal.horaFin,
                    aforo: modal.aforo,
                    estado: modal.estado,
                  }
                : undefined
            }
            onGuardado={() => {
              setModal(null);
              setAviso(
                modal.tipo === 'crear' ? 'El bloque quedó creado.' : 'El bloque quedó actualizado.',
              );
              recargar();
            }}
            onCerrar={() => setModal(null)}
          />
        </Modal>
      )}

      <ConfirmarDialogo
        abierto={porEliminar !== null}
        titulo="Eliminar bloque"
        mensaje={
          porEliminar
            ? `Vas a eliminar el bloque ${porEliminar.etiqueta}. Los usuarios ya no podrán reservar en él. ¿Continuar?`
            : ''
        }
        textoConfirmar="Sí, eliminar"
        cargando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setPorEliminar(null)}
      />
    </div>
  );
}
