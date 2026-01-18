import { Router } from 'express';
import passport from '../configs/passport';
import authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validation';
import {
  registerSchema,
  loginSchema,
  forgetPasswordSchema,
  verifyEmailSchema,
  resetPasswordSchema,
} from '../validations/auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post(
  '/forget-password',
  validate(forgetPasswordSchema),
  authController.forgetPassword
);
router.post(
  '/verify-email',
  validate(verifyEmailSchema),
  authController.verifyEmail
);
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword
);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/google/error' }),
  authController.googleCallback
);

router.get('/google/error', (_req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/auth/error?message=Google authentication failed`);
});

export default router;
