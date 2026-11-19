'use client';

import { useCallback, useEffect, useState } from 'react';
import { ErrorApi } from '@/features/common/domain/tipos';
import { FiltrosDeMaquinas, Maquina } from '../domain/tipos';
import { listarMaquinas } from '../services/maquinasServicio';

const ERROR_DE_LISTA: ErrorApi = { mensaje: 'No se pudieron cargar las máquinas' };

// La página es dueña de los filtros; cada cambio vuelve a consultar la API.
// El efecto solo actualiza estado dentro de los callbacks de la promesa.
export function useMaquinas(filtros: FiltrosDeMaquinas) {
  const { pagina, limite, categoria, buscar } = filtros;
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<ErrorApi | null>(null);
  // Cada intento de recarga reactiva la consulta del efecto.
  const [intentos, setIntentos] = useState(0);

  useEffect(() => {
    let activo = true;
    listarMaquinas({ pagina, limite, categoria, buscar })
      .then((resultado) => {
        if (!activo) {
          return;
        }
        setMaquinas(resultado.data);
        setPaginaActual(resultado.pagination.currentPage);
        setTotalPaginas(resultado.pagination.totalPages);
        setTotal(resultado.pagination.total);
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
  }, [pagina, limite, categoria, buscar, intentos]);

  const recargar = useCallback(() => {
    setCargando(true);
    setIntentos((n) => n + 1);
  }, []);

  return { maquinas, paginaActual, totalPaginas, total, cargando, error, recargar };
}
