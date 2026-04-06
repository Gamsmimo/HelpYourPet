import { Routes } from '@angular/router';

export const USUARIO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./inicio/inicio-usuario.component').then(m => m.InicioUsuarioComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'mascotas',
    loadComponent: () => import('./mascotas/mascotas.component').then(m => m.MascotasComponent)
  },
  {
    path: 'citas',
    loadComponent: () => import('./citas/citas.component').then(m => m.CitasComponent)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.component').then(m => m.PerfilComponent)
  }
];
