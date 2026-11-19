'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorApi } from '@/features/common/domain/tipos';
import { Reserva } from '../domain/tipos';
import { listarReservas } from '../services/reservasServicio';

const ERROR_DE_LISTA: ErrorApi = { mensaje: 'No se pudieron cargar las reservas del día' };

// Vista de administración: todas las reservas de una fecha, agrupadas por
// bloque para el control de acceso. El ADMIN no filtra por usuario: la API
// devuelve todas.
export function useReservasDelDia(fecha: string) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<ErrorApi | null>(null);
  const [intentos, setIntentos] = useState(0);

  useEffect(() => {
    let activo = true;
    listarReservas({ pagina: 1, limite: 50, fecha })
      .then((resultado) => {
        if (!activo) {
          return;
        }
        setReservas(ordenar(resultado.data));
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
  }, [fecha, intentos]);

  const recargar = useCallback(() => {
    setIntentos((n) => n + 1);
  }, []);

  const porBloque = useMemo(() => {
    const grupos = new Map<string, Reserva[]>();
    for (const reserva of ordenar(reservas)) {
      const clave = reserva.bloque.id;
      const grupo = grupos.get(clave) ?? [];
      grupo.push(reserva);
      grupos.set(clave, grupo);
    }
    return grupos;
  }, [reservas]);

  return { reservas, porBloque, cargando, error, recargar };
}

// El control de acceso se lee por hora de inicio del bloque; de empate,
// por documento del usuario.
function ordenar(reservas: Reserva[]): Reserva[] {
  return [...reservas].sort((a, b) => {
    const diferencia = a.bloque.horaInicio.localeCompare(b.bloque.horaInicio);
    return diferencia !== 0 ? diferencia : a.usuario.documento.localeCompare(b.usuario.documento);
  });
}
