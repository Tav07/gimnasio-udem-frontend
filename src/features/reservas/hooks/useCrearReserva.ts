'use client';

import { useCallback, useState } from 'react';
import { ErrorDeApi } from '@/features/common/domain/tipos';
import { Reserva } from '../domain/tipos';
import { crearReserva } from '../services/reservasServicio';

export interface ReservaBloque {
  bloqueId: string;
  mensaje: string;
}

const MENSAJE_POR_DEFECTO = 'No se pudo crear la reserva, vuelve a intentarlo';

// Se invoca desde un clic, no desde un efecto: maneja el bloque que se está
// reservando, el error del último intento y la reserva creada.
export function useCrearReserva(fecha: string) {
  const [bloqueReservando, setBloqueReservando] = useState<string | null>(null);
  const [error, setError] = useState<ReservaBloque | null>(null);
  const [reservaCreada, setReservaCreada] = useState<Reserva | null>(null);

  const crear = useCallback(
    async (bloqueId: string) => {
      setBloqueReservando(bloqueId);
      setError(null);
      try {
        const reserva = await crearReserva(bloqueId, fecha);
        setReservaCreada(reserva);
      } catch (excepcion) {
        const respuesta = excepcion instanceof ErrorDeApi ? excepcion.respuesta : null;
        setError({
          bloqueId,
          mensaje: respuesta ? respuesta.mensaje : MENSAJE_POR_DEFECTO,
        });
      } finally {
        setBloqueReservando(null);
      }
    },
    [fecha],
  );

  return { crear, bloqueReservando, error, reservaCreada };
}
