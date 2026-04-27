export const USER_ROLES = {
  ADMIN: 1,
  VETERINARIO: 2,
  USUARIO: 3,
} as const;

export const APP_PATHS = {
  ROOT: '',
  LOGIN: 'login',
  REGISTER: 'register',
  RECOVERY: 'recovery',
  RESET_PASSWORD: 'reset-password',
  ADMIN: 'admin',
  VETERINARIO: 'veterinario',
  USUARIO: 'usuario',
  ADOPCION: 'adopcion',
  TIENDA: 'tienda',
  SERVICIOS: 'servicios',
  SOBRE_NOSOTROS: 'sobre-nosotros',
} as const;

export const ROLE_HOME_PATH: Record<number, string> = {
  [USER_ROLES.ADMIN]: `/${APP_PATHS.ADMIN}`,
  [USER_ROLES.VETERINARIO]: `/${APP_PATHS.VETERINARIO}`,
  [USER_ROLES.USUARIO]: `/${APP_PATHS.USUARIO}`,
};
