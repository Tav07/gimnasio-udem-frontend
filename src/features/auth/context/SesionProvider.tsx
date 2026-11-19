'use client';

import { createContext, useCallback, useEffect, useState, ReactNode } from 'react';
import {
  iniciarSesion as servicioIniciar,
  registrar as servicioRegistrar,
  obtenerActual,
  cerrarSesion as servicioCerrar,
} from '../services/sesionServicio';
import { RegistroNuevo, UsuarioActivo } from '../domain/tipos';

interface Contexto {
  sesion: UsuarioActivo | null;
  cargandoSesion: boolean;
  iniciarSesion(email: string, password: string): Promise<UsuarioActivo>;
  registrarse(datos: RegistroNuevo): Promise<UsuarioActivo>;
  cerrarSesion(): void;
}

export const ContextoSesion = createContext<Contexto | null>(null);

export function SesionProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<UsuarioActivo | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    async function recuperar() {
      try {
        setSesion(await obtenerActual());
      } catch {
        // Sin sesión válida; httpClient ya limpió el token en el 401.
        setSesion(null);
      } finally {
        setCargandoSesion(false);
      }
    }
    recuperar();
  }, []);

  const iniciarSesion = useCallback(async (email: string, password: string) => {
    const usuario = await servicioIniciar(email, password);
    setSesion(usuario);
    return usuario;
  }, []);

  const registrarse = useCallback(async (datos: RegistroNuevo) => {
    const usuario = await servicioRegistrar(datos);
    setSesion(usuario);
    return usuario;
  }, []);

  const cerrarSesion = useCallback(() => {
    servicioCerrar();
    setSesion(null);
  }, []);

  return (
    <ContextoSesion.Provider
      value={{ sesion, cargandoSesion, iniciarSesion, registrarse, cerrarSesion }}
    >
      {children}
    </ContextoSesion.Provider>
  );
}
