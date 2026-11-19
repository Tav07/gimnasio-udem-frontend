'use client';

import { useCallback, useEffect, useState } from 'react';
import { ErrorApi, ErrorDeApi } from '@/features/common/domain/tipos';
import { EstadoMaquina, Maquina } from '../domain/tipos';
import { eliminarMaquina, listarMaquinas } from '../services/maquinasServicio';

const ERROR_DE_LISTA: ErrorApi = { mensaje: 'No se pudieron cargar las máquinas' };

// Listado para el panel de administración: filtro por estado (incluye
// INACTIVA) y eliminación lógica con recarga de la lista.
export function useAdminMaquinas(filtros: { pagina: number; estado: EstadoMaquina | null }) {
  const { pagina, estado } = filtros;
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<ErrorApi | null>(null);
  const [intentos, setIntentos] = useState(0);

  useEffect(() => {
    let activo = true;
    listarMaquinas({ pagina, estado: estado ?? undefined })
      .then((resultado) => {
        if (!activo) {
          return;
        }
        setMaquinas(resultado.data);
        setPaginaActual(resultado.pagination.currentPage);
        setTotalPaginas(resultado.pagination.totalPages);
        setError(null);
        setCargando(false);
      })
      .catch(() => {
        if (!activo) {
          return;
        }
        setMaquinas([]);
        setError(ERROR_DE_LISTA);
        setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [pagina, estado, intentos]);

  const recargar = useCallback(() => {
    setIntentos((n) => n + 1);
  }, []);

  const eliminar = useCallback(
    async (id: string): Promise<ErrorApi | null> => {
      try {
        await eliminarMaquina(id);
        recargar();
        return null;
      } catch (excepcion) {
        // El mensaje del backend sube a la interfaz; si falla la red, uno
        // genérico.
        return excepcion instanceof ErrorDeApi
          ? excepcion.respuesta
          : { mensaje: 'No se pudo eliminar la máquina' };
      }
    },
    [recargar],
  );

  return { maquinas, paginaActual, totalPaginas, cargando, error, recargar, eliminar };
}
