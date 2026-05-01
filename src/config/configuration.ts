export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'helppet',
    password: process.env.DB_PASSWORD || 'helppet123',
    database: process.env.DB_DATABASE || 'help_your_pet',
    synchronize: process.env.NODE_ENV === 'development' && process.env.ALLOW_DB_SYNC === 'true',
    logging: process.env.NODE_ENV === 'development',
    extra: {
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
      acquireTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '60000', 10),
      timeout: 60000,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  cors: {
    origin: (origin, callback) => {
      const frontendUrl = process.env.FRONTEND_URL;
      
      // En desarrollo, permitir localhost en cualquier puerto
      if (process.env.NODE_ENV === 'development') {
        if (!origin || 
            origin.startsWith('http://localhost:') || 
            origin.startsWith('http://127.0.0.1:') ||
            origin === frontendUrl) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } else {
        // En producción, solo permitir el origen específico
        if (origin === frontendUrl) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    ttl: parseInt(process.env.CACHE_TTL || '60', 10),
  },
});