'use client';

import { useState, FormEvent } from 'react';
import { Boton } from '@/features/common/components/Boton';
import { Campo } from '@/features/common/components/Campo';
import { EstadoRegistro } from '../domain/tipos';
import { useGuardadoDeBloque } from '../hooks/useGuardadoDeBloque';

interface Propiedades {
  bloqueAEditar?: {
    id: string;
    horaInicio: string;
    horaFin: string;
    aforo: number;
    estado: EstadoRegistro;
  };
  onGuardado: () => void;
  onCerrar: () => void;
}

// Cuerpo del modal de crear/editar bloque. Las validaciones duras (formato
// HH:mm, rango 06:00–20:00 y traslape) las hace el backend; aquí solo se
// exige que los campos existan antes de enviar.
export function FormularioBloque({ bloqueAEditar, onGuardado, onCerrar }: Propiedades) {
  const [horaInicio, setHoraInicio] = useState(bloqueAEditar?.horaInicio ?? '');
  const [horaFin, setHoraFin] = useState(bloqueAEditar?.horaFin ?? '');
  const [aforo, setAforo] = useState(String(bloqueAEditar?.aforo ?? 40));
  const [estado, setEstado] = useState<EstadoRegistro>(bloqueAEditar?.estado ?? 'ACTIVO');
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const { guardar, guardando, error } = useGuardadoDeBloque(() => onGuardado());

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setErrorLocal(null);
    const aforoNumero = Number(aforo);
    if (!horaInicio || !horaFin) {
      setErrorLocal('Escribe la hora de inicio y la hora de fin');
      return;
    }
    if (!Number.isInteger(aforoNumero) || aforoNumero < 1) {
      setErrorLocal('El aforo debe ser un número entero mayor a cero');
      return;
    }
    await guardar(
      bloqueAEditar?.id ?? null,
      { horaInicio, horaFin, aforo: aforoNumero },
      bloqueAEditar ? estado : null,
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={enviar}>
      <div className="grid grid-cols-2 gap-3">
        <Campo
          label="Hora de inicio"
          id="horaInicio"
          type="time"
          value={horaInicio}
          onChange={(evento) => setHoraInicio(evento.target.value)}
          required
        />
        <Campo
          label="Hora de fin"
          id="horaFin"
          type="time"
          value={horaFin}
          onChange={(evento) => setHoraFin(evento.target.value)}
          required
        />
      </div>
      <Campo
        label="Aforo"
        id="aforo"
        type="number"
        min={1}
        value={aforo}
        onChange={(evento) => setAforo(evento.target.value)}
        required
      />
      {bloqueAEditar && (
        <Campo label="Estado" id="estadoBloque">
          <select
            id="estadoBloque"
            className="rounded border border-neutral-300 bg-white px-3 py-2 focus:border-udem focus:outline-none focus:ring-2 focus:ring-udem/30"
            value={estado}
            onChange={(evento) => setEstado(evento.target.value as EstadoRegistro)}
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </Campo>
      )}
      <p className="text-xs text-neutral-500">
        Los bloques deben quedar entre 06:00 y 20:00 y dos bloques activos no pueden traslaparse.
      </p>

      {(errorLocal || error) && (
        <p role="alert" className="text-sm text-red-700">
          {errorLocal ?? error?.mensaje}
          {!errorLocal && error?.detalles && `: ${error.detalles.join('. ')}`}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Boton variante="secundario" onClick={onCerrar}>
          Cancelar
        </Boton>
        <Boton type="submit" disabled={guardando}>
          {guardando ? 'Guardando…' : bloqueAEditar ? 'Guardar cambios' : 'Crear bloque'}
        </Boton>
      </div>
    </form>
  );
}
