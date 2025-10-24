"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = require("../security/auth.middleware");
const router = (0, express_1.Router)();
// Todas as rotas de usuários protegidas por access token
router.use(auth_middleware_1.authGuard);
router.post('/', user_controller_1.default.create); // Criação de usuário (apenas autenticado) (POST /users)
router.get('/', user_controller_1.default.list); // Listar usuários (GET /users)
router.get('/:id', user_controller_1.default.getUserDataById); // Obter dados por ID (GET /users/:id)
router.put('/:id', user_controller_1.default.update); // Atualização completa por ID (PUT /users/:id)
router.patch('/:id', user_controller_1.default.update); // Atualização parcial por ID (PATCH /users/:id)
router.patch('/:id/metrics', user_controller_1.default.updateMetrics); // Atualização específica de métricas (PATCH /users/:id/metrics)
router.delete('/:id', user_controller_1.default.delete); // Remover usuário (DELETE /users/:id)
exports.default = router;
