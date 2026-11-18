'use client';

import { ReactNode, useEffect } from 'react';

interface Propiedades {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  children: ReactNode;
}

export function Modal({ abierto, onCerrar, titulo, children }: Propiedades) {
  useEffect(() => {
    if (!abierto) {
      return;
    }
    function alPulsar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        onCerrar();
      }
    }
    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [abierto, onCerrar]);

  if (!abierto) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCerrar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{titulo}</h2>
          <button
            type="button"
            aria-label="Cerrar"
            className="rounded px-2 text-xl leading-none text-neutral-500 hover:text-neutral-800"
            onClick={onCerrar}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
