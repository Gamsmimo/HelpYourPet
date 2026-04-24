import { Component, OnInit, ViewEncapsulation, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { EventoVeterinaria, InventarioItem, PerfilVeterinario } from '../../../core/models/veterinario.model';
import { VeterinarioApiService } from '../../../core/services/veterinario-api.service';

@Component({
  selector: 'app-veterinario-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private veterinarioApiService = inject(VeterinarioApiService);
  private cdr = inject(ChangeDetectorRef);

  readonly user = this.authService.getUser();
  isDarkMode = false;
  activeSection = 'inicio';
  isSidebarActive = false;
  searchQuery = '';
  openModalName = '';
  isLoading = false;
  today = new Date().toISOString().split('T')[0];

  perfilVeterinario: PerfilVeterinario = {
    id: 0,
    especialidad: '',
    experiencia: 0,
    tarjetaProfesional: '',
    estado: true,
    idUsuario: this.user?.id ?? 0,
    idVeterinaria: null,
    usuario: {
      id: this.user?.id ?? 0,
      nombres: '',
      apellidos: '',
      correo: this.user?.correo ?? '',
      telefono: '',
      direccion: '',
      imagen: null,
    },
  };

  eventosVet: any[] = [];
  inventario: InventarioItem[] = [];
  productos: any[] = [];
  inventarioPorProducto: any = {};

  categoriaFiltro = '';
  estadoFiltro = '';
  editingEventId: number | null = null;
  editingInventoryId: number | null = null;
  editingProductId: number | null = null;
  
  // Modelos para los formularios del diseño original
  eventForm = {
    titulo: '',
    descripcion: '',
    fechainicio: '',
    fechafin: '',
    imagen: ''
  };

  productForm = {
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    cantidad: 0,
    imagen: '',
  };

  ngOnInit(): void {
    this.isDarkMode = typeof localStorage !== 'undefined' && localStorage.getItem('veterinario-theme') === 'dark';
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    this.loadVeterinarioData();
  }

  get productosFiltrados(): any[] {
    return this.productos.filter((prod) => {
      const inv = this.inventarioPorProducto[prod.id];
      const byQuery = this.searchQuery
        ? prod.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          prod.descripcion.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      const byCategoria = this.categoriaFiltro
        ? prod.categoria === this.categoriaFiltro
        : true;
      const byEstado = this.estadoFiltro ? inv?.estado === this.estadoFiltro : true;
      return byQuery && byCategoria && byEstado;
    });
  }

  getInventoryIdByProductId(productId: number): number | undefined {
    return this.inventario.find(item => item.producto.id === productId)?.id;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('veterinario-theme', 'dark');
      }
      return;
    }
    document.documentElement.setAttribute('data-theme', 'light');
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('veterinario-theme', 'light');
    }
  }

  setSection(section: string): void {
    this.activeSection = section;
    this.isSidebarActive = false;
  }

  logout(): void {
    this.authService.logout();
  }

  toggleSidebar(): void {
    this.isSidebarActive = !this.isSidebarActive;
  }

  openModal(modalId: string, payload?: { eventId?: number; inventoryId?: number }): void {
    this.openModalName = modalId;

    if (modalId === 'edit-event' && payload?.eventId) {
      const evento = this.eventosVet.find((item) => item.id === payload.eventId);
      if (evento) {
        this.editingEventId = evento.id;
        this.eventForm = {
          titulo: evento.titulo ?? '',
          descripcion: evento.descripcion ?? '',
          fechainicio: this.toInputDate(evento.fechainicio),
          fechafin: this.toInputDate(evento.fechafin),
          imagen: evento.imagen ?? '',
        };
      }
    }

    if (modalId === 'edit-product' && payload?.inventoryId) {
      const item = this.inventario.find((entry) => entry.id === payload.inventoryId);
      if (item) {
        this.editingInventoryId = item.id;
        this.editingProductId = item.producto.id;
        this.productForm = {
          nombre: item.producto.nombre ?? '',
          descripcion: item.producto.descripcion ?? '',
          precio: Number(item.producto.precio ?? 0),
          categoria: item.producto.categoria ?? '',
          cantidad: item.cantidad ?? 0,
          imagen: item.producto.imagen ?? '',
        };
      }
    }
  }

  closeModal(): void {
    this.openModalName = '';
    this.resetEventForm();
    this.resetProductForm();
    this.editingEventId = null;
    this.editingInventoryId = null;
    this.editingProductId = null;
  }

  savePerfil(): void {
    if (!this.perfilVeterinario.id || !this.perfilVeterinario.idUsuario) {
      return;
    }

    forkJoin([
      this.veterinarioApiService.updateUsuario(this.perfilVeterinario.idUsuario, {
        nombres: this.perfilVeterinario.usuario.nombres,
        apellidos: this.perfilVeterinario.usuario.apellidos,
        telefono: this.perfilVeterinario.usuario.telefono ?? '',
        direccion: this.perfilVeterinario.usuario.direccion ?? '',
        imagen: this.perfilVeterinario.usuario.imagen ?? '',
      }),
      this.veterinarioApiService.updatePerfil(this.perfilVeterinario.id, {
        especialidad: this.perfilVeterinario.especialidad ?? '',
      }),
    ]).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'Perfil actualizado correctamente', 'success');
      },
      error: (error) => {
        Swal.fire('Error', error?.error?.message ?? 'No fue posible actualizar el perfil', 'error');
      },
    });
  }

  previewImage(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file || !this.perfilVeterinario.idUsuario) {
      return;
    }

    this.veterinarioApiService.uploadFoto(file).pipe(
      switchMap((uploadResult) => this.veterinarioApiService.updateUsuario(this.perfilVeterinario.idUsuario, {
        imagen: uploadResult.fotoUrl,
      })),
    ).subscribe({
      next: () => {
        this.loadVeterinarioData();
      },
      error: (error) => {
        Swal.fire('Error', error?.error?.message ?? 'No se pudo subir la imagen', 'error');
      },
    });
  }

  onEventImageChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    this.veterinarioApiService.uploadFoto(file).subscribe({
      next: (res) => {
        this.eventForm.imagen = res.fotoUrl;
        Swal.fire('Imagen subida', 'La imagen del evento se ha cargado correctamente', 'success');
      },
      error: () => {
        Swal.fire('Error', 'No se pudo subir la imagen del evento', 'error');
      }
    });
  }

  onProductImageChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    this.veterinarioApiService.uploadFoto(file).subscribe({
      next: (res) => {
        this.productForm.imagen = res.fotoUrl;
        Swal.fire('Imagen subida', 'La imagen del producto se ha cargado correctamente', 'success');
      },
      error: () => {
        Swal.fire('Error', 'No se pudo subir la imagen del producto', 'error');
      }
    });
  }

  saveEvent(): void {
    if (!this.perfilVeterinario.idVeterinaria) {
      Swal.fire('Sin veterinaria', 'Este usuario no tiene veterinaria asociada', 'warning');
      return;
    }

    // Solo exigir todos los campos si es un evento nuevo
    if (!this.editingEventId) {
      if (!this.eventForm.titulo || !this.eventForm.fechainicio || !this.eventForm.fechafin || !this.eventForm.imagen || !this.eventForm.descripcion) {
        Swal.fire('Campos incompletos', 'Todos los campos son obligatorios para crear un evento', 'warning');
        return;
      }
    }

    if (new Date(this.eventForm.fechafin) < new Date(this.eventForm.fechainicio)) {
      Swal.fire('Error de fecha', 'La fecha de fin no puede ser anterior a la de inicio', 'error');
      return;
    }

    const payload = {
      nombre: this.eventForm.titulo,
      descripcion: this.eventForm.descripcion,
      fecha: this.eventForm.fechainicio,
      fechafin: this.eventForm.fechafin,
      imagen: this.eventForm.imagen,
      idVeterinaria: this.perfilVeterinario.idVeterinaria,
    };

    const request$ = this.editingEventId
      ? this.veterinarioApiService.updateEvento(this.editingEventId, payload)
      : this.veterinarioApiService.createEvento(payload);

    request$.subscribe({
      next: () => {
        Swal.fire('Guardado', 'Evento guardado correctamente', 'success');
        this.closeModal();
        this.loadEventos();
      },
      error: (error) => {
        let errorMessage = error?.error?.message ?? 'No se pudo guardar el evento';
        if (error?.error?.errors && Array.isArray(error.error.errors)) {
          errorMessage = error.error.errors.map((err: any) => `${err.field}: ${err.errors.join(', ')}`).join('\n');
        }
        Swal.fire({
          title: 'Error de Validación',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      },
    });
  }

  deleteEvent(id: number): void {
    Swal.fire({
      title: '¿Eliminar evento?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.veterinarioApiService.deleteEvento(id).subscribe({
        next: () => {
          this.loadEventos();
          Swal.fire('Eliminado', 'El evento fue eliminado correctamente', 'success');
        },
        error: (error) => {
          Swal.fire('Error', error?.error?.message ?? 'No se pudo eliminar el evento', 'error');
        },
      });
    });
  }

  saveProduct(): void {
    if (!this.perfilVeterinario.idVeterinaria) {
      Swal.fire('Sin veterinaria', 'Este usuario no tiene veterinaria asociada', 'warning');
      return;
    }

    if (!this.productForm.nombre || !this.productForm.precio || !this.productForm.categoria || !this.productForm.descripcion || !this.productForm.imagen) {
      Swal.fire('Campos incompletos', 'Todos los campos marcados con * son obligatorios', 'warning');
      return;
    }

    const payload = {
      nombre: this.productForm.nombre,
      precio: Number(this.productForm.precio),
      cantidad: Number(this.productForm.cantidad),
      categoria: this.productForm.categoria,
      descripcion: this.productForm.descripcion,
      imagen: this.productForm.imagen,
      idVeterinaria: this.perfilVeterinario.idVeterinaria,
    };

    if (this.editingProductId && this.editingInventoryId) {
      forkJoin([
        this.veterinarioApiService.updateProducto(this.editingProductId, {
          nombre: payload.nombre,
          precio: payload.precio,
          categoria: payload.categoria,
          descripcion: payload.descripcion,
          imagen: payload.imagen
        }),
        this.veterinarioApiService.updateInventario(this.editingInventoryId, {
          cantidad: payload.cantidad,
          estado: payload.cantidad > 0 ? 'disponible' : 'agotado'
        })
      ]).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
          this.closeModal();
          this.loadInventarioData();
        },
        error: (error) => {
          Swal.fire('Error', error?.error?.message ?? 'No se pudo actualizar el producto', 'error');
        }
      });
      return;
    }

    this.veterinarioApiService.registerProduct(payload).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Producto registrado correctamente', 'success');
        this.closeModal();
        this.loadInventarioData();
      },
      error: (error) => {
        Swal.fire('Error', error?.error?.message ?? 'No se pudo registrar el producto', 'error');
      },
    });
  }

  private loadInventarioData(): void {
     this.loadVeterinarioData();
  }

  deleteProduct(productId: number): void {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      this.veterinarioApiService.deleteProducto(productId).subscribe({
        next: () => {
          this.loadInventario();
          Swal.fire('Eliminado', 'Producto eliminado correctamente', 'success');
        },
        error: (error) => {
          Swal.fire('Error', error?.error?.message ?? 'No se pudo eliminar el producto', 'error');
        },
      });
    });
  }

  getEstadoProducto(cantidad: number): string {
    return cantidad > 0 ? 'Disponible' : 'Agotado';
  }

  getImageUrl(imagePath: string | null | undefined, fallback: string): string {
    if (!imagePath) {
      return fallback;
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${environment.apiUrl}${imagePath}`;
  }



  private loadVeterinarioData(): void {
    if (!this.user?.id) {
      this.authService.logout();
      return;
    }
    this.isLoading = true;
    this.veterinarioApiService.getPerfilByUsuario(this.user.id).pipe(
      switchMap((perfil) => {
        this.perfilVeterinario = perfil;
        // Resolver imagen de perfil
        if (this.perfilVeterinario.usuario.imagen) {
          this.perfilVeterinario.usuario.imagen = this.getImageUrl(this.perfilVeterinario.usuario.imagen, 'assets/IMG/default.jpg');
        } else {
          this.perfilVeterinario.usuario.imagen = 'assets/IMG/default.jpg';
        }

        if (!perfil.idVeterinaria) {
          this.eventosVet = [];
          this.inventario = [];
          this.productos = [];
          this.inventarioPorProducto = {};
          return of(null);
        }
        return forkJoin({
          eventos: this.veterinarioApiService.getEventosByVeterinaria(perfil.idVeterinaria),
          inventario: this.veterinarioApiService.getInventarioByVeterinaria(perfil.idVeterinaria),
        });
      }),
    ).subscribe({
      next: (result) => {
        if (result) {
          // Mapear eventos al formato del diseño original
          this.eventosVet = result.eventos.map(e => ({
            id: e.id,
            titulo: e.nombre,
            descripcion: e.descripcion,
            fechainicio: e.fecha,
            fechafin: e.fechafin,
            imagen: this.getImageUrl(e.imagen, '')
          }));

          this.inventario = result.inventario;
          
          // Mapear productos e inventario para el diseño original
          this.productos = result.inventario.map(item => ({
            ...item.producto,
            imagen: this.getImageUrl(item.producto.imagen, 'assets/IMG/default-product.png')
          }));

          this.inventarioPorProducto = {};
          result.inventario.forEach(item => {
            this.inventarioPorProducto[item.producto.id] = {
              cantidadDisponible: item.cantidad,
              estado: item.cantidad > 0 ? 'Disponible' : 'Agotado'
            };
          });
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private loadEventos(): void {
    if (!this.perfilVeterinario.idVeterinaria) {
      this.eventosVet = [];
      return;
    }
    this.veterinarioApiService.getEventosByVeterinaria(this.perfilVeterinario.idVeterinaria).subscribe({
      next: (eventos) => {
        this.eventosVet = eventos.map(e => ({
          id: e.id,
          titulo: e.nombre,
          descripcion: e.descripcion,
          fechainicio: e.fecha,
          fechafin: e.fechafin,
          imagen: this.getImageUrl(e.imagen, '')
        }));
        this.cdr.detectChanges();
      },
    });
  }

  private loadInventario(): void {
    if (!this.perfilVeterinario.idVeterinaria) {
      this.inventario = [];
      return;
    }
    this.veterinarioApiService.getInventarioByVeterinaria(this.perfilVeterinario.idVeterinaria).subscribe({
      next: (inventario) => {
        this.inventario = inventario;
      },
    });
  }

  private resetEventForm(): void {
    this.eventForm = {
      titulo: '',
      descripcion: '',
      fechainicio: '',
      fechafin: '',
      imagen: '',
    };
  }

  private resetProductForm(): void {
    this.productForm = {
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: '',
      cantidad: 0,
      imagen: '',
    };
  }

  private toInputDate(value: string | Date): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toISOString().slice(0, 10);
  }
}
