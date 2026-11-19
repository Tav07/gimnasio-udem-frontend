export type CategoriaMaquina = 'CARDIO' | 'FUERZA' | 'PESO_LIBRE' | 'FUNCIONAL';
export type EstadoMaquina = 'DISPONIBLE' | 'MANTENIMIENTO' | 'INACTIVA';

export interface Maquina {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: CategoriaMaquina;
  imagenUrl: string | null;
  estado: EstadoMaquina;
  creadoEn: string;
  actualizadoEn: string;
}

// Datos que acepta el formulario de máquinas: los tres que pide el backend
// al crear.
export interface DatosDeMaquina {
  nombre: string;
  descripcion: string;
  categoria: CategoriaMaquina;
}

export interface FiltrosDeMaquinas {
  pagina: number;
  limite?: number;
  categoria?: CategoriaMaquina;
  estado?: EstadoMaquina;
  buscar?: string;
}

export const CATEGORIAS: CategoriaMaquina[] = ['CARDIO', 'FUERZA', 'PESO_LIBRE', 'FUNCIONAL'];

const ETIQUETAS_DE_CATEGORIA: Record<CategoriaMaquina, string> = {
  CARDIO: 'Cardio',
  FUERZA: 'Fuerza',
  PESO_LIBRE: 'Peso libre',
  FUNCIONAL: 'Funcional',
};

const ETIQUETAS_DE_ESTADO: Record<EstadoMaquina, string> = {
  DISPONIBLE: 'Disponible',
  MANTENIMIENTO: 'En mantenimiento',
  INACTIVA: 'Inactiva',
};

export function etiquetaDeCategoria(categoria: CategoriaMaquina): string {
  return ETIQUETAS_DE_CATEGORIA[categoria];
}

export function etiquetaDeEstado(estado: EstadoMaquina): string {
  return ETIQUETAS_DE_ESTADO[estado];
}
