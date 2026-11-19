'use client';

import { useCallback, useState } from 'react';
import { ErrorDeApi } from '@/features/common/domain/tipos';
import { cambiarBloque } from '../services/reservasServicio';

const MENSAJE_POR_DEFECTO = 'No se pudo cambiar la reserva, vuelve a intentarlo';

// Se invoca desde el selector del modal. Al terminar la página recarga la
// lista, así que solo maneja el bloque en curso y el error del intento.
export function useCambioDeBloque(onCambiada: () => void) {
  const [cambiando, setCambiando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cambiar = useCallback(
    async (reservaId: string, bloqueId: string) => {
      setCambiando(true);
      setError(null);
      try {
        await cambiarBloque(reservaId, bloqueId);
        onCambiada();
      } catch (excepcion) {
        const api = excepcion instanceof ErrorDeApi ? excepcion.respuesta : null;
        setError(api ? api.mensaje : MENSAJE_POR_DEFECTO);
      } finally {
        setCambiando(false);
      }
    },
    [onCambiada],
  );

  return { cambiar, cambiando, error };
}
