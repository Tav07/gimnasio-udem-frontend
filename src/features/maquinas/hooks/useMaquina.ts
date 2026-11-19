'use client';

import { useCallback, useEffect, useState } from 'react';
import { ErrorDeApi } from '@/features/common/domain/tipos';
import { Maquina } from '../domain/tipos';
import { obtenerMaquina } from '../services/maquinasServicio';

type Estado =
  | { situacion: 'cargando' }
  | { situacion: 'encontrada'; maquina: Maquina }
  | { situacion: 'no-encontrada' }
  | { situacion: 'error' };

// Carga una máquina por id; distingue el 404 del backend de cualquier otro fallo.
export function useMaquina(id: string) {
  const [estado, setEstado] = useState<Estado>({ situacion: 'cargando' });
  const [intentos, setIntentos] = useState(0);

  useEffect(() => {
    let activo = true;
    obtenerMaquina(id)
      .then((maquina) => {
        if (activo) {
          setEstado({ situacion: 'encontrada', maquina });
        }
      })
      .catch((excepcion) => {
        if (!activo) {
          return;
        }
        if (excepcion instanceof ErrorDeApi && excepcion.estado === 404) {
          setEstado({ situacion: 'no-encontrada' });
        } else {
          setEstado({ situacion: 'error' });
        }
      });
    return () => {
      activo = false;
    };
  }, [id, intentos]);

  const recargar = useCallback(() => {
    setIntentos((n) => n + 1);
  }, []);

  const cargando = estado.situacion === 'cargando';
  return {
    maquina: estado.situacion === 'encontrada' ? estado.maquina : null,
    cargando,
    noEncontrada: estado.situacion === 'no-encontrada',
    error: estado.situacion === 'error',
    recargar,
  };
}
