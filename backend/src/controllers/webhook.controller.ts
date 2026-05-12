import crypto from 'crypto';
import { Request, Response } from 'express';
import paymentService from '../services/payment.service';

class WebhookController {
  async paystackWebhook(req: Request, res: Response) {
    try {
      const event = req.body;
      const rawBody = (req as any).rawBody as string | undefined;
      const signatureHeader =
        (req.headers['x-paystack-signature'] as string) || undefined;
      const webhookSecret = process.env.PAYSTACK_SECRET_KEY;

      if (webhookSecret) {
        if (!signatureHeader) {
          return res
            .status(401)
            .json({ success: false, message: 'Missing Paystack signature' });
        }

        const payload = rawBody || JSON.stringify(req.body || {});
        const expectedSignature = crypto
          .createHmac('sha512', webhookSecret)
          .update(payload)
          .digest('hex');

        const signatureBuffer = Buffer.from(signatureHeader, 'utf8');
        const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
        if (
          expectedBuffer.length !== signatureBuffer.length ||
          !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
        ) {
          return res
            .status(401)
            .json({ success: false, message: 'Invalid Paystack signature' });
        }
      }

      if (!event || !event.data || !event.data.reference) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid webhook payload' });
      }

      await paymentService.handlePaystackWebhook(event);
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new WebhookController();
