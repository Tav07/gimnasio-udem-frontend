import { InputHTMLAttributes, ReactNode } from 'react';

interface Propiedades extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  children?: ReactNode;
}

// Etiqueta + control con el mismo estilo. Con `children` se puede poner un
// select o un textarea en el lugar del input.
export function Campo({ label, error, id, children, ...resto }: Propiedades) {
  return (
    <div className="flex flex-col gap-1 text-sm">
      <label htmlFor={id} className="font-medium text-neutral-800">
        {label}
      </label>
      {children ?? (
        <input
          id={id}
          className="rounded border border-neutral-300 bg-white px-3 py-2 focus:border-udem focus:outline-none focus:ring-2 focus:ring-udem/30"
          {...resto}
        />
      )}
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
