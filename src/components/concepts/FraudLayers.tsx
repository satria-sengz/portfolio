"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const LAYERS = [
  "Exact hash (SHA-256)",
  "Perceptual hash",
  "Receipt number",
  "Transaction fingerprint",
  "Behaviour",
];
type Outcome = "pass" | "flag" | "block";
type Scenario = { id: string; label: string; results: Outcome[]; verdict: string };

const SCENARIOS: Scenario[] = [
  {
    id: "dup",
    label: "Submit the same file again",
    results: ["block"],
    verdict: "Blocked before saving. This exact file was already claimed on 3 Feb.",
  },
  {
    id: "rephoto",
    label: "Submit a re-photographed receipt",
    results: ["pass", "flag", "pass", "flag", "pass"],
    verdict: "Accepted with two flags. The approver sees them next to the receipt.",
  },
  {
    id: "new",
    label: "Submit a new receipt",
    results: ["pass", "pass", "pass", "pass", "pass"],
    verdict: "Accepted. Sent to the first approver.",
  },
];

const ROW = 52; // px per layer row
const TICK = 480;

export function FraudLayers() {
  const reduce = useReducedMotion();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [pos, setPos] = useState(-1); // index of the layer the receipt has reached
  const [showVerdict, setShowVerdict] = useState(false);

  const last = scenario ? scenario.results.length - 1 : -1;
  const running = scenario !== null && !showVerdict;

  useEffect(() => {
    if (!scenario || reduce || showVerdict) return;
    if (pos < last) {
      const t = window.setTimeout(() => setPos((p) => p + 1), TICK);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setShowVerdict(true), TICK);
    return () => window.clearTimeout(t);
  }, [scenario, pos, last, reduce, showVerdict]);

  const run = (s: Scenario) => {
    setScenario(s);
    if (reduce) {
      // No motion: jump straight to the end state.
      setPos(s.results.length - 1);
      setShowVerdict(true);
      return;
    }
    setShowVerdict(false);
    setPos(-1);
  };

  const outcomeAt = (i: number): Outcome | null =>
    scenario && i <= pos && i < scenario.results.length ? scenario.results[i] : null;
  const blocked = scenario?.results[pos] === "block";

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`btn ${scenario?.id === s.id ? "" : "btn-quiet"}`}
            onClick={() => run(s)}
            disabled={running}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="relative mt-6 max-w-[560px]">
        <ol className="m-0 list-none p-0">
          {LAYERS.map((name, i) => {
            const o = outcomeAt(i);
            return (
              <li
                key={name}
                style={{ height: ROW }}
                className="grid grid-cols-[40px_1fr_auto] items-center gap-3 border-b border-line"
              >
                <span />
                <span className={`text-[0.95rem] ${o ? "font-medium" : "text-muted"}`}>
                  {i + 1}. {name}
                </span>
                <span
                  className={`text-xs ${
                    o === "block" ? "text-red" : o === "flag" ? "text-ink" : o === "pass" ? "text-green" : "text-muted"
                  }`}
                >
                  {o === "block" ? "blocked" : o === "flag" ? "flagged" : o === "pass" ? "passed" : ""}
                </span>
              </li>
            );
          })}
        </ol>

        {scenario && (
          <motion.div
            aria-hidden="true"
            className={`absolute left-1 h-7 w-6 rounded-sm border ${blocked ? "border-red bg-red/20" : "border-ink bg-ticket"}`}
            initial={{ top: -30 }}
            animate={{ top: pos < 0 ? -30 : pos * ROW + (ROW - 28) / 2 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 24 }}
          />
        )}
      </div>

      <p className={`mt-4 min-h-[1.6rem] text-[0.95rem] ${blocked ? "text-red" : ""}`} aria-live="polite">
        {showVerdict && scenario ? scenario.verdict : ""}
      </p>
    </div>
  );
}
