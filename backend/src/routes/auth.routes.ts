// src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login, acceptConsent } from '../controllers/authController';

const router = Router();

// POST /auth/register
router.post('/register', register);

// POST /auth/login
router.post('/login', login);

// POST /auth/accept-consent
router.post('/accept-consent', acceptConsent);

export default router;
