// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const router = Router();

// Agrupar por domínio
router.use('/auth', authRoutes);
router.use('/user', userRoutes);

// Espaço para próximas sprints:
// import checkinsRoutes from './checkins.routes';
// router.use('/checkins', checkinsRoutes);
// import activitiesRoutes from './activities.routes';
// router.use('/activities', activitiesRoutes);
// import plansRoutes from './plans.routes';
// router.use('/plans', plansRoutes);
// import completionsRoutes from './completions.routes';
// router.use('/completions', completionsRoutes);

export default router;
