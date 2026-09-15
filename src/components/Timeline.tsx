"use client";

import { useRef } from "react";
import { useInView } from "motion/react";

type Entry = { when: string; text: string };

function Item({ when, text }: Entry) {
  const ref = useRef<HTMLLIElement>(null);
  const on = useInView(ref, { once: true, margin: "0px 0px -35% 0px" });
  return (
    <li ref={ref} className="relative mb-10 last:mb-0">
      <span className="rail-node" data-on={on ? "true" : "false"} aria-hidden="true" />
      <p className="display text-xl font-semibold">{when}</p>
      <p className="measure mt-1">{text}</p>
    </li>
  );
}

export function Timeline({ entries }: { entries: Entry[] }) {
  return (
    <ol className="m-0 list-none p-0">
      {entries.map((e) => (
        <Item key={e.when} {...e} />
      ))}
    </ol>
  );
}
