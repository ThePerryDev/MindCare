"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = authGuard;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
function authGuard(req, res, next) {
    const header = req.headers.authorization || '';
    const [, token] = header.split(' '); // Bearer <token>
    if (!token) {
        return res.status(401).json({ error: 'token ausente' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = { sub: payload.sub, email: payload.email };
        return next();
    }
    catch {
        return res.status(401).json({ error: 'token inválido ou expirado' });
    }
}
