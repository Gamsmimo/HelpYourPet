import { Routes } from '@angular/router';
import { LoginComponent } from './auth/log-in/log-in';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { APP_PATHS, USER_ROLES } from './core/constants/app.constants';

const AUTH_ROUTES: Routes = [
  { path: APP_PATHS.LOGIN, component: LoginComponent },
  { path: APP_PATHS.REGISTER,        loadComponent: () => import('./auth/sign-in/sign-in').then(m => m.SignInComponent) },
];

const PRIVATE_ROUTES: Routes = [
  {
    path: APP_PATHS.ADMIN,
    canActivate: [authGuard, roleGuard],
    data: { role: USER_ROLES.ADMIN },
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: APP_PATHS.VETERINARIO,
    canActivate: [authGuard, roleGuard],
    data: { role: USER_ROLES.VETERINARIO },
    loadChildren: () => import('./features/veterinario/veterinario.routes').then(m => m.VETERINARIO_ROUTES),
  },
  {
    path: APP_PATHS.USUARIO,
    canActivate: [authGuard, roleGuard],
    data: { role: USER_ROLES.USUARIO },
    loadChildren: () => import('./features/usuario/usuario.routes').then(m => m.USUARIO_ROUTES),
  },
];

const PUBLIC_ROUTES: Routes = [
  { path: APP_PATHS.ADOPCION,       loadComponent: () => import('./features/adopcion/components/adopcion/adopcion').then(m => m.AdopcionListComponent) },
  { path: APP_PATHS.TIENDA,         loadComponent: () => import('./features/tienda/components/tienda/tienda').then(m => m.TiendaComponent) },
  { path: APP_PATHS.SERVICIOS,      loadComponent: () => import('./features/servicios/components/servicios/servicios').then(m => m.ServiciosComponent) },
];

export const routes: Routes = [
  { path: APP_PATHS.ROOT, redirectTo: APP_PATHS.LOGIN, pathMatch: 'full' },
  ...AUTH_ROUTES,
  ...PRIVATE_ROUTES,
  ...PUBLIC_ROUTES,
  { path: '**', redirectTo: APP_PATHS.ROOT },
];
