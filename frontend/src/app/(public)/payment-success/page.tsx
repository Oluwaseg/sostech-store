"use client";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { useVerifyPayment } from "@/hooks/use-payment";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const reference = useMemo(
    () => searchParams.get("reference") || "",
    [searchParams],
  );

  const { mutate: verify, data, isPending, isError, error } = useVerifyPayment();

  useEffect(() => {
    if (!reference) return;
    verify(reference);
  }, [reference, verify]);

  const status = data?.data?.status;

  return (
    <main>
      <Navbar />
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border/60 rounded-2xl p-8 shadow-sm space-y-5">
            <h1 className="text-3xl font-bold text-foreground">
              Payment Confirmation
            </h1>

            {!reference && (
              <p className="text-foreground/70">
                Missing Paystack reference. Please return to checkout and try
                again.
              </p>
            )}

            {reference && isPending && (
              <div className="flex items-center gap-3 text-foreground/70">
                <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground/80 rounded-full animate-spin" />
                Verifying your payment...
              </div>
            )}

            {reference && isError && (
              <p className="text-red-600">
                {error?.message || "Payment verification failed"}
              </p>
            )}

            {reference && !isPending && !isError && data && (
              <div className="space-y-2">
                <p className="text-foreground/80">
                  Reference: <span className="font-mono">{reference}</span>
                </p>
                <p className="text-foreground/80">
                  Status:{" "}
                  <span className="font-semibold">{status || "unknown"}</span>
                </p>
                <p className="text-foreground/60 text-sm">
                  You can safely close this page after confirmation.
                </p>
              </div>
            )}

            <div className="pt-2 flex gap-3">
              <Button asChild className="rounded-xl">
                <a href="/">Back to home</a>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <a href="/dashboard">Go to dashboard</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

