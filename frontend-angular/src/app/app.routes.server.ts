import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'login',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'register',
    renderMode: RenderMode.Prerender,
  },
  {
    // Todas las rutas protegidas deben renderizarse solo en el cliente
    // para evitar que el SSR (sin localStorage) piense que el usuario no tiene sesión
    path: '**',
    renderMode: RenderMode.Client,
  },
];
