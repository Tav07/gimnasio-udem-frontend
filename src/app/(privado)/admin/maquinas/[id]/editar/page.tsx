import { EdicionDeMaquina } from '@/features/maquinas/components/EdicionDeMaquina';

// El layout raíz usa hooks dinámicos (sesión, pathname), así que esta ruta
// se renderiza por petición en vez de prerenderizarse.
export const instant = false;

export default async function PaginaEditarMaquina({
  params,
}: PageProps<'/admin/maquinas/[id]/editar'>) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <EdicionDeMaquina id={id} />
    </div>
  );
}
