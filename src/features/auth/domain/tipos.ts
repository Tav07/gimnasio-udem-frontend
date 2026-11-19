export type TipoUsuario = 'ESTUDIANTE' | 'EMPLEADO' | 'EGRESADO';

export type Rol = 'ADMIN' | 'USUARIO';

export interface UsuarioActivo {
  id: string;
  nombre: string;
  email: string;
  documento: string;
  tipo: TipoUsuario;
  rol: Rol;
}

export interface DatosDeSesion {
  usuario: UsuarioActivo;
  token: string;
}

export interface RegistroNuevo {
  nombre: string;
  email: string;
  documento: string;
  tipo: TipoUsuario;
  password: string;
}
