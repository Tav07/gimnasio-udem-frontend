import { ErrorApi } from '@/features/common/domain/tipos';

// Muestra el mensaje de la API y, si hay, los detalles (campos inválidos).
export function CajaError({ error }: { error: ErrorApi }) {
  return (
    <div role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
      <p>{error.mensaje}</p>
      {error.detalles && error.detalles.length > 0 && (
        <ul className="mt-1 list-inside list-disc">
          {error.detalles.map((detalle) => (
            <li key={detalle}>{detalle}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
