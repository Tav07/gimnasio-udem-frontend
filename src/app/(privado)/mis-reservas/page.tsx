'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Paginacion } from '@/features/common/components/Paginacion';
import { EstadoCargando } from '@/features/common/components/EstadoCargando';
import { EstadoError } from '@/features/common/components/EstadoError';
import { EstadoVacio } from '@/features/common/components/EstadoVacio';
import { Modal } from '@/features/common/components/Modal';
import { ConfirmarDialogo } from '@/features/common/components/ConfirmarDialogo';
import { Reserva } from '@/features/reservas/domain/tipos';
import { nombreDeFecha } from '@/features/reservas/domain/calendario';
import { useMisReservas } from '@/features/reservas/hooks/useMisReservas';
import { useCancelacionDeReserva } from '@/features/reservas/hooks/useCancelacionDeReserva';
import { TarjetaReserva } from '@/features/reservas/components/TarjetaReserva';
import { SelectorDeBloque } from '@/features/reservas/components/SelectorDeBloque';

type FiltroEstado = 'ACTIVA' | 'CANCELADA' | null;

const FILTROS: { valor: FiltroEstado; texto: string }[] = [
  { valor: null, texto: 'Todas' },
  { valor: 'ACTIVA', texto: 'Activas' },
  { valor: 'CANCELADA', texto: 'Canceladas' },
];

export default function PaginaMisReservas() {
  const [pagina, setPagina] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>(null);
  // Los diálogos viven en la página: cada uno guarda la reserva en cuestión.
  const [porCancelar, setPorCancelar] = useState<Reserva | null>(null);
  const [porCambiar, setPorCambiar] = useState<Reserva | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const { reservas, paginaActual, totalPaginas, cargando, error, recargar } = useMisReservas({
    pagina,
    estado: filtroEstado,
  });

  const alCancelada = useCallback(() => {
    setPorCancelar(null);
    setAviso('La reserva quedó cancelada.');
    recargar();
  }, [recargar]);
  const { cancelar, cancelando, error: errorCancelacion } = useCancelacionDeReserva(alCancelada);

  function cambiarFiltro(valor: FiltroEstado) {
    setFiltroEstado(valor);
    setPagina(1);
    setAviso(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-neutral-900">Mis reservas</h1>
      <p className="mt-2 max-w-xl text-neutral-600">
        Puedes cambiar de bloque hasta el día hábil anterior y cancelar antes de que inicie el
        bloque.
      </p>

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

      {errorCancelacion && (
        <p
          className="mt-6 rounded-lg border border-red-600 bg-red-50 p-4 text-red-700"
          role="alert"
        >
          {errorCancelacion}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-1">
        {FILTROS.map((opcion) => (
          <button
            key={opcion.texto}
            type="button"
            aria-pressed={filtroEstado === opcion.valor}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              filtroEstado === opcion.valor
                ? 'border-udem bg-udem text-white'
                : 'border-neutral-300 text-neutral-700 hover:border-udem hover:text-udem'
            }`}
            onClick={() => cambiarFiltro(opcion.valor)}
          >
            {opcion.texto}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {cargando && <EstadoCargando texto="Cargando tus reservas…" />}

        {!cargando && error && <EstadoError mensaje={error.mensaje} onReintentar={recargar} />}

        {!cargando && !error && reservas.length === 0 && (
          <EstadoVacio mensaje="No tienes reservas con este filtro" />
        )}
        {!cargando && !error && reservas.length === 0 && (
          <p className="text-center text-sm">
            <Link href="/reservar" className="text-udem underline">
              Ir a reservar
            </Link>
          </p>
        )}

        {!cargando && !error && reservas.length > 0 && (
          <>
            <ul className="flex flex-col gap-3">
              {reservas.map((reserva) => (
                <li key={reserva.id}>
                  <TarjetaReserva
                    reserva={reserva}
                    cancelando={cancelando === reserva.id}
                    onCancelar={setPorCancelar}
                    onCambiar={setPorCambiar}
                  />
                </li>
              ))}
            </ul>
            <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
          </>
        )}
      </div>

      {porCambiar && (
        <Modal abierto onCerrar={() => setPorCambiar(null)} titulo="Cambiar de bloque">
          <SelectorDeBloque
            reserva={porCambiar}
            onCambiada={() => {
              setPorCambiar(null);
              setAviso('Tu reserva cambió de bloque.');
              recargar();
            }}
          />
        </Modal>
      )}

      <ConfirmarDialogo
        abierto={porCancelar !== null}
        titulo="Cancelar reserva"
        mensaje={
          porCancelar
            ? `Vas a cancelar tu reserva del ${nombreDeFecha(porCancelar.fecha).replace(/^./, (c) =>
                c.toUpperCase(),
              )} en el bloque ${porCancelar.bloque.horaInicio} – ${
                porCancelar.bloque.horaFin
              }. ¿Continuar?`
            : ''
        }
        textoConfirmar="Sí, cancelar"
        cargando={cancelando !== null}
        onConfirmar={() => porCancelar && cancelar(porCancelar.id)}
        onCancelar={() => setPorCancelar(null)}
      />
    </div>
  );
}
