'use client';

import { useState } from 'react';
import { Campo } from '@/features/common/components/Campo';
import { EstadoCargando } from '@/features/common/components/EstadoCargando';
import { EstadoError } from '@/features/common/components/EstadoError';
import { EstadoVacio } from '@/features/common/components/EstadoVacio';
import { ConfirmarDialogo } from '@/features/common/components/ConfirmarDialogo';
import { Reserva } from '@/features/reservas/domain/tipos';
import { hoyEnBogota, nombreDeFecha } from '@/features/reservas/domain/calendario';
import { useReservasDelDia } from '@/features/reservas/hooks/useReservasDelDia';
import { useCancelacionDeReserva } from '@/features/reservas/hooks/useCancelacionDeReserva';

const ETIQUETAS_DE_TIPO: Record<Reserva['usuario']['tipo'], string> = {
  ESTUDIANTE: 'Estudiante',
  EMPLEADO: 'Empleado',
  EGRESADO: 'Egresado',
};

// Control de acceso del día: el admin ve todas las reservas de la fecha que
// elija, agrupadas por bloque, con documento y tipo de usuario. También
// puede cancelar cualquier reserva.
export default function PaginaAdminReservas() {
  const [fecha, setFecha] = useState(hoyEnBogota());
  const [porCancelar, setPorCancelar] = useState<Reserva | null>(null);

  const { reservas, porBloque, cargando, error, recargar } = useReservasDelDia(fecha);

  const alCancelada = () => {
    setPorCancelar(null);
    recargar();
  };
  const { cancelar, cancelando, error: errorCancelacion } = useCancelacionDeReserva(alCancelada);

  const grupos = [...porBloque.entries()];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-neutral-900">Reservas del día</h1>
      <p className="mt-2 max-w-xl text-neutral-600">
        Control de acceso: lista de personas por bloque con nombre, documento y tipo de usuario.
      </p>

      <div className="mt-6 max-w-xs">
        <Campo
          label="Fecha"
          id="fecha"
          type="date"
          value={fecha}
          onChange={(evento) => setFecha(evento.target.value)}
        />
      </div>

      {errorCancelacion && (
        <p
          className="mt-6 rounded-lg border border-red-600 bg-red-50 p-4 text-red-700"
          role="alert"
        >
          {errorCancelacion}
        </p>
      )}

      <div className="mt-8">
        {cargando && <EstadoCargando texto="Cargando las reservas del día…" />}

        {!cargando && error && <EstadoError mensaje={error.mensaje} onReintentar={recargar} />}

        {!cargando && !error && reservas.length === 0 && (
          <EstadoVacio mensaje={`No hay reservas para el ${nombreDeFecha(fecha)}`} />
        )}

        {!cargando && !error && reservas.length > 0 && (
          <div className="flex flex-col gap-6">
            {grupos.map(([bloqueId, grupo]) => (
              <section key={bloqueId} className="rounded-lg border border-neutral-200 bg-white">
                <header className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3">
                  <h2 className="font-semibold text-neutral-900">
                    {grupo[0].bloque.horaInicio} – {grupo[0].bloque.horaFin}
                  </h2>
                  <span className="text-sm text-neutral-500">
                    {grupo.length} {grupo.length === 1 ? 'persona' : 'personas'}
                  </span>
                </header>
                <ul>
                  {grupo.map((reserva) => (
                    <li
                      key={reserva.id}
                      className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 odd:bg-neutral-50"
                    >
                      <div>
                        <p className="text-sm text-neutral-900">
                          {reserva.usuario.nombre}
                          {reserva.estado === 'CANCELADA' && (
                            <span className="ml-2 text-xs text-neutral-500">(cancelada)</span>
                          )}
                        </p>
                        <p className="text-xs text-neutral-500">
                          Documento {reserva.usuario.documento} ·{' '}
                          {ETIQUETAS_DE_TIPO[reserva.usuario.tipo]}
                        </p>
                      </div>
                      {reserva.estado === 'ACTIVA' && (
                        <button
                          type="button"
                          className="rounded px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:text-neutral-400"
                          disabled={cancelando === reserva.id}
                          onClick={() => setPorCancelar(reserva)}
                        >
                          {cancelando === reserva.id ? 'Cancelando…' : 'Cancelar'}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      <ConfirmarDialogo
        abierto={porCancelar !== null}
        titulo="Cancelar reserva"
        mensaje={
          porCancelar
            ? `Vas a cancelar la reserva de ${porCancelar.usuario.nombre} (${porCancelar.usuario.documento}) en el bloque ${porCancelar.bloque.horaInicio} – ${porCancelar.bloque.horaFin}. ¿Continuar?`
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
