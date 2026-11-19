'use client';

import { useRouter } from 'next/navigation';
import { useMaquina } from '@/features/maquinas/hooks/useMaquina';
import { FormularioMaquina } from './FormularioMaquina';
import { EstadoCargando } from '@/features/common/components/EstadoCargando';
import { EstadoError } from '@/features/common/components/EstadoError';
import { EstadoVacio } from '@/features/common/components/EstadoVacio';

// Carga la máquina a editar y monta el formulario con sus datos; al guardar
// con éxito vuelve al listado de administración.
export function EdicionDeMaquina({ id }: { id: string }) {
  const { maquina, cargando, noEncontrada, error, recargar } = useMaquina(id);
  const router = useRouter();

  if (cargando) {
    return <EstadoCargando texto="Cargando la máquina…" />;
  }
  if (noEncontrada) {
    return <EstadoVacio mensaje="No encontramos esta máquina, puede haber sido eliminada" />;
  }
  if (error || !maquina) {
    return <EstadoError mensaje="No se pudo cargar la máquina" onReintentar={recargar} />;
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-neutral-900">Editar {maquina.nombre}</h1>
      <p className="mb-8 mt-2 text-neutral-600">
        Cambia los datos o reemplaza la foto. La nueva foto sustituye a la actual.
      </p>
      <FormularioMaquina
        id={maquina.id}
        inicial={{
          nombre: maquina.nombre,
          descripcion: maquina.descripcion,
          categoria: maquina.categoria,
          estado: maquina.estado,
          imagenUrl: maquina.imagenUrl,
        }}
        onGuardado={() => router.push('/admin/maquinas')}
      />
    </>
  );
}
