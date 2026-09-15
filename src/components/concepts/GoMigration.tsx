"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const ROUTES = [
  "balance",
  "receiving",
  "adjustment",
  "pooling",
  "stock-count",
  "outbound",
  "reports",
  "masters",
];
const N = ROUTES.length;
const NODE_GIB = 1.5;
const GO_GIB = 0.3;
const TICK = 380;

export function GoMigration() {
  const reduce = useReducedMotion();
  const [onGo, setOnGo] = useState(0);
  const [target, setTarget] = useState(0);
  const running = onGo !== target;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setOnGo((v) => (v < target ? v + 1 : v - 1)), TICK);
    return () => window.clearTimeout(t);
  }, [onGo, target, running]);

  const toggle = () => {
    const next = onGo === N ? 0 : N;
    setTarget(next);
    if (reduce) setOnGo(next); // no motion: jump straight to the end state
  };
  const nodeGib = NODE_GIB * (1 - onGo / N);
  const goGib = GO_GIB * (onGo / N);
  const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn" onClick={toggle} disabled={running}>
          {onGo === N ? "Send it back to Node" : onGo === 0 ? "Route traffic to Go" : "Routing"}
        </button>
        <span className="text-sm text-muted">
          {onGo === N
            ? `All ${N} paths are on Go. Node is idle, still deployed, one routing change away.`
            : onGo === 0
              ? `All ${N} paths still hit Node. Nothing has moved yet.`
              : `Traefik sends ${onGo} of ${N} paths to Go. The other ${N - onGo} still hit Node.`}
        </span>
      </div>

      <div className="mt-6 grid gap-2 text-sm">
        {[
          { name: "Node", gib: nodeGib, cls: "bg-rail" },
          { name: "Go", gib: goGib, cls: "bg-green" },
        ].map((b) => (
          <div key={b.name} className="grid grid-cols-[52px_1fr_88px] items-center gap-3">
            <span className="font-medium">{b.name}</span>
            <div className="h-2.5 overflow-hidden rounded bg-line">
              <motion.div
                className={`h-2.5 rounded ${b.cls}`}
                animate={{ width: `${(b.gib / NODE_GIB) * 100}%` }}
                transition={reduce ? { duration: 0 } : spring}
              />
            </div>
            <span className="text-right text-muted">{b.gib.toFixed(2)} GiB</span>
          </div>
        ))}
      </div>

      <ul className="mt-6 divide-y divide-line border-y border-line">
        {ROUTES.map((r, i) => {
          const moved = i < onGo;
          return (
            <li key={r} className="grid grid-cols-[64px_1fr_64px] items-center gap-2 py-2 sm:grid-cols-[72px_1fr_1fr_72px]">
              <span className={`text-xs ${moved ? "text-muted" : "font-medium"}`}>Node</span>
              <div className="relative h-5 border-b border-dashed border-line">
                <motion.span
                  className={`absolute top-1 h-3 w-3 rounded-full ${moved ? "bg-green" : "bg-ticket"} border border-ink`}
                  animate={{ left: moved ? "calc(100% - 12px)" : "0%" }}
                  transition={reduce ? { duration: 0 } : spring}
                />
                <span className="absolute left-1/2 -top-0.5 -translate-x-1/2 whitespace-nowrap text-xs text-muted">/{r}</span>
              </div>
              <span className="hidden text-xs text-green sm:block">
                {moved ? "byte-identical, golden tests green" : ""}
              </span>
              <span className={`text-right text-xs ${moved ? "font-medium text-green" : "text-muted"}`}>Go</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-muted">
        Rolling a path back is one routing change. The Node service never went away during the move.
      </p>
    </div>
  );
}
