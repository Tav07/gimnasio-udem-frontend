'use client';

import { Boton } from './Boton';

interface Propiedades {
  mensaje?: string;
  onReintentar?: () => void;
}

export function EstadoError({
  mensaje = 'Ocurrió un error al cargar los datos',
  onReintentar,
}: Propiedades) {
  return (
    <div role="alert" className="p-8 text-center text-red-700">
      <p>{mensaje}</p>
      {onReintentar && (
        <Boton variante="secundario" className="mt-4" onClick={onReintentar}>
          Reintentar
        </Boton>
      )}
    </div>
  );
}
