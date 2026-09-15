import type { ReactNode } from "react";

export function Section({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="spine scroll-mt-16 py-16 md:py-24">
      <div className="spine-inner relative">
        <span
          aria-hidden="true"
          className="absolute h-5 w-5 rounded-full bg-ink"
          style={{ left: "calc(-1 * var(--gutter) - 9px)", top: "0.45em" }}
        />
        <h2 className="display text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
        {lede ? <p className="measure mt-3 text-muted">{lede}</p> : null}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
