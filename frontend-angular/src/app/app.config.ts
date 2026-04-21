import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    // NOTA: Se eliminó APP_INITIALIZER con AppInitService porque:
    // 1. Bloqueaba el arranque de la app esperando una llamada HTTP a /usuarios/:id
    // 2. Causaba condición de carrera con los componentes que hacen la misma llamada
    // 3. Interfería con el Change Detection de Angular
    // Cada componente (Perfil, Inicio) carga sus propios datos del usuario cuando los necesita
  ],
};
