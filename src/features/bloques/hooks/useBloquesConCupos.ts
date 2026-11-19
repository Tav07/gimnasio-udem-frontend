'use client';

import { useCallback, useEffect, useState } from 'react';
import { ErrorApi } from '@/features/common/domain/tipos';
import { BloqueConCupos } from '../domain/tipos';
import { listarBloquesConCupos } from '../services/bloquesServicio';

const ERROR_DE_LISTA: ErrorApi = { mensaje: 'No se pudieron cargar los bloques' };

// Carga los bloques con sus cupos para una fecha; el efecto solo actualiza
// estado dentro de los callbacks de la promesa.
export function useBloquesConCupos(fecha: string) {
  const [bloques, setBloques] = useState<BloqueConCupos[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<ErrorApi | null>(null);
  const [intentos, setIntentos] = useState(0);

  useEffect(() => {
    let activo = true;
    listarBloquesConCupos(fecha)
      .then((lista) => {
        if (!activo) {
          return;
        }
        setBloques(lista);
        setError(null);
        setCargando(false);
      })
      .catch(() => {
        if (!activo) {
          return;
        }
        setBloques([]);
        setError(ERROR_DE_LISTA);
        setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [fecha, intentos]);

  // Al crear una reserva cambian los cupos, así que el panel vuelve a consultar.
  const recargar = useCallback(() => {
    setIntentos((n) => n + 1);
  }, []);

  return { bloques, cargando, error, recargar };
}
