"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TTL = process.env.REFRESH_TOKEN_TTL || '7d';
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const isProd = process.env.NODE_ENV === 'production';
function setRefreshCookie(res, token) {
    const domain = process.env.REFRESH_COOKIE_DOMAIN || undefined;
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/api/v1/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        ...(domain ? { domain } : {}),
    });
}
function signAccess(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TTL });
}
function signRefresh(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TTL,
    });
}
const register = async (req, res) => {
    try {
        const { fullName, email, phone, birthdate, height, weight, password, confirmPassword, } = req.body;
        if (!email || !password || !fullName)
            return res
                .status(400)
                .json({ error: 'fullName, email e password são obrigatórios' });
        if (password !== confirmPassword)
            return res.status(400).json({ error: 'As senhas não coincidem' });
        const exists = await user_model_1.default.findOne({ email });
        if (exists)
            return res.status(400).json({ error: 'E-mail já cadastrado' });
        const hash = await bcrypt_1.default.hash(password, 10);
        const user = await user_model_1.default.create({
            fullName,
            email,
            phone,
            birthdate,
            height,
            weight,
            password: hash,
        });
        const accessToken = signAccess({ sub: user.id, email: user.email });
        const refreshToken = signRefresh({ sub: user.id });
        setRefreshCookie(res, refreshToken);
        const safeUser = user.toJSON();
        return res.status(201).json({ user: safeUser, accessToken });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res
                .status(400)
                .json({ error: 'email e password são obrigatórios' });
        const user = await user_model_1.default.findOne({ email }).select('+password');
        if (!user)
            return res.status(404).json({ error: 'usuário não encontrado' });
        const ok = await bcrypt_1.default.compare(password, user.password);
        if (!ok)
            return res.status(401).json({ error: 'credenciais inválidas' });
        const accessToken = signAccess({ sub: user.id, email: user.email });
        const refreshToken = signRefresh({ sub: user.id });
        setRefreshCookie(res, refreshToken);
        const safe = user.toJSON();
        return res.status(200).json({ user: safe, accessToken });
    }
    catch (err) {
        return res
            .status(500)
            .json({ error: err.message || 'erro ao fazer login' });
    }
};
exports.login = login;
const refresh = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token)
            return res.status(401).json({ error: 'refresh token ausente' });
        const payload = jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
        const user = await user_model_1.default.findById(payload.sub);
        if (!user)
            return res.status(404).json({ error: 'usuário não encontrado' });
        const accessToken = signAccess({ sub: user.id, email: user.email });
        const newRefresh = signRefresh({ sub: user.id });
        setRefreshCookie(res, newRefresh);
        return res.status(200).json({ accessToken });
    }
    catch (_e) {
        return res
            .status(401)
            .json({ error: 'refresh token inválido ou expirado' });
    }
};
exports.refresh = refresh;
const logout = async (_req, res) => {
    res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
    return res.status(200).json({ message: 'logout efetuado' });
};
exports.logout = logout;
