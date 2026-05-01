import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Unauthorized - redirigir a login
        router.navigate(['/log-in']);
      } else if (error.status === 403) {
        // Forbidden - mostrar mensaje de acceso denegado
        console.error('Acceso denegado:', error.message);
      } else if (error.status === 500) {
        // Error del servidor
        console.error('Error del servidor:', error.message);
      } else if (error.status === 0) {
        // Error de red/CORS
        console.error('Error de conexión:', error.message);
      }

      // Retornar el error para que el componente pueda manejarlo si es necesario
      return throwError(() => error);
    })
  );
};
