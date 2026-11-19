'use client';

import { useCallback, useState } from 'react';
import { ErrorApi, ErrorDeApi } from '@/features/common/domain/tipos';
import { EstadoRegistro } from '../domain/tipos';
import { DatosDeBloque, crearBloque, editarBloque } from '../services/bloquesServicio';

const MENSAJE_POR_DEFECTO: ErrorApi = {
  mensaje: 'No se pudo guardar el bloque, vuelve a intentarlo',
};

// Guarda un bloque (crear o editar, con estado en edición); los errores del
// backend, como el traslape (409) o el rango fuera de 06:00–20:00 (400),
// suben a la UI con los detalles que trae la respuesta.
export function useGuardadoDeBloque(alGuardar: () => void) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<ErrorApi | null>(null);

  const guardar = useCallback(
    async (
      id: string | null,
      datos: DatosDeBloque,
      estado: EstadoRegistro | null,
    ): Promise<boolean> => {
      setGuardando(true);
      setError(null);
      try {
        if (id !== null) {
          await editarBloque(id, { ...datos, estado: estado ?? undefined });
        } else {
          await crearBloque(datos);
        }
        alGuardar();
        return true;
      } catch (excepcion) {
        setError(excepcion instanceof ErrorDeApi ? excepcion.respuesta : MENSAJE_POR_DEFECTO);
        return false;
      } finally {
        setGuardando(false);
      }
    },
    [alGuardar],
  );

  return { guardar, guardando, error };
}
