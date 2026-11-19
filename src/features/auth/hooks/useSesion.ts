'use client';

import { useContext } from 'react';
import { ContextoSesion } from '../context/SesionProvider';

export function useSesion() {
  const contexto = useContext(ContextoSesion);
  if (!contexto) {
    throw new Error('useSesion debe usarse dentro de SesionProvider');
  }
  return contexto;
}
