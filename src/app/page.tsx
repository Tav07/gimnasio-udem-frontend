// La landing propia llega con la vista de inicio del punto 3; por ahora
// solo verifica que la app arma el layout y las rutas.
export default function Inicio() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-bold">Gimnasio UdeM</h1>
      <p className="text-neutral-600">Reservas para la comunidad de la Universidad de Medellín.</p>
    </main>
  );
}
