// src/app.ts
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';

const app = express();

// Middlewares globais
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // non-browser or same-origin
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.use(cookieParser());
app.use(express.json());

// Healthcheck
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

app.use(routes);

export default app;
