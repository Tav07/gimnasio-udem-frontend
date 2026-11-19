'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorApi, ErrorDeApi } from '@/features/common/domain/tipos';
import { useSesion } from './useSesion';

const ERROR_POR_DEFECTO: ErrorApi = { mensaje: 'No se pudo iniciar sesión, vuelve a intentarlo' };

export function useFormularioLogin() {
  const { iniciarSesion } = useSesion();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ErrorApi | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await iniciarSesion(email, password);
      router.push('/reservar');
    } catch (excepcion) {
      setError(excepcion instanceof ErrorDeApi ? excepcion.respuesta : ERROR_POR_DEFECTO);
    } finally {
      setEnviando(false);
    }
  }

  return { email, setEmail, password, setPassword, error, enviando, enviar };
}
