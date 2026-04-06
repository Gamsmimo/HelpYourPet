import { Routes } from '@angular/router';

export const VETERINARIO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'citas',
    loadComponent: () => import('./citas/citas.component').then(m => m.CitasComponent)
  },
  {
    path: 'pacientes',
    loadComponent: () => import('./pacientes/pacientes.component').then(m => m.PacientesComponent)
  }
];
