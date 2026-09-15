"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Phase = "idle" | "scanning" | "done";

const FIELDS = [
  { k: "Merchant", v: "Maju Jaya Stationery" },
  { k: "Date", v: "12 Feb 2026, 14:32" },
  { k: "Receipt number", v: "K7Q2M, generated (none printed)" },
  { k: "Total", v: "Rp 151.000" },
  { k: "Line items", v: "3" },
];

function Row({ l, r, bold }: { l: string; r: string; bold?: boolean }) {
  return (
    <p className={`flex justify-between gap-2 ${bold ? "font-semibold" : ""}`}>
      <span>{l}</span>
      <span>{r}</span>
    </p>
  );
}

export function ReceiptOCR() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const d = (i: number) => (reduce ? 0 : i * 0.18);

  const start = () => setPhase(reduce ? "done" : "scanning");

  return (
    <div className="grid items-start gap-8 md:grid-cols-[260px_1fr]">
      <div>
        <div className="relative w-full max-w-[260px]">
          <div className="receipt px-4 py-5">
            <p className="text-center font-semibold">MAJU JAYA STATIONERY</p>
            <p className="text-center">Jl. Raya Serpong 12, Tangerang</p>
            <p className="text-center">12/02/2026 14:32</p>
            <p className="my-2 border-t border-dashed border-current" />
            <Row l="A4 paper 80gsm x2" r="96.000" />
            <Row l="Ballpoint black x12" r="30.000" />
            <Row l="Stapler" r="25.000" />
            <p className="my-2 border-t border-dashed border-current" />
            <Row l="TOTAL" r="151.000" bold />
            <Row l="CASH" r="151.000" />
            <p className="mt-3 text-center">Terima kasih</p>
          </div>
          <AnimatePresence>
            {phase === "scanning" && (
              <motion.div
                key="scan"
                className="absolute left-0 right-0 h-[3px] bg-red shadow-[0_0_16px_var(--red)]"
                initial={{ top: "2%" }}
                animate={{ top: "97%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                onAnimationComplete={() => setPhase("done")}
              />
            )}
          </AnimatePresence>
        </div>
        <button type="button" className="btn mt-4" onClick={start} disabled={phase === "scanning"}>
          {phase === "idle" ? "Read receipt" : phase === "scanning" ? "Reading" : "Read again"}
        </button>
      </div>

      <div className="min-h-[240px]">
        {phase === "done" ? (
          <dl className="text-[0.95rem]">
            {FIELDS.map((f, i) => (
              <motion.div
                key={f.k}
                className="grid grid-cols-[130px_1fr] gap-x-4 border-b border-line py-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: d(i), duration: 0.3 }}
              >
                <dt className="text-muted">{f.k}</dt>
                <dd className="font-medium">{f.v}</dd>
              </motion.div>
            ))}
            <motion.div
              className="grid grid-cols-[130px_1fr] gap-x-4 border-b border-line py-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: d(FIELDS.length), duration: 0.3 }}
            >
              <dt className="text-muted">Category</dt>
              <dd>
                <span className="font-medium">Office supplies</span>
                <span className="ml-2 text-muted">second call, text model</span>
                <div className="mt-2 h-2 w-full max-w-[220px] overflow-hidden rounded bg-line">
                  <motion.div
                    className="h-2 rounded bg-green"
                    initial={{ width: 0 }}
                    animate={{ width: "92%" }}
                    transition={{ delay: d(FIELDS.length) + 0.1, duration: reduce ? 0 : 0.6 }}
                  />
                </div>
                <span className="text-xs text-muted">confidence 0.92</span>
              </dd>
            </motion.div>
            <motion.div
              className="grid grid-cols-[130px_1fr] gap-x-4 py-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: d(FIELDS.length + 1), duration: 0.3 }}
            >
              <dt className="text-muted">Claim description</dt>
              <dd>
                <span className="text-green">Matches.</span>{" "}
                <span className="text-muted">
                  &ldquo;stationery for store&rdquo; validated against 42 active categories, third call.
                </span>
              </dd>
            </motion.div>
          </dl>
        ) : (
          <p className="measure text-muted">
            The fields the pipeline returns will appear here. This is a replay of a real run with the
            merchant changed; nothing is sent anywhere.
          </p>
        )}
      </div>
    </div>
  );
}
