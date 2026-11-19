'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EstadoCargando } from '@/features/common/components/EstadoCargando';
import { useSesion } from '@/features/auth/hooks/useSesion';

// Guard de las rutas privadas: sin sesión (o con token vencido) vuelve al
// login. Funciona escribiendo la URL a mano porque la verificación corre
// en el layout, no en un botón.
export default function LayoutPrivado({ children }: { children: ReactNode }) {
  const { sesion, cargandoSesion } = useSesion();
  const router = useRouter();

  useEffect(() => {
    if (!cargandoSesion && !sesion) {
      router.replace('/login');
    }
  }, [cargandoSesion, sesion, router]);

  if (cargandoSesion) {
    return <EstadoCargando texto="Revisando la sesión…" />;
  }
  if (!sesion) {
    return null;
  }
  return <>{children}</>;
}
