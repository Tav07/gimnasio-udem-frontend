'use client';

import { useCallback, useEffect, useState } from 'react';
import { ErrorApi } from '@/features/common/domain/tipos';
import { Reserva } from '../domain/tipos';
import { listarReservas } from '../services/reservasServicio';

const ERROR_DE_LISTA: ErrorApi = { mensaje: 'No se pudieron cargar tus reservas' };

// La API separa las reservas por usuario: el filtro estado y la página van
// en la consulta; cada cambio dispara una nueva carga. El efecto actualiza
// el estado solo dentro de los callbacks de la promesa.
export function useMisReservas(filtros: { pagina: number; estado?: string | null }) {
  const { pagina, estado } = filtros;
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<ErrorApi | null>(null);
  const [intentos, setIntentos] = useState(0);

  useEffect(() => {
    let activo = true;
    listarReservas({
      pagina,
      limite: 10,
      estado: estado === 'ACTIVA' || estado === 'CANCELADA' ? estado : undefined,
    })
      .then((resultado) => {
        if (!activo) {
          return;
        }
        setReservas(resultado.data);
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
        setReservas([]);
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

  return { reservas, paginaActual, totalPaginas, total, cargando, error, recargar };
}
