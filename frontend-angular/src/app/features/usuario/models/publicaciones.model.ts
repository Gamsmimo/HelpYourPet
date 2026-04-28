export interface PublicacionUsuarioApi {
  id?: number;
  id_usuario?: number;
  nombres?: string;
  imagen?: string | null;
}

export interface PublicacionComentarioApi {
  id: number;
  contenido: string;
  createdAt: string;
  usuario?: PublicacionUsuarioApi;
}

export interface PublicacionReaccionApi {
  idUsuario: number;
}

export interface PublicacionApi {
  id: number;
  contenido: string;
  imagen?: string | null;
  createdAt: string;
  created_at?: string;
  usuario?: PublicacionUsuarioApi;
  comentariosData?: PublicacionComentarioApi[];
  reaccionesData?: PublicacionReaccionApi[];
  likes?: number;
  likesCount?: number;
  comentarios?: number;
  comentariosCount?: number;
}

export interface ComentarioFeed {
  id: number;
  usuario: {
    nombre: string;
    avatar: string;
  };
  contenido: string;
  fecha: Date;
}

export interface PublicacionFeed {
  id: number;
  usuario: {
    nombre: string;
    avatar: string;
  };
  contenido: string;
  imagen?: string;
  fecha: Date;
  likes: number;
  comentarios: ComentarioFeed[];
  compartidos: number;
  likedByUser: boolean;
  mostrarComentarios: boolean;
}

export interface PublicacionPerfil {
  id: number;
  contenido: string;
  imagen: string;
  fecha: Date;
  likes: number;
  comentarios: number;
  compartidos: number;
}
