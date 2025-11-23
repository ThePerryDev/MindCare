// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import feelingRoutes from './feeling.routes';
import feelingBotRoutes from './feeling_bot.routes'; // <- NOVO IMPORT
import trailRoutes from './trail.routes';

const router = Router();

// Prefixos de API e versão
const api = Router();
const v1 = Router();

// Monta recursos da v1
v1.use('/auth', authRoutes); // /api/v1/auth/...
v1.use('/users', userRoutes); // /api/v1/users/...
v1.use('/feelings', feelingRoutes); // /api/v1/feelings/...
v1.use('/feeling-bot', feelingBotRoutes); // /api/v1/feeling-bot/... <- NOVO
v1.use('/trails', trailRoutes); // /api/v1/trails/

// Encadeia versão dentro de /api
api.use('/v1', v1);

// Expõe tudo sob /api
router.use('/api', api);

export default router;
