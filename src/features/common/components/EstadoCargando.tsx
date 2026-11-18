interface Propiedades {
  texto?: string;
}

export function EstadoCargando({ texto = 'Cargando…' }: Propiedades) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 p-8 text-neutral-600">
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-udem"
      />
      {texto}
    </div>
  );
}
