// src/routes/user.routes.ts

import { Router } from 'express';
import UsersController from '../controllers/user.controller';
import { authGuard } from '../security/auth.middleware';

const router = Router();

// Todas as rotas de usuários protegidas por access token
router.use(authGuard);

router.post('/', UsersController.create); // Criação de usuário (apenas autenticado) (POST /users)
router.get('/', UsersController.list); // Listar usuários (GET /users)
router.get('/:id', UsersController.getUserDataById); // Obter dados por ID (GET /users/:id)
router.put('/:id', UsersController.update); // Atualização completa por ID (PUT /users/:id)
router.patch('/:id', UsersController.update); // Atualização parcial por ID (PATCH /users/:id)
router.patch('/:id/metrics', UsersController.updateMetrics); // Atualização específica de métricas (PATCH /users/:id/metrics)
router.delete('/:id', UsersController.delete); // Remover usuário (DELETE /users/:id)

export default router;
