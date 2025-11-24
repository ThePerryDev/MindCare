// src/routes/feeling_bot.routes.ts

import { Router } from 'express';
import { authGuard } from '../security/auth.middleware';
import FeelingBotController from '../controllers/feeling_bot.controller';

const router = Router();

// Todas as rotas exigem JWT de acesso
router.use(authGuard);

router.get('/', FeelingBotController.list);

router.delete('/:day', FeelingBotController.deleteByDay);

router.delete('/', FeelingBotController.deleteAll);

export default router;
