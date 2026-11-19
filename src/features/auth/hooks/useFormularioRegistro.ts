'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorApi, ErrorDeApi } from '@/features/common/domain/tipos';
import { TipoUsuario } from '../domain/tipos';
import { useSesion } from './useSesion';

const ERROR_POR_DEFECTO: ErrorApi = { mensaje: 'No se pudo crear la cuenta, vuelve a intentarlo' };

const TIPOS: TipoUsuario[] = ['ESTUDIANTE', 'EMPLEADO', 'EGRESADO'];

export function useFormularioRegistro() {
  const { registrarse } = useSesion();
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [documento, setDocumento] = useState('');
  const [tipo, setTipo] = useState<TipoUsuario>('ESTUDIANTE');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ErrorApi | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await registrarse({ nombre, email, documento, tipo, password });
      router.push('/reservar');
    } catch (excepcion) {
      setError(excepcion instanceof ErrorDeApi ? excepcion.respuesta : ERROR_POR_DEFECTO);
    } finally {
      setEnviando(false);
    }
  }

  return {
    nombre,
    setNombre,
    email,
    setEmail,
    documento,
    setDocumento,
    tipo,
    setTipo,
    password,
    setPassword,
    tiposValidos: TIPOS,
    error,
    enviando,
    enviar,
  };
}
