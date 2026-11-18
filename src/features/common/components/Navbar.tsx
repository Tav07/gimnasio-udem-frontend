'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

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

  function esActual(ruta: string): boolean {
    return ruta === '/' ? rutaActual === '/' : rutaActual.startsWith(ruta);
  }

  function clase(ruta: string): string {
    return esActual(ruta) ? 'font-semibold text-udem' : 'text-neutral-700 hover:text-udem';
  }

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-udem">
          Gimnasio UdeM
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Principal">
          {RUTAS.map((rutaObj) => (
            <Link
              key={rutaObj.ruta}
              href={rutaObj.ruta}
              className={`text-sm ${clase(rutaObj.ruta)}`}
              aria-current={esActual(rutaObj.ruta) ? 'page' : undefined}
            >
              {rutaObj.texto}
            </Link>
          ))}
          <Link href="/login" className="text-sm font-medium text-udem hover:underline">
            Iniciar sesión
          </Link>
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
          {RUTAS.map((rutaObj) => (
            <Link
              key={rutaObj.ruta}
              href={rutaObj.ruta}
              className={`py-1 text-sm ${clase(rutaObj.ruta)}`}
              onClick={() => setAbierto(false)}
            >
              {rutaObj.texto}
            </Link>
          ))}
          <Link
            href="/login"
            className="py-1 text-sm font-medium text-udem"
            onClick={() => setAbierto(false)}
          >
            Iniciar sesión
          </Link>
        </nav>
      )}
    </header>
  );
}
