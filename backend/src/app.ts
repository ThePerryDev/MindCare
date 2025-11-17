// src/app.ts
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';

const app = express();

<<<<<<< HEAD
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
=======
// Middlewares globais
>>>>>>> 89fbd3b9cb5788ac8e705b6e09d6cffbe03595a8
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
<<<<<<< HEAD
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log('[CORS BLOQUEADO]', origin);
=======
      if (!origin) return callback(null, true); // non-browser or same-origin
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin))
        return callback(null, true);
>>>>>>> 89fbd3b9cb5788ac8e705b6e09d6cffbe03595a8
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
<<<<<<< HEAD

app.use(cookieParser());
app.use(express.json());

// health
=======
app.use(cookieParser());
app.use(express.json());

// Healthcheck
>>>>>>> 89fbd3b9cb5788ac8e705b6e09d6cffbe03595a8
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

app.use(routes);

<<<<<<< HEAD
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

=======
>>>>>>> 89fbd3b9cb5788ac8e705b6e09d6cffbe03595a8
export default app;
