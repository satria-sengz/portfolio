"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const ROSTER = [
  "inventory", "products", "payments", "shipping", "users", "notifications", "marketplaces",
  "shared utils", "web storefront", "mobile app", "POS app", "CMS", "scheduler", "user directory",
  "AI service", "marketplace middleware", "notification middleware", "OTP middleware", "email",
  "staff center", "infra",
];

const PLAN = [
  { agent: "infra", note: "checks the config and env the feature needs" },
  { agent: "users", note: "adds the permission scope" },
  { agent: "inventory", note: "low-stock endpoint; failing test committed first" },
  { agent: "notifications", note: "emits the alert event" },
  { agent: "notification middleware", note: "routes it to the store's channel" },
  { agent: "POS app", note: "shows the alert on the POS screen" },
];
const REVIEW = PLAN.length; // step index for the review line
const DONE = PLAN.length + 1;
const TICK = 600;

export function AgentPipeline() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(-1);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (step < 0 || step >= DONE) return;
    timer.current = window.setTimeout(() => setStep((s) => s + 1), reduce ? 0 : TICK);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [step, reduce]);

  const run = () => setStep(0);
  const running = step >= 0 && step < DONE;
  const stateOf = (name: string) => {
    const i = PLAN.findIndex((p) => p.agent === name);
    if (i < 0 || step < 0) return "idle";
    if (i < step) return "done";
    if (i === step) return "active";
    return "idle";
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn" onClick={run} disabled={running}>
          {step < 0 ? "Dispatch a cross-service feature" : running ? "Dispatching" : "Dispatch again"}
        </button>
        <span className="text-sm text-muted">Feature: low-stock alert on the POS screen</span>
      </div>

      <ul className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7">
        {ROSTER.map((name) => {
          const st = stateOf(name);
          return (
            <li
              key={name}
              className={`rounded-md border px-2 py-2 text-center text-xs leading-tight transition-colors duration-300 ${
                st === "active"
                  ? "border-ink bg-ticket text-ink"
                  : st === "done"
                    ? "border-green/60 bg-green/10 text-ink"
                    : "border-line text-muted"
              }`}
            >
              {name}
            </li>
          );
        })}
      </ul>

      <ol className="mt-6 min-h-[8.5rem] space-y-1.5 text-[0.95rem]">
        {PLAN.map((p, i) =>
          i <= step ? (
            <motion.li
              key={p.agent}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
              className="flex flex-col sm:flex-row sm:gap-3"
            >
              <span className="shrink-0 font-medium sm:w-48">{p.agent} agent</span>
              <span className="text-muted">{p.note}</span>
            </motion.li>
          ) : null,
        )}
        {step >= REVIEW && (
          <motion.li
            key="review"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="flex flex-col border-t border-line pt-2 sm:flex-row sm:gap-3"
          >
            <span className="shrink-0 font-medium sm:w-48">reviewer agent</span>
            <span className="text-muted">
              reads all six diffs before merge. Six agents, four repos, one ticket.
            </span>
          </motion.li>
        )}
      </ol>
    </div>
  );
}
