'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Boton } from '@/features/common/components/Boton';
import { Campo } from '@/features/common/components/Campo';
import { CajaError } from '@/features/auth/components/CajaError';
import { useFormularioRegistro } from '@/features/auth/hooks/useFormularioRegistro';

export default function Registrar() {
  const formulario = useFormularioRegistro();

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-12">
      <Image
        src="/universidad_medellin.png"
        alt="Universidad de Medellín"
        width={360}
        height={104}
        className="h-12 w-auto self-center"
      />
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Crea tu cuenta</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Es para la comunidad de la Universidad de Medellín.
        </p>
      </div>

      {formulario.error && <CajaError error={formulario.error} />}

      <form className="flex flex-col gap-4" onSubmit={formulario.enviar}>
        <Campo
          label="Nombre completo"
          id="nombre"
          autoComplete="name"
          required
          minLength={2}
          maxLength={120}
          value={formulario.nombre}
          onChange={(evento) => formulario.setNombre(evento.target.value)}
        />
        <Campo
          label="Correo electrónico"
          id="email"
          type="email"
          autoComplete="email"
          required
          value={formulario.email}
          onChange={(evento) => formulario.setEmail(evento.target.value)}
        />
        <Campo
          label="Documento"
          id="documento"
          inputMode="numeric"
          pattern="[0-9]{6,12}"
          required
          title="Entre 6 y 12 dígitos, solo números"
          value={formulario.documento}
          onChange={(evento) => formulario.setDocumento(evento.target.value.replace(/\D/g, ''))}
        />
        <Campo label="Tipo de integrante" id="tipo">
          <select
            id="tipo"
            className="rounded border border-neutral-300 bg-white px-3 py-2 focus:border-udem focus:outline-none focus:ring-2 focus:ring-udem/30"
            value={formulario.tipo}
            onChange={(evento) => formulario.setTipo(evento.target.value as typeof formulario.tipo)}
          >
            {formulario.tiposValidos.map((tipo) => (
              <option key={tipo} value={tipo}>
                {ETIQUETAS_TIPO[tipo]}
              </option>
            ))}
          </select>
        </Campo>
        <Campo
          label="Contraseña"
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={formulario.password}
          onChange={(evento) => formulario.setPassword(evento.target.value)}
        />
        <Boton type="submit" disabled={formulario.enviando}>
          {formulario.enviando ? 'Creando la cuenta…' : 'Registrarme'}
        </Boton>
      </form>

      <p className="text-sm text-neutral-600">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-medium text-udem hover:underline">
          Inicia sesión
        </Link>
      </p>
    </main>
  );
}

const ETIQUETAS_TIPO: Record<string, string> = {
  ESTUDIANTE: 'Estudiante',
  EMPLEADO: 'Empleado',
  EGRESADO: 'Egresado',
};
