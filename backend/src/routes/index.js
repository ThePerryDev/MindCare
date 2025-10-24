"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/index.ts
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const router = (0, express_1.Router)();
// Prefixos de API e versão
const api = (0, express_1.Router)();
const v1 = (0, express_1.Router)();
// Monta recursos da v1
v1.use('/auth', auth_routes_1.default); // /api/v1/auth/...
v1.use('/users', user_routes_1.default); // /api/v1/users/...
// Encadeia versão dentro de /api
api.use('/v1', v1);
// Expõe tudo sob /api
router.use('/api', api);
exports.default = router;
