import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Ruta principal - Redirige al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Rutas de autenticación
  { path: 'login', component: LoginComponent },
  { path: 'register', loadComponent: () => import('./modules/auth/register.component').then(m => m.RegisterComponent) },
  { path: 'recovery', loadComponent: () => import('./modules/auth/recovery.component').then(m => m.RecoveryComponent) },
  { path: 'reset-password', loadComponent: () => import('./modules/auth/reset-password.component').then(m => m.ResetPasswordComponent) },
  
  // Rutas protegidas - Admin (rol 1)
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 1 },
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  
  // Rutas protegidas - Veterinario (rol 2)
  {
    path: 'veterinario',
    canActivate: [authGuard, roleGuard],
    data: { role: 2 },
    loadChildren: () => import('./modules/veterinario/veterinario.routes').then(m => m.VETERINARIO_ROUTES)
  },
  
  // Rutas protegidas - Usuario (rol 3)
  {
    path: 'usuario',
    canActivate: [authGuard, roleGuard],
    data: { role: 3 },
    loadChildren: () => import('./modules/usuario/usuario.routes').then(m => m.USUARIO_ROUTES)
  },
  
  // Rutas públicas
  { path: 'adopcion', loadComponent: () => import('./modules/adopcion/adopcion-list.component').then(m => m.AdopcionListComponent) },
  { path: 'tienda', loadComponent: () => import('./modules/tienda/tienda.component').then(m => m.TiendaComponent) },
  { path: 'servicios', loadComponent: () => import('./modules/servicios/servicios.component').then(m => m.ServiciosComponent) },
  { path: 'sobre-nosotros', loadComponent: () => import('./modules/sobre-nosotros/sobre-nosotros.component').then(m => m.SobreNosotrosComponent) },
  
  // Ruta por defecto
  { path: '**', redirectTo: '' }
];
