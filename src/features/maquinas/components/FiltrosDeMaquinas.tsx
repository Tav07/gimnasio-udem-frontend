'use client';

import { useState, FormEvent } from 'react';
import { CATEGORIAS, CategoriaMaquina, etiquetaDeCategoria } from '../domain/tipos';

interface Propiedades {
  categoria: CategoriaMaquina | null;
  buscar: string;
  onCambiarCategoria: (categoria: CategoriaMaquina | null) => void;
  onAplicarBusqueda: (buscar: string) => void;
}

export function FiltrosDeMaquinas({
  categoria,
  buscar,
  onCambiarCategoria,
  onAplicarBusqueda,
}: Propiedades) {
  const [texto, setTexto] = useState(buscar);

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    onAplicarBusqueda(texto.trim());
  }

  return (
    <div className="flex flex-col gap-4">
      <form role="search" className="flex gap-2" onSubmit={enviar}>
        <label htmlFor="buscar" className="sr-only">
          Buscar máquina por nombre
        </label>
        <input
          id="buscar"
          type="search"
          className="w-full rounded border border-neutral-300 bg-white px-3 py-2 focus:border-udem focus:outline-none focus:ring-2 focus:ring-udem/30"
          placeholder="Buscar por nombre…"
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
        />
        <button
          type="submit"
          className="shrink-0 rounded bg-udem px-4 py-2 text-sm font-medium text-white hover:bg-udem-oscuro"
        >
          Buscar
        </button>
      </form>
      <div className="flex flex-wrap gap-1">
        {[null, ...CATEGORIAS].map((valor) => (
          <button
            key={valor ?? 'todas'}
            type="button"
            aria-pressed={categoria === valor}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              categoria === valor
                ? 'border-udem bg-udem text-white'
                : 'border-neutral-300 text-neutral-700 hover:border-udem hover:text-udem'
            }`}
            onClick={() => onCambiarCategoria(valor)}
          >
            {valor === null ? 'Todas' : etiquetaDeCategoria(valor)}
          </button>
        ))}
      </div>
    </div>
  );
}
