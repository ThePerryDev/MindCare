// src/app.ts
import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// Middlewares globais
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.use(express.json());

// Healthcheck
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

// Rotas da API
app.use('/api', routes);

export default app;
