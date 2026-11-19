'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Boton } from '@/features/common/components/Boton';
import { Campo } from '@/features/common/components/Campo';
import { CajaError } from '@/features/auth/components/CajaError';
import { useFormularioLogin } from '@/features/auth/hooks/useFormularioLogin';

export default function IniciarSesion() {
  const formulario = useFormularioLogin();

  return (
    <main className="mx-auto flex w-full max-w-sm flex-col gap-6 px-4 py-12">
      <Image
        src="/universidad_medellin.png"
        alt="Universidad de Medellín"
        width={360}
        height={360}
        className="h-12 w-auto self-center"
      />
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Entra con el correo y la contraseña con los que te registraste.
        </p>
      </div>

      {formulario.error && <CajaError error={formulario.error} />}

      <form className="flex flex-col gap-4" onSubmit={formulario.enviar}>
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
          label="Contraseña"
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={formulario.password}
          onChange={(evento) => formulario.setPassword(evento.target.value)}
        />
        <Boton type="submit" disabled={formulario.enviando}>
          {formulario.enviando ? 'Ingresando…' : 'Iniciar sesión'}
        </Boton>
      </form>

      <p className="text-sm text-neutral-600">
        ¿Aún no tienes cuenta?{' '}
        <Link href="/register" className="font-medium text-udem hover:underline">
          Regístrate
        </Link>
      </p>
    </main>
  );
}
