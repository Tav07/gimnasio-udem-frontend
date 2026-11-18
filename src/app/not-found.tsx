import Link from 'next/link';

export default function NoEncontrado() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-6xl font-bold text-udem">404</p>
      <h1 className="text-2xl font-semibold text-neutral-900">Página no encontrada</h1>
      <p className="max-w-md text-neutral-600">
        La dirección que buscas no existe o cambió. Puedes volver al inicio o mirar el catálogo de
        máquinas.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded bg-udem px-4 py-2 text-sm font-medium text-white hover:bg-udem-oscuro"
        >
          Volver al inicio
        </Link>
        <Link
          href="/maquinas"
          className="rounded border border-udem px-4 py-2 text-sm font-medium text-udem hover:bg-udem/10"
        >
          Ver máquinas
        </Link>
      </div>
    </main>
  );
}
