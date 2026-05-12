import { Router } from 'express';
import webhookController from '../controllers/webhook.controller';
import { webhookRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Paystack webhook endpoint
router.post('/paystack', webhookRateLimiter, webhookController.paystackWebhook);

export default router;
