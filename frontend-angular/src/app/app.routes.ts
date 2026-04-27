import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { APP_PATHS, USER_ROLES } from './core/constants/app.constants';

const AUTH_ROUTES: Routes = [
  { path: APP_PATHS.LOGIN, component: LoginComponent },
  { path: APP_PATHS.REGISTER, loadComponent: () => import('./modules/auth/register.component').then(m => m.RegisterComponent) },
  { path: APP_PATHS.RECOVERY, loadComponent: () => import('./modules/auth/recovery.component').then(m => m.RecoveryComponent) },
  { path: APP_PATHS.RESET_PASSWORD, loadComponent: () => import('./modules/auth/reset-password.component').then(m => m.ResetPasswordComponent) },
];

const PRIVATE_ROUTES: Routes = [
  {
    path: APP_PATHS.ADMIN,
    canActivate: [authGuard, roleGuard],
    data: { role: USER_ROLES.ADMIN },
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: APP_PATHS.VETERINARIO,
    canActivate: [authGuard, roleGuard],
    data: { role: USER_ROLES.VETERINARIO },
    loadChildren: () => import('./modules/veterinario/veterinario.routes').then(m => m.VETERINARIO_ROUTES),
  },
  {
    path: APP_PATHS.USUARIO,
    canActivate: [authGuard, roleGuard],
    data: { role: USER_ROLES.USUARIO },
    loadChildren: () => import('./modules/usuario/usuario.routes').then(m => m.USUARIO_ROUTES),
  },
];

const PUBLIC_ROUTES: Routes = [
  { path: APP_PATHS.ADOPCION, loadComponent: () => import('./modules/adopcion/adopcion-list.component').then(m => m.AdopcionListComponent) },
  { path: APP_PATHS.TIENDA, loadComponent: () => import('./modules/tienda/tienda.component').then(m => m.TiendaComponent) },
  { path: APP_PATHS.SERVICIOS, loadComponent: () => import('./modules/servicios/servicios.component').then(m => m.ServiciosComponent) },
  { path: APP_PATHS.SOBRE_NOSOTROS, loadComponent: () => import('./modules/sobre-nosotros/sobre-nosotros.component').then(m => m.SobreNosotrosComponent) },
];

export const routes: Routes = [
  { path: APP_PATHS.ROOT, redirectTo: APP_PATHS.LOGIN, pathMatch: 'full' },
  ...AUTH_ROUTES,
  ...PRIVATE_ROUTES,
  ...PUBLIC_ROUTES,
  { path: '**', redirectTo: APP_PATHS.ROOT },
];
