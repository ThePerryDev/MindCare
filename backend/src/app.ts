// src/app.ts
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';

const app = express();

// 👇 LOGGER GLOBAL: tudo que entrar passa aqui
app.use((req, _res, next) => {
  console.log('────────────────────────────');
  console.log('[REQ]', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('IP:', req.ip);
  console.log('Headers:', req.headers);
  next();
});

// CORS
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log('[CORS BLOQUEADO]', origin);
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.use(cookieParser());
app.use(express.json());

// health
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

app.use(routes);

// 👇 logger de erro (se der ruim no controller, aparece aqui)
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('[ERR MIDDLEWARE]', err);
    res.status(500).json({ error: 'erro interno' });
  }
);

export default app;