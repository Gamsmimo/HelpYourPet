import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent),
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./components/usuarios/usuarios').then(m => m.UsuariosComponent),
  },
  {
    path: 'veterinarias',
    loadComponent: () => import('./components/veterinarias/veterinarias').then(m => m.VeterinariasComponent),
  },
  { path: '**', redirectTo: '' },
];
