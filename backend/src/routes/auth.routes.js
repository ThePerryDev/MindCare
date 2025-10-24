"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.register); // Registro com criação de usuário e emissão de tokens (POST /auth/register)
router.post('/login', auth_controller_1.login); // Login com verificação de credenciais e emissão de tokens (POST /auth/login)
router.post('/refresh', auth_controller_1.refresh); // Renovação do access token usando refresh token em cookie HttpOnly (POST /auth/refresh)
router.post('/logout', auth_controller_1.logout); // Logout e limpando o cookie de refresh (POST /auth/logout)
exports.default = router;
