export interface Environment {
  production: boolean;
  apiUrl: string;
}

export const environment: Environment = {
  production: true,
  apiUrl: 'https://api.helpyourpet.com' // Cambiar por tu URL de producción
};
