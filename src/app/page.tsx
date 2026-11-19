import Link from 'next/link';
import Image from 'next/image';

interface Destacado {
  titulo: string;
  texto: string;
}

const DESTACADOS: Destacado[] = [
  {
    titulo: 'Una sola zona de máquinas',
    texto:
      'Cardio, fuerza, peso libre y entrenamiento funcional. Sin clases ni instructores: tú eliges tu franja.',
  },
  {
    titulo: 'Bloques de dos horas',
    texto:
      'El horario va de las 6:00 a las 20:00 en siete bloques, para que combines el gimnasio con tus clases.',
  },
  {
    titulo: 'Aforo de 40 personas',
    texto:
      'Cada bloque tiene una capacidad fija. Verás los cupos disponibles antes de reservar y nunca te toca esperar en fila.',
  },
];

interface Paso {
  titulo: string;
  texto: string;
}

const PASOS: Paso[] = [
  {
    titulo: 'Crea tu cuenta',
    texto:
      'Con tu nombre, correo, documento y tu condición en la comunidad: estudiante, empleado o egresado.',
  },
  {
    titulo: 'Reserva el día hábil anterior',
    texto:
      'Por ejemplo, un viernes reservas para el lunes. Eliges el bloque de dos horas que te quede bien.',
  },
  {
    titulo: 'Preséntate con tu documento',
    texto:
      'A la entrada se revisa la reserva del día. El entrenador de turno solo supervisa el espacio.',
  },
];

export default function Inicio() {
  return (
    <div>
      <section className="bg-udem">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <Image
            src="/logo_en_blanco.png"
            alt="Universidad de Medellín"
            width={418}
            height={145}
            className="mx-auto h-56 w-auto max-w-full rounded-lg"
            priority
          />
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-bold text-white">
            Reserva tu espacio en el gimnasio de la UdeM
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Un horario claro, bloques de dos horas y tu lugar garantizado. El gimnasio de la
            Universidad de Medellín es para toda la comunidad: estudiantes, empleados y egresados.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="rounded bg-white px-6 py-2.5 text-sm font-medium text-udem transition-colors hover:bg-red-50"
            >
              Registrarme
            </Link>
            <Link
              href="/login"
              className="rounded border border-white/70 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Iniciar sesión
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/75">
            ¿Primera vez? Se reserva el día hábil anterior, desde las 6:00 a. m.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-center text-2xl font-semibold text-neutral-900">Cómo funciona</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {DESTACADOS.map((destacado) => (
            <article key={destacado.titulo} className="rounded-lg border border-neutral-200 p-6">
              <h3 className="font-semibold text-udem">{destacado.titulo}</h3>
              <p className="mt-2 text-sm text-neutral-600">{destacado.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-neutral-50">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-center text-2xl font-semibold text-neutral-900">
            Reservar toma tres pasos
          </h2>
          <ol className="mx-auto mt-8 max-w-2xl space-y-6">
            {PASOS.map((paso, indice) => (
              <li key={paso.titulo} className="flex gap-4">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-udem text-sm font-bold text-white">
                  {indice + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-neutral-900">{paso.titulo}</h3>
                  <p className="mt-1 text-sm text-neutral-600">{paso.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 text-center">
        <h2 className="text-2xl font-semibold text-neutral-900">Conoce el catálogo de máquinas</h2>
        <p className="mx-auto mt-3 max-w-lg text-neutral-600">
          Todas las máquinas del gimnasio están en la página pública, con su descripción y
          categoría. No hace falta iniciar sesión para verlas.
        </p>
        <Link
          href="/maquinas"
          className="mt-6 inline-block text-sm font-medium text-udem hover:underline"
        >
          Ver las máquinas
        </Link>
      </section>
    </div>
  );
}
