import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

interface Publicacion {
  id: number;
  usuario: {
    nombre: string;
    avatar: string;
  };
  contenido: string;
  imagen?: string;
  fecha: Date;
  likes: number;
  comentarios: Comentario[];
  compartidos: number;
  likedByUser: boolean;
  mostrarComentarios: boolean;
}

interface Comentario {
  id: number;
  usuario: {
    nombre: string;
    avatar: string;
  };
  contenido: string;
  fecha: Date;
}

@Component({
  selector: 'app-inicio-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inicio-usuario.component.html',
  styleUrls: ['./inicio-usuario.component.css']
})
export class InicioUsuarioComponent implements OnInit {
  usuarioLogueado: any = null;
  publicaciones: Publicacion[] = [];
  nuevaPublicacion: string = '';
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;
  menuAbierto: boolean = false;
  modoOscuro: boolean = false;
  nuevoComentario: { [key: number]: string } = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioLogueado = this.authService.getUser();
    this.cargarPublicaciones();
    this.cargarModoOscuro();
  }

  cargarPublicaciones(): void {
    // Publicaciones de ejemplo
    this.publicaciones = [
      {
        id: 1,
        usuario: {
          nombre: 'María García',
          avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=4ade80&color=fff'
        },
        contenido: '¡Mi perro Max disfrutando del parque hoy! 🐶 🌳',
        imagen: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600',
        fecha: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 24,
        comentarios: [
          {
            id: 1,
            usuario: {
              nombre: 'Carlos Pérez',
              avatar: 'https://ui-avatars.com/api/?name=Carlos+Perez&background=3b82f6&color=fff'
            },
            contenido: '¡Qué lindo! 😍',
            fecha: new Date(Date.now() - 1 * 60 * 60 * 1000)
          }
        ],
        compartidos: 3,
        likedByUser: false,
        mostrarComentarios: false
      },
      {
        id: 2,
        usuario: {
          nombre: 'Juan Martínez',
          avatar: 'https://ui-avatars.com/api/?name=Juan+Martinez&background=f59e0b&color=fff'
        },
        contenido: 'Recordatorio: Vacunación gratuita este sábado en la Clínica Veterinaria Central 💉',
        fecha: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 45,
        comentarios: [],
        compartidos: 12,
        likedByUser: true,
        mostrarComentarios: false
      }
    ];
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  toggleModoOscuro(): void {
    this.modoOscuro = !this.modoOscuro;
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark-mode', this.modoOscuro);
      localStorage.setItem('modoOscuro', JSON.stringify(this.modoOscuro));
    }
  }

  cargarModoOscuro(): void {
    if (typeof localStorage !== 'undefined') {
      const modo = localStorage.getItem('modoOscuro');
      if (modo) {
        this.modoOscuro = JSON.parse(modo);
        if (this.modoOscuro && typeof document !== 'undefined') {
          document.body.classList.add('dark-mode');
        }
      }
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  eliminarImagen(): void {
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
  }

  publicar(): void {
    if (this.nuevaPublicacion.trim() || this.imagenPreview) {
      const nuevaPublicacion: Publicacion = {
        id: this.publicaciones.length + 1,
        usuario: {
          nombre: this.usuarioLogueado?.nombre || 'Usuario',
          avatar: `https://ui-avatars.com/api/?name=${this.usuarioLogueado?.nombre || 'Usuario'}&background=4ade80&color=fff`
        },
        contenido: this.nuevaPublicacion,
        imagen: this.imagenPreview || undefined,
        fecha: new Date(),
        likes: 0,
        comentarios: [],
        compartidos: 0,
        likedByUser: false,
        mostrarComentarios: false
      };
      this.publicaciones.unshift(nuevaPublicacion);
      this.nuevaPublicacion = '';
      this.eliminarImagen();
    }
  }

  darLike(publicacion: Publicacion): void {
    if (publicacion.likedByUser) {
      publicacion.likes--;
    } else {
      publicacion.likes++;
    }
    publicacion.likedByUser = !publicacion.likedByUser;
  }

  toggleComentarios(publicacion: Publicacion): void {
    publicacion.mostrarComentarios = !publicacion.mostrarComentarios;
  }

  agregarComentario(publicacion: Publicacion): void {
    const contenido = this.nuevoComentario[publicacion.id];
    if (contenido && contenido.trim()) {
      const nuevoComentario: Comentario = {
        id: publicacion.comentarios.length + 1,
        usuario: {
          nombre: this.usuarioLogueado?.nombre || 'Usuario',
          avatar: `https://ui-avatars.com/api/?name=${this.usuarioLogueado?.nombre || 'Usuario'}&background=4ade80&color=fff`
        },
        contenido: contenido,
        fecha: new Date()
      };
      publicacion.comentarios.push(nuevoComentario);
      this.nuevoComentario[publicacion.id] = '';
    }
  }

  compartir(publicacion: Publicacion): void {
    publicacion.compartidos++;
    // Aquí podrías implementar lógica para compartir
    alert('¡Publicación compartida!');
  }

  getTiempoTranscurrido(fecha: Date): string {
    const ahora = new Date();
    const diff = ahora.getTime() - new Date(fecha).getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (minutos > 0) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    return 'Ahora';
  }

  logout(): void {
    this.authService.logout();
  }

  irAPerfil(): void {
    this.menuAbierto = false;
    // Forzar recarga del componente usando skipLocationChange y luego navegando
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/usuario/perfil']);
    });
  }

  irATienda(): void {
    this.menuAbierto = false;
    this.router.navigate(['/tienda']);
  }

  irAAdopciones(): void {
    this.menuAbierto = false;
    this.router.navigate(['/adopcion']);
  }
}
