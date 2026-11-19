'use client';

import { useCallback, useEffect, useState } from 'react';
import { ErrorApi } from '@/features/common/domain/tipos';
import { BloqueConCupos, EstadoRegistro } from '../domain/tipos';
import { listarBloques } from '../services/bloquesServicio';

const ERROR_DE_LISTA: ErrorApi = { mensaje: 'No se pudieron cargar los bloques' };

// Listado para el panel de administración, con filtro por estado y
// eliminación lógica. El efecto actualiza el estado solo en los callbacks.
export function useAdminBloques(filtros: { pagina: number; estado: EstadoRegistro | null }) {
  const { pagina, estado } = filtros;
  const [bloques, setBloques] = useState<BloqueConCupos[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<ErrorApi | null>(null);
  const [intentos, setIntentos] = useState(0);

  useEffect(() => {
    let activo = true;
    listarBloques({ pagina, estado: estado ?? undefined })
      .then((resultado) => {
        if (!activo) {
          return;
        }
        setBloques(resultado.data);
        setPaginaActual(resultado.pagination.currentPage);
        setTotalPaginas(resultado.pagination.totalPages);
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
  }, [pagina, estado, intentos]);

  const recargar = useCallback(() => {
    setIntentos((n) => n + 1);
  }, []);

  return { bloques, paginaActual, totalPaginas, cargando, error, recargar };
}
