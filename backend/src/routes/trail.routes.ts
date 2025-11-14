import { Router } from 'express';
import { authGuard } from '../security/auth.middleware';
import {
  listTrails,
  registrarExercicio,
  stats,
} from '../controllers/trail.controller';

const router = Router();

router.use(authGuard); // todas exigem usuário logado

router.get('/', listTrails); // GET /api/v1/trails  -> lista definições das trilhas
router.post('/registro', registrarExercicio); // POST /api/v1/trails/registro -> registra 1 exercício concluído
router.get('/stats', stats); // GET /api/v1/trails/stats?period=day|week|month|year|all

export default router;
