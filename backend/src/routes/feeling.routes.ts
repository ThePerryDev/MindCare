import { Router } from 'express';
import { authGuard } from '../security/auth.middleware';
import FeelingController from '../controllers/feeling.controller';

const router = Router();

// Todas as rotas de feelings exigem JWT de acesso
router.use(authGuard);

/**
 * Create (entrada/saída)
 * - POST /api/v1/feelings/entrada
 * - POST /api/v1/feelings/saida
 */
router.post('/entrada', FeelingController.createEntrada);
router.post('/saida', FeelingController.createSaida);

/**
 * List
 * - GET  /api/v1/feelings?inicio=YYYY-MM-DD&fim=YYYY-MM-DD
 */
router.get('/', FeelingController.list);

/**
 * Update (entrada/saída por dia)
 * - PATCH /api/v1/feelings/entrada/:day
 * - PATCH /api/v1/feelings/saida/:day
 */
router.patch('/entrada/:day', FeelingController.updateEntrada);
router.patch('/saida/:day', FeelingController.updateSaida);

export default router;
