import { DetalleMaquina } from '@/features/maquinas/components/DetalleMaquina';

// El layout raíz usa hooks dinámicos (sesión, pathname), así que esta ruta
// se renderiza por petición en vez de prerenderizarse.
export const instant = false;

export default async function PaginaDetalleMaquina({ params }: PageProps<'/maquinas/[id]'>) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <DetalleMaquina id={id} />
    </div>
  );
}
