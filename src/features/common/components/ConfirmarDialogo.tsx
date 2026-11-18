'use client';

import { Modal } from './Modal';
import { Boton } from './Boton';

interface Propiedades {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  cargando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmarDialogo({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  cargando = false,
  onConfirmar,
  onCancelar,
}: Propiedades) {
  return (
    <Modal abierto={abierto} onCerrar={cargando ? () => undefined : onCancelar} titulo={titulo}>
      <p className="text-sm text-neutral-700">{mensaje}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Boton variante="secundario" onClick={onCancelar} disabled={cargando}>
          Cancelar
        </Boton>
        <Boton variante="peligroso" onClick={onConfirmar} disabled={cargando}>
          {textoConfirmar}
        </Boton>
      </div>
    </Modal>
  );
}
