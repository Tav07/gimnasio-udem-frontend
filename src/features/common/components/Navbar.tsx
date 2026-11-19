'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSesion } from '@/features/auth/hooks/useSesion';

interface Ruta {
  ruta: string;
  texto: string;
}

const RUTAS: Ruta[] = [
  { ruta: '/', texto: 'Inicio' },
  { ruta: '/maquinas', texto: 'Máquinas' },
  { ruta: '/reservar', texto: 'Reservar' },
  { ruta: '/mis-reservas', texto: 'Mis reservas' },
  { ruta: '/admin', texto: 'Administración' },
];

export function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const rutaActual = usePathname();
  const { sesion, cargandoSesion, cerrarSesion } = useSesion();
  const router = useRouter();

  function esActual(ruta: string): boolean {
    return ruta === '/' ? rutaActual === '/' : rutaActual.startsWith(ruta);
  }

  function clase(ruta: string): string {
    return esActual(ruta) ? 'font-semibold text-udem' : 'text-neutral-700 hover:text-udem';
  }

  function salir() {
    cerrarSesion();
    setAbierto(false);
    router.push('/');
  }

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" aria-label="Gimnasio UdeM, inicio" className="shrink-0">
          {/* Logo oficial de la Universidad de Medellín sobre fondo blanco. */}
          <Image
            src="/universidad_medellin.png"
            alt="Universidad de Medellín"
            width={360}
            height={104}
            className="h-20 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Principal">
          {RUTAS.map((ruta) => (
            <Link
              key={ruta.ruta}
              href={ruta.ruta}
              className={`text-sm ${clase(ruta.ruta)}`}
              aria-current={esActual(ruta.ruta) ? 'page' : undefined}
            >
              {ruta.texto}
            </Link>
          ))}
          <EspacioSesion
            sesion={sesion}
            cargando={cargandoSesion}
            nombreClase="text-sm"
            salir={salir}
          />
        </nav>

        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={abierto}
          className="rounded border border-neutral-300 px-2 py-1 text-sm md:hidden"
          onClick={() => setAbierto(!abierto)}
        >
          Menú
        </button>
      </div>

      {abierto && (
        <nav
          className="flex flex-col gap-1 border-t border-neutral-200 px-4 py-3 md:hidden"
          aria-label="Principal en móvil"
        >
          {RUTAS.map((ruta) => (
            <Link
              key={ruta.ruta}
              href={ruta.ruta}
              className={`py-1 text-sm ${clase(ruta.ruta)}`}
              onClick={() => setAbierto(false)}
            >
              {ruta.texto}
            </Link>
          ))}
          <EspacioSesion
            sesion={sesion}
            cargando={cargandoSesion}
            nombreClase="py-1 text-sm"
            salir={salir}
          />
        </nav>
      )}
    </header>
  );
}

interface PropiedadesEspacio {
  sesion: { nombre: string } | null;
  cargando: boolean;
  nombreClase: string;
  salir: () => void;
}

// Zona derecha del navbar: mientras recupera la sesión no muestra nada,
// con sesión el nombre y el logout, y sin sesión el acceso al login.
function EspacioSesion({ sesion, cargando, nombreClase, salir }: PropiedadesEspacio) {
  if (cargando) {
    return null;
  }
  if (sesion) {
    return (
      <div className={`flex items-center gap-3 ${nombreClase}`}>
        <span className="text-neutral-700">{sesion.nombre}</span>
        <button type="button" className="text-udem hover:underline" onClick={salir}>
          Cerrar sesión
        </button>
      </div>
    );
  }
  return (
    <Link href="/login" className={`${nombreClase} font-medium text-udem hover:underline`}>
      Iniciar sesión
    </Link>
  );
}
