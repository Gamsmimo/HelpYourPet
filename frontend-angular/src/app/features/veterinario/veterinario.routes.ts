import { Routes } from '@angular/router';

export const VETERINARIO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent),
  },
  {
    path: 'citas',
    loadComponent: () => import('./components/citas/citas').then(m => m.CitasComponent),
  },
  {
    path: 'pacientes',
    loadComponent: () => import('./components/pacientes/pacientes').then(m => m.PacientesComponent),
  },
  { path: '**', redirectTo: '' },
];
