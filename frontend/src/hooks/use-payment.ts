import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { initializePayment, verifyPayment } from "@/services/payment.service";
import {
  InitializePaymentRequest,
  InitializePaymentResponse,
  PaystackVerifyResponse,
} from "@/types/payment";

/* ===============================
   PAYMENT
================================= */

export const useInitializePayment = () => {
  return useMutation<InitializePaymentResponse, Error, InitializePaymentRequest>(
    {
      mutationFn: initializePayment,
      onError: (error) => {
        toast.error(error.message || "Failed to initialize payment");
      },
    },
  );
};

export const useVerifyPayment = () => {
  return useMutation<PaystackVerifyResponse, Error, string>({
    mutationFn: verifyPayment,
    onError: (error) => {
      toast.error(error.message || "Failed to verify payment");
    },
  });
};

