import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { PublicacionesService } from '../../../../core/services/publicaciones.service';
import { UsuariosService } from '../../../../core/services/usuarios.service';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  ComentarioFeed,
  PublicacionApi,
  PublicacionComentarioApi,
  PublicacionFeed,
  PublicacionReaccionApi,
} from '../../../../core/models/publicaciones.model';
import { APP_PATHS } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-inicio-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss']
})
export class InicioUsuarioComponent implements OnInit, OnDestroy {
  usuarioLogueado: any = null;
  publicaciones: PublicacionFeed[] = [];
  nuevaPublicacion: string = '';
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;
  menuAbierto: boolean = false;
  modoOscuro: boolean = false;
  nuevoComentario: { [key: number]: string } = {};
  isLoadingUser: boolean = true;
  isLoadingPublicaciones: boolean = false;
  private navigationSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private publicacionesService: PublicacionesService,
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.inicializarDatos();
    
    // Suscribirse a eventos de navegación para recargar cuando se vuelve a esta ruta
    this.navigationSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const usuarioPath = `/${APP_PATHS.USUARIO}`;
        if (event.url === usuarioPath || event.urlAfterRedirects === usuarioPath) {
          this.inicializarDatos();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  inicializarDatos(): void {
    this.isLoadingUser = true;
    const user = this.authService.getUser();
    const userId = user?.id || user?.id_usuario;
    
    if (userId) {
      // Cargar datos completos del usuario desde el backend
      this.usuariosService.getUsuario(userId).subscribe({
        next: (userData: any) => {
          const nombre = userData?.nombres || 'Usuario';
          this.usuarioLogueado = {
            ...user,
            ...userData,
            avatar: this.buildAvatarUrl(userData?.imagen, nombre),
            nombre: nombre
          };
          this.isLoadingUser = false;
          this.cdr.detectChanges();
          // Cargar publicaciones DESPUÉS de que el usuario esté cargado
          this.cargarPublicaciones();
        },
        error: (error: any) => {
          console.error('Error al cargar usuario:', error);
          // Fallback con datos del token
          const nombre = user?.nombres || 'Usuario';
          this.usuarioLogueado = {
            ...user,
            avatar: this.buildAvatarUrl(user?.imagen, nombre),
            nombre: nombre
          };
          this.isLoadingUser = false;
          // Cargar publicaciones incluso si falla la carga del usuario
          this.cargarPublicaciones();
        }
      });
    } else {
      const nombre = user?.nombres || 'Usuario';
      this.usuarioLogueado = {
        ...user,
        avatar: this.buildAvatarUrl(user?.imagen, nombre),
        nombre: nombre
      };
      this.isLoadingUser = false;
      // Cargar publicaciones
      this.cargarPublicaciones();
    }
    
    this.cargarModoOscuro();
  }

  cargarPublicaciones(): void {
    // No cargar publicaciones si el usuario no está cargado
    if (!this.usuarioLogueado) {
      return;
    }
    
    this.isLoadingPublicaciones = true;
    // Cargar publicaciones desde el backend
    this.publicacionesService.getAllPublicaciones().subscribe({
      next: (data: any) => {
        console.log('Publicaciones cargadas:', data);
        this.publicaciones = data.map((pub: any) => this.mapPublicacionApiToFeed(pub));
        this.isLoadingPublicaciones = false;
        // Forzar detección de cambios para actualizar la vista
        this.cdr.detectChanges();
        console.log('Publicaciones asignadas:', this.publicaciones.length);
      },
      error: (error: any) => {
        console.error('Error al cargar publicaciones:', error);
        this.publicaciones = [];
        this.isLoadingPublicaciones = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Método eliminado: antes cargaba publicaciones de ejemplo (mock) en memoria.

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (file) {
      this.imagenSeleccionada = file;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagenPreview = (e.target?.result as string) || null;
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
      if (!this.usuarioLogueado) {
        alert('Error: No se pudo identificar al usuario. Por favor inicia sesión nuevamente.');
        return;
      }
      
      // Enviar al backend
      this.publicacionesService.createPublicacion(this.nuevaPublicacion, this.imagenPreview || undefined).subscribe({
        next: () => {
          // Limpiar el formulario
          this.nuevaPublicacion = '';
          this.eliminarImagen();
          // Recargar publicaciones desde el backend para mostrar la nueva correctamente
          this.cargarPublicaciones();
        },
        error: (error: any) => {
          console.error('Error al crear publicación:', error);
          alert('Error al publicar. Por favor intenta de nuevo.');
        }
      });
    }
  }

  darLike(publicacion: PublicacionFeed): void {
    const userId = this.usuarioLogueado?.id || this.usuarioLogueado?.id_usuario;
    if (!userId) {
      alert('Debes iniciar sesión para dar like');
      return;
    }

    this.publicacionesService.toggleReaccion(publicacion.id, userId).subscribe({
      next: (response: any) => {
        publicacion.likedByUser = response.liked;
        publicacion.likes = response.totalLikes;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error al dar like:', error);
      }
    });
  }

  toggleComentarios(publicacion: PublicacionFeed): void {
    publicacion.mostrarComentarios = !publicacion.mostrarComentarios;
  }

  agregarComentario(publicacion: PublicacionFeed): void {
    const contenido = this.nuevoComentario[publicacion.id];
    const userId = this.usuarioLogueado?.id || this.usuarioLogueado?.id_usuario;
    
    if (!userId) {
      alert('Debes iniciar sesión para comentar');
      return;
    }

    if (contenido && contenido.trim()) {
      this.publicacionesService.createComentario(publicacion.id, userId, contenido.trim()).subscribe({
        next: (comentarioCreado: any) => {
          const nuevoComentario: ComentarioFeed = {
            id: comentarioCreado.id,
            usuario: {
              nombre: comentarioCreado.usuario?.nombres || this.usuarioLogueado?.nombres || 'Usuario',
              avatar: this.buildAvatarUrl(comentarioCreado.usuario?.imagen || this.usuarioLogueado?.imagen, comentarioCreado.usuario?.nombres || this.usuarioLogueado?.nombres)
            },
            contenido: comentarioCreado.contenido,
            fecha: new Date(comentarioCreado.createdAt)
          };
          publicacion.comentarios.push(nuevoComentario);
          this.nuevoComentario[publicacion.id] = '';
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Error al crear comentario:', error);
          alert('Error al publicar el comentario');
        }
      });
    }
  }

  compartir(publicacion: PublicacionFeed): void {
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
    this.router.navigate([`/${APP_PATHS.USUARIO}/perfil`]);
  }

  irATienda(): void {
    this.menuAbierto = false;
    this.router.navigate([`/${APP_PATHS.TIENDA}`]);
  }

  irAAdopciones(): void {
    this.menuAbierto = false;
    this.router.navigate([`/${APP_PATHS.ADOPCION}`]);
  }

  private checkIfUserLiked(reacciones: PublicacionReaccionApi[]): boolean {
    const userId = this.usuarioLogueado?.id || this.usuarioLogueado?.id_usuario;
    if (!userId || !reacciones) return false;
    return reacciones.some(r => r.idUsuario === userId);
  }

  private mapComentarioApiToFeed(comentario: PublicacionComentarioApi): ComentarioFeed {
    return {
      id: comentario.id,
      usuario: {
        nombre: comentario.usuario?.nombres || 'Usuario',
        avatar: this.buildAvatarUrl(comentario.usuario?.imagen, comentario.usuario?.nombres),
      },
      contenido: comentario.contenido,
      fecha: new Date(comentario.createdAt),
    };
  }

  private mapPublicacionApiToFeed(pub: PublicacionApi): PublicacionFeed {
    return {
      id: pub.id,
      usuario: {
        nombre: pub.usuario?.nombres || 'Usuario',
        avatar: this.buildAvatarUrl(pub.usuario?.imagen, pub.usuario?.nombres),
      },
      contenido: pub.contenido,
      imagen: pub.imagen || undefined,
      fecha: new Date(pub.createdAt),
      likes: pub.reaccionesData?.length || pub.likes || 0,
      comentarios: (pub.comentariosData || []).map((comentario: any) =>
        this.mapComentarioApiToFeed(comentario),
      ),
      compartidos: 0,
      likedByUser: this.checkIfUserLiked(pub.reaccionesData || []),
      mostrarComentarios: false,
    };
  }

  private buildAvatarUrl(imagen: string | null | undefined, nombre: string | null | undefined): string {
    // Si está cargando y no hay imagen, retornar placeholder de carga
    if (this.isLoadingUser && !imagen) {
      return 'https://ui-avatars.com/api/?name=Loading&background=e0e0e0&color=999&size=200';
    }
    
    if (!imagen) {
      const displayName = nombre || 'Usuario';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4ade80&color=fff`;
    }
    // Si ya es una URL completa
    if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
      return imagen;
    }
    // Si es una ruta relativa, construir la URL completa
    return `${environment.apiUrl}${imagen}`;
  }
}
