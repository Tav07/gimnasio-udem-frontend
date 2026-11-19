'use client';

import { useCallback, useState } from 'react';
import { ErrorApi, ErrorDeApi } from '@/features/common/domain/tipos';
import { DatosDeMaquina, Maquina } from '../domain/tipos';
import { crearMaquina, editarMaquina } from '../services/maquinasServicio';

const MENSAJE_POR_DEFECTO: ErrorApi = {
  mensaje: 'No se pudo guardar la máquina, vuelve a intentarlo',
};

// Guarda una máquina (crear o editar) y devuelve el error del intento o null;
// la imagen siempre viaja como archivo. `alGuardar` corre solo si el backend
// aceptó la operación.
export function useGuardadoDeMaquina(alGuardar: (maquina: Maquina) => void) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<ErrorApi | null>(null);

  const guardar = useCallback(
    async (
      id: string | null,
      datos: DatosDeMaquina,
      imagen: File | null,
      estado: Maquina['estado'] | null,
    ): Promise<boolean> => {
      setGuardando(true);
      setError(null);
      try {
        const maquinaGuardada =
          id !== null
            ? await editarMaquina(id, { ...datos, estado: estado ?? 'DISPONIBLE' }, imagen)
            : await crearMaquina(datos, imagen);
        alGuardar(maquinaGuardada);
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
