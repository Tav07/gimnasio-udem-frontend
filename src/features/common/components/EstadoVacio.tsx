interface Propiedades {
  mensaje?: string;
}

export function EstadoVacio({ mensaje = 'No hay registros para mostrar' }: Propiedades) {
  return <p className="p-8 text-center text-neutral-600">{mensaje}</p>;
}
