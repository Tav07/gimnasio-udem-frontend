'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { Boton } from '@/features/common/components/Boton';
import { Campo } from '@/features/common/components/Campo';
import {
  CategoriaMaquina,
  EstadoMaquina,
  etiquetaDeCategoria,
  etiquetaDeEstado,
} from '../domain/tipos';
import { useGuardadoDeMaquina } from '../hooks/useGuardadoDeMaquina';

interface Propiedades {
  id: string | null;
  inicial?: {
    nombre: string;
    descripcion: string;
    categoria: CategoriaMaquina;
    estado: EstadoMaquina;
    imagenUrl: string | null;
  };
  onGuardado?: () => void;
}

const CATEGORIAS: CategoriaMaquina[] = ['CARDIO', 'FUERZA', 'PESO_LIBRE', 'FUNCIONAL'];
const ESTADOS: EstadoMaquina[] = ['DISPONIBLE', 'MANTENIMIENTO', 'INACTIVA'];

// Formulario compartido por crear y editar. Al editar la imagen es opcional:
// solo se reemplaza si el usuario elige un archivo nuevo.
export function FormularioMaquina({ id, inicial, onGuardado }: Propiedades) {
  const [nombre, setNombre] = useState(inicial?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? '');
  const [categoria, setCategoria] = useState<CategoriaMaquina | ''>(inicial?.categoria ?? '');
  const [estado, setEstado] = useState<EstadoMaquina>(inicial?.estado ?? 'DISPONIBLE');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(inicial?.imagenUrl ?? null);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const { guardar, guardando, error } = useGuardadoDeMaquina(() => onGuardado?.());

  function elegirArchivo(evento: ChangeEvent<HTMLInputElement>) {
    const elegido = evento.target.files?.[0] ?? null;
    setArchivo(elegido);
    // URL.createObjectURL muestra el archivo sin subirlo todavía.
    setVistaPrevia(elegido ? URL.createObjectURL(elegido) : (inicial?.imagenUrl ?? null));
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setErrorLocal(null);
    if (id === null && !archivo) {
      setErrorLocal('La foto es obligatoria para crear una máquina');
      return;
    }
    await guardar(
      id,
      {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        categoria: categoria as CategoriaMaquina,
      },
      archivo,
      id === null ? null : estado,
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={enviar}>
      <Campo
        label="Nombre"
        id="nombre"
        value={nombre}
        onChange={(evento) => setNombre(evento.target.value)}
        required
      />
      <Campo
        label="Descripción"
        id="descripcion"
        value={descripcion}
        onChange={(evento) => setDescripcion(evento.target.value)}
        required
      />

      <Campo label="Categoría" id="categoria">
        <select
          id="categoria"
          className="rounded border border-neutral-300 bg-white px-3 py-2 focus:border-udem focus:outline-none focus:ring-2 focus:ring-udem/30"
          value={categoria}
          onChange={(evento) => setCategoria(evento.target.value as CategoriaMaquina | '')}
          required
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>
          {CATEGORIAS.map((valor) => (
            <option key={valor} value={valor}>
              {etiquetaDeCategoria(valor)}
            </option>
          ))}
        </select>
      </Campo>

      {id !== null && (
        <Campo label="Estado" id="estado">
          <select
            id="estado"
            className="rounded border border-neutral-300 bg-white px-3 py-2 focus:border-udem focus:outline-none focus:ring-2 focus:ring-udem/30"
            value={estado}
            onChange={(evento) => setEstado(evento.target.value as EstadoMaquina)}
          >
            {ESTADOS.map((valor) => (
              <option key={valor} value={valor}>
                {etiquetaDeEstado(valor)}
              </option>
            ))}
          </select>
        </Campo>
      )}

      <Campo label="Foto" id="imagen" error={errorLocal ?? undefined}>
        <input
          id="imagen"
          type="file"
          accept="image/jpeg, image/png, image/webp"
          onChange={elegirArchivo}
          className="rounded border border-neutral-300 bg-white px-3 py-2"
        />
        {vistaPrevia && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vistaPrevia}
            alt="Vista previa de la foto de la máquina"
            className="mt-2 h-40 w-full rounded object-cover"
          />
        )}
      </Campo>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error.mensaje}
          {error.detalles ? `: ${error.detalles.join('. ')}` : ''}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Link
          href="/admin/maquinas"
          className="rounded px-4 py-2 text-sm font-medium text-neutral-700 hover:text-udem"
        >
          Cancelar
        </Link>
        <Boton type="submit" disabled={guardando}>
          {guardando ? 'Guardando…' : id === null ? 'Crear máquina' : 'Guardar cambios'}
        </Boton>
      </div>
    </form>
  );
}
