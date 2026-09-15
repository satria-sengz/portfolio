"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const STAGES = [
  { label: "spec", x: 50 },
  { label: "ticket", x: 150 },
  { label: "failing test", x: 250 },
  { label: "code", x: 350 },
  { label: "review", x: 450 },
  { label: "deploy", x: 550 },
];
const RAIL_Y = 104;
const TICKET_Y = RAIL_Y - 38;
const HOP = 0.8; // seconds per stage
const SPAWN_MS = 2400;

type Ticket = { id: number; bounce: boolean };
type Flash = "idle" | "red" | "green";

const XS = STAGES.map((s) => s.x);
const BOUNCE_XS = [50, 150, 250, 350, 450, 350, 450, 550];

function TicketShape() {
  return (
    <>
      <rect x={-17} y={TICKET_Y - 11} width={34} height={22} rx={4} className="fill-ticket stroke-ink" strokeWidth={1.75} />
      <line x1={-10} y1={TICKET_Y - 3} x2={8} y2={TICKET_Y - 3} className="stroke-ink" strokeWidth={1.75} />
      <line x1={-10} y1={TICKET_Y + 4} x2={2} y2={TICKET_Y + 4} className="stroke-ink" strokeWidth={1.75} />
    </>
  );
}

export function DeliveryLoop() {
  const reduce = useReducedMotion();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [flash, setFlash] = useState<Flash>("idle");
  const [deployed, setDeployed] = useState(0);
  const [bounced, setBounced] = useState(0);
  const [pulse, setPulse] = useState(0);
  const nextId = useRef(1);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (reduce) return;
    const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
    const spawn = () => {
      const id = nextId.current++;
      setTickets((t) => [...t, { id, bounce: id % 4 === 0 }]);
      later(() => setFlash("red"), 2 * HOP * 1000);
      later(() => setFlash("green"), (2 * HOP + 0.5) * 1000);
      later(() => setFlash("idle"), (2 * HOP + 1.3) * 1000);
    };
    spawn();
    const iv = window.setInterval(spawn, SPAWN_MS);
    const pending = timers.current;
    return () => {
      window.clearInterval(iv);
      pending.forEach((t) => window.clearTimeout(t));
      pending.length = 0;
    };
  }, [reduce]);

  const finish = (t: Ticket) => {
    setTickets((list) => list.filter((x) => x.id !== t.id));
    setDeployed((d) => d + 1);
    setPulse((p) => p + 1);
    if (t.bounce) setBounced((b) => b + 1);
  };

  const gateClass =
    flash === "red"
      ? "fill-red stroke-red"
      : flash === "green" || reduce
        ? "fill-green stroke-green"
        : "fill-paper stroke-rail";

  return (
    <div className="w-full max-w-[600px]">
      <svg
        viewBox="0 0 600 200"
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label="The delivery loop: tickets move from spec to deploy. The failing-test gate turns red, then green. Every fourth ticket is sent back from review to code."
      >
        <defs>
          <marker id="arrow-back" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-red" />
          </marker>
        </defs>

        {/* rail */}
        <line x1={24} y1={RAIL_Y} x2={576} y2={RAIL_Y} className="stroke-line" strokeWidth={3} />

        {/* the way back: review sends a ticket to code */}
        <path
          d={`M 450 ${RAIL_Y + 44} C 450 ${RAIL_Y + 86}, 350 ${RAIL_Y + 86}, 350 ${RAIL_Y + 46}`}
          fill="none"
          className="stroke-red"
          strokeWidth={1.75}
          strokeDasharray="4 4"
          opacity={0.8}
          markerEnd="url(#arrow-back)"
        />
        <text x={400} y={RAIL_Y + 84} textAnchor="middle" fontSize={11.5} fontFamily="var(--font-sans)" className="fill-red">
          sent back
        </text>

        {STAGES.map((s, i) => (
          <g key={s.label}>
            <circle
              cx={s.x}
              cy={RAIL_Y}
              r={i === 2 ? 13 : 10}
              strokeWidth={2.5}
              className={i === 2 ? `${gateClass} transition-[fill,stroke] duration-300` : "fill-paper stroke-rail"}
            />
            {i === 2 && flash === "red" && (
              <text x={s.x} y={RAIL_Y + 4.5} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-paper" fontFamily="var(--font-sans)">
                !
              </text>
            )}
            <text
              x={s.x}
              y={RAIL_Y + 32}
              textAnchor="middle"
              fontSize={12.5}
              fontFamily="var(--font-sans)"
              className={i === 2 ? "fill-ink" : "fill-muted"}
              fontWeight={i === 2 ? 600 : 400}
            >
              {s.label}
            </text>
          </g>
        ))}

        {pulse > 0 && (
          <motion.circle
            key={pulse}
            cx={550}
            cy={RAIL_Y}
            initial={{ r: 10, opacity: 0.9 }}
            animate={{ r: 34, opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="fill-none stroke-green"
            strokeWidth={2.5}
          />
        )}

        {reduce
          ? [150, 350, 550].map((x) => (
              <g key={x} transform={`translate(${x} 0)`}>
                <TicketShape />
              </g>
            ))
          : tickets.map((t) => {
              const xs = t.bounce ? BOUNCE_XS : XS;
              const n = xs.length;
              return (
                <motion.g
                  key={t.id}
                  initial={{ x: xs[0], y: 0, opacity: 1 }}
                  animate={{
                    x: xs,
                    y: t.bounce ? [0, 0, 0, 0, 0, -16, 0, 0] : 0,
                    opacity: xs.map((_, i) => (i === n - 1 ? 0 : 1)),
                  }}
                  transition={{ duration: (n - 1) * HOP, ease: "easeInOut" }}
                  onAnimationComplete={() => finish(t)}
                >
                  <TicketShape />
                </motion.g>
              );
            })}
      </svg>

      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
        <span>
          <b className="font-semibold text-ink">{reduce ? 128 : deployed}</b> deployed
        </span>
        <span>
          <b className="font-semibold text-ink">{reduce ? 31 : bounced}</b> sent back at review
        </span>
      </div>
      <p className="mt-2 text-xs text-muted">
        Every ticket writes a failing test before any code. Every fourth one is sent back at review.
      </p>
    </div>
  );
}
