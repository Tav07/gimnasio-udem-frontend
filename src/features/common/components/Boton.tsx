import { ButtonHTMLAttributes } from 'react';

type Variante = 'primario' | 'secundario' | 'peligroso';

interface Propiedades extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

const ESTILOS: Record<Variante, string> = {
  primario: 'bg-udem text-white hover:bg-udem-oscuro disabled:bg-udem/60',
  secundario: 'border border-udem text-udem hover:bg-udem/10',
  peligroso: 'bg-red-700 text-white hover:bg-red-800 disabled:bg-red-700/60',
};

export function Boton({
  variante = 'primario',
  className = '',
  type = 'button',
  ...resto
}: Propiedades) {
  return (
    <button
      type={type}
      className={`rounded px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${ESTILOS[variante]} ${className}`}
      {...resto}
    />
  );
}
