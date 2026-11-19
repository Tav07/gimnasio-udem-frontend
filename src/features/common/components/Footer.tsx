import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-neutral-800">Gimnasio de la Universidad de Medellín</p>
          <p>Atención de 6:00 a 20:00, bloques de dos horas con aforo de 40 personas.</p>
          <p className="mt-1">Universidad de Medellín, proyecto de Desarrollo Web Full-Stack.</p>
        </div>
        <Image
          src="/universidad_medellin.png"
          alt="Universidad de Medellín"
          width={360}
          height={104}
          className="h-9 w-auto self-start sm:self-center"
        />
      </div>
    </footer>
  );
}
