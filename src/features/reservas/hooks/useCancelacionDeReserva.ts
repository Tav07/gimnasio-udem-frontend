'use client';

import { useCallback, useState } from 'react';
import { ErrorDeApi } from '@/features/common/domain/tipos';
import { cancelarReserva } from '../services/reservasServicio';

const MENSAJE_POR_DEFECTO = 'No se pudo cancelar la reserva, vuelve a intentarlo';

// La cancelación se dispara desde el diálogo de confirmación, no desde un
// efecto: la página muestra un diálogo por reserva y espera el resultado.
export function useCancelacionDeReserva(onCancelada: () => void) {
  const [cancelando, setCancelando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cancelar = useCallback(
    async (reservaId: string) => {
      setCancelando(reservaId);
      setError(null);
      try {
        await cancelarReserva(reservaId);
        onCancelada();
      } catch (excepcion) {
        const api = excepcion instanceof ErrorDeApi ? excepcion.respuesta : null;
        setError(api ? api.mensaje : MENSAJE_POR_DEFECTO);
      } finally {
        setCancelando(null);
      }
    },
    [onCancelada],
  );

  return { cancelar, cancelando, error, limpiarError: () => setError(null) };
}
