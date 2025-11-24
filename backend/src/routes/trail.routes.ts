// src/routes/trail.routes.ts

import { Router } from 'express';
import { authGuard } from '../security/auth.middleware';
import {
  listTrails,
  getTrailById,
  getTrailByObjectId,
  registrarExercicio,
  stats,
  getNextExercise,
} from '../controllers/trail.controller';

const router = Router();

router.use(authGuard);

router.get('/', listTrails);
router.get('/id/:trailId', getTrailById);
router.get('/obj/:id', getTrailByObjectId);
router.post('/registro', registrarExercicio);
router.get('/stats', stats);
router.get('/next', getNextExercise);

export default router;
