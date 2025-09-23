// src/routes/user.routes.ts
import { Router } from 'express';
import {
  getMe,
  updateProfile,
  updateNotifications,
} from '../controllers/userController';

const router = Router();

// GET /user/me?authId=...
router.get('/me', getMe);

// PATCH /user/profile
router.patch('/profile', updateProfile);

// PATCH /user/notifications
router.patch('/notifications', updateNotifications);

export default router;
