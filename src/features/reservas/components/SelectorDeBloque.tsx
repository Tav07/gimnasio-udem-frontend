'use client';

import { EstadoCargando } from '@/features/common/components/EstadoCargando';
import { EstadoError } from '@/features/common/components/EstadoError';
import { useBloquesConCupos } from '@/features/bloques/hooks/useBloquesConCupos';
import { Reserva } from '../domain/tipos';
import { diaHabilAnterior, hoyEnBogota } from '../domain/calendario';
import { useCambioDeBloque } from '../hooks/useCambioDeBloque';

interface Propiedades {
  reserva: Reserva;
  onCambiada: () => void;
}

// Cuerpo del modal para cambiar de bloque: muestra los bloques del mismo día
// con sus cupos y envía el cambio con PATCH. Vuelve a consultar la API solo
// mientras el modal está abierto.
export function SelectorDeBloque({ reserva, onCambiada }: Propiedades) {
  const { bloques, cargando, error, recargar } = useBloquesConCupos(reserva.fecha);
  const {
    cambiar,
    cambiando,
    error: errorCambio,
  } = useCambioDeBloque(() => {
    onCambiada();
  });

  // RN5: el cambio solo vale desde el día hábil anterior.
  const cambioPermitido = diaHabilAnterior(reserva.fecha) === hoyEnBogota();

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-neutral-600">
        Elige otro bloque del {reserva.fecha} para tu reserva. Cupos al momento de abrir este panel.
      </p>

      {cargando && <EstadoCargando texto="Cargando bloques…" />}

      {!cargando && error && <EstadoError mensaje={error.mensaje} onReintentar={recargar} />}

      {!cargando && errorCambio && (
        <p role="alert" className="text-sm text-red-700">
          {errorCambio}
        </p>
      )}

      {!cargando && !error && !cambioPermitido && (
        <p role="alert" className="rounded bg-amber-50 p-3 text-sm text-amber-900">
          El cambio de bloque solo se permite el día hábil anterior a la reserva.
        </p>
      )}

      {!cargando && !error && (
        <ul className="flex flex-col gap-2">
          {bloques.map((bloque) => {
            const actual = bloque.id === reserva.bloque.id;
            const agotado = bloque.cuposDisponibles <= 0;
            const inactivo = bloque.estado === 'INACTIVO';
            const deshabilitado = actual || agotado || inactivo || !cambioPermitido || cambiando;
            return (
              <li
                key={bloque.id}
                className={`flex items-center justify-between gap-3 rounded border p-3 ${
                  actual ? 'border-udem bg-udem/5' : 'border-neutral-200'
                }`}
              >
                <div>
                  <p className="font-medium text-neutral-900">
                    {bloque.horaInicio} – {bloque.horaFin}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {actual
                      ? 'Bloque actual de tu reserva'
                      : agotado
                        ? 'Bloque lleno'
                        : inactivo
                          ? 'Bloque inactivo'
                          : `${bloque.cuposDisponibles} ${
                              bloque.cuposDisponibles === 1 ? 'cupo' : 'cupos'
                            } disponibles`}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded bg-udem px-3 py-1.5 text-sm font-medium text-white hover:bg-udem-oscuro disabled:cursor-not-allowed disabled:bg-neutral-300"
                  disabled={deshabilitado}
                  onClick={() => cambiar(reserva.id, bloque.id)}
                >
                  {cambiando && !actual ? 'Cambiando…' : 'Mover aquí'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
