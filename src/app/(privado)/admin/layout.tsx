'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EstadoCargando } from '@/features/common/components/EstadoCargando';
import { useSesion } from '@/features/auth/hooks/useSesion';

// Guard de rol dentro de /admin: quien ya pasó el guard privado pero no es
// ADMIN vuelve a /reservar, donde sí puede hacer algo.
export default function LayoutAdmin({ children }: { children: ReactNode }) {
  const { sesion, cargandoSesion } = useSesion();
  const router = useRouter();

  useEffect(() => {
    if (!cargandoSesion && sesion && sesion.rol !== 'ADMIN') {
      router.replace('/reservar');
    }
  }, [cargandoSesion, sesion, router]);

  if (cargandoSesion) {
    return <EstadoCargando texto="Revisando la sesión…" />;
  }
  if (!sesion || sesion.rol !== 'ADMIN') {
    return null;
  }
  return <>{children}</>;
}
