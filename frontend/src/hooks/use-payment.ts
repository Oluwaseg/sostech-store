import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  initializePayment,
  reconcilePayments,
  verifyPayment,
} from '@/services/payment.service';
import {
  InitializePaymentRequest,
  InitializePaymentResponse,
  PaymentReconcileSummary,
  PaystackVerifyResponse,
} from '@/types/payment';

/* ===============================
   PAYMENT
================================= */

export const useInitializePayment = () => {
  return useMutation<
    InitializePaymentResponse,
    Error,
    InitializePaymentRequest
  >({
    mutationFn: initializePayment,
    onError: (error) => {
      toast.error(error.message || 'Failed to initialize payment');
    },
  });
};

export const useVerifyPayment = () => {
  return useMutation<PaystackVerifyResponse, Error, string>({
    mutationFn: verifyPayment,
    onError: (error) => {
      toast.error(error.message || 'Failed to verify payment');
    },
  });
};

export const useReconcilePayments = () => {
  return useMutation<PaymentReconcileSummary, Error, number | undefined>({
    mutationFn: reconcilePayments,
    onSuccess: () => {
      toast.success('Pending payments reconciled successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reconcile payments');
    },
  });
};
