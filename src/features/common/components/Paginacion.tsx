'use client';

interface Propiedades {
  pagina: number;
  totalPaginas: number;
  onCambiar: (pagina: number) => void;
}

export function Paginacion({ pagina, totalPaginas, onCambiar }: Propiedades) {
  if (totalPaginas <= 1) {
    return null;
  }

  const inicio = Math.max(1, pagina - 2);
  const fin = Math.min(totalPaginas, inicio + 4);
  const numeros = [];
  for (let numero = inicio; numero <= fin; numero += 1) {
    numeros.push(numero);
  }

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-1 p-4">
      <BotonPagina rotulo="Anterior" activo={pagina > 1} onClick={() => onCambiar(pagina - 1)} />
      {numeros.map((numero) => (
        <button
          key={numero}
          type="button"
          aria-current={numero === pagina ? 'page' : undefined}
          aria-label={`Página ${numero}`}
          className={
            numero === pagina
              ? 'rounded bg-udem px-3 py-1 text-sm font-medium text-white'
              : 'rounded px-3 py-1 text-sm text-neutral-700 hover:bg-udem/10'
          }
          onClick={() => onCambiar(numero)}
        >
          {numero}
        </button>
      ))}
      <BotonPagina
        rotulo="Siguiente"
        activo={pagina < totalPaginas}
        onClick={() => onCambiar(pagina + 1)}
      />
    </nav>
  );
}

function BotonPagina({
  rotulo,
  activo,
  onClick,
}: {
  rotulo: string;
  activo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={!activo}
      className={`rounded px-3 py-1 text-sm text-neutral-700 hover:bg-udem/10 disabled:cursor-not-allowed disabled:text-neutral-400 disabled:hover:bg-transparent`}
      onClick={onClick}
    >
      {rotulo}
    </button>
  );
}
