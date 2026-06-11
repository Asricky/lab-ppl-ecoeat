"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { displayToIdr, useBuyerOrdersStore } from "@/store/buyerOrdersStore";

type Phase = "idle" | "loading" | "success";

export default function RefundRequestButton({
  orderId,
  refundAmountDisplay,
  className = "",
}: {
  orderId: string;
  refundAmountDisplay: number;
  className?: string;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const completeRefund = useBuyerOrdersStore((s) => s.completeRefund);

  const run = () => {
    if (phase !== "idle") return;
    setPhase("loading");
    window.setTimeout(() => {
      setPhase("success");
      window.setTimeout(() => {
        completeRefund(orderId, displayToIdr(refundAmountDisplay));
      }, 1400);
    }, 1000);
  };

  if (phase === "success") {
    return (
      <div
        className={`flex items-center justify-center gap-2 py-4 rounded-xl bg-green-50 border-2 border-green-200 text-green-800 font-bold ${className}`}
      >
        <CheckCircle2 className="w-6 h-6 shrink-0" aria-hidden />
        <span>Refund berhasil — saldo EcoPay telah diperbarui</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={run}
      disabled={phase === "loading"}
      className={`flex items-center justify-center gap-2 disabled:opacity-80 ${className}`}
    >
      {phase === "loading" ? (
        <Loader2 className="w-5 h-5 animate-spin shrink-0" aria-hidden />
      ) : null}
      {phase === "loading" ? "Memproses…" : "Request Refund"}
    </button>
  );
}
