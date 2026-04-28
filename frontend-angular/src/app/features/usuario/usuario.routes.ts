import { Routes } from '@angular/router';

export const USUARIO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/inicio/inicio').then(m => m.InicioUsuarioComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent),
  },
  {
    path: 'mascotas',
    loadComponent: () => import('./components/mascotas/mascotas').then(m => m.MascotasComponent),
  },
  {
    path: 'citas',
    loadComponent: () => import('./components/citas/citas').then(m => m.CitasComponent),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./components/perfil/perfil').then(m => m.PerfilComponent),
  },
  { path: '**', redirectTo: '' },
];
