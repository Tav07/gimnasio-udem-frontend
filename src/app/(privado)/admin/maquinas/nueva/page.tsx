'use client';

import { FormularioMaquina } from '@/features/maquinas/components/FormularioMaquina';

export default function PaginaNuevaMaquina() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold text-neutral-900">Nueva máquina</h1>
      <p className="mb-8 mt-2 text-neutral-600">
        Agrega una máquina al catálogo con su foto de referencia.
      </p>
      <FormularioMaquina id={null} />
    </div>
  );
}
