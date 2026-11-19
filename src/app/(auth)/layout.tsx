'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EstadoCargando } from '@/features/common/components/EstadoCargando';
import { useSesion } from '@/features/auth/hooks/useSesion';

// Quien ya tiene sesión no vuelve a ver el login ni el registro.
export default function LayoutAutenticacion({ children }: { children: ReactNode }) {
  const { sesion, cargandoSesion } = useSesion();
  const router = useRouter();

  useEffect(() => {
    if (!cargandoSesion && sesion) {
      router.replace('/reservar');
    }
  }, [cargandoSesion, sesion, router]);

  if (cargandoSesion) {
    return <EstadoCargando texto="Revisando la sesión…" />;
  }
  if (sesion) {
    return null;
  }
  return <>{children}</>;
}
