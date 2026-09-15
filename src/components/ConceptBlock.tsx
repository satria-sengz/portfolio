import type { ReactNode } from "react";
import type { Concept } from "@/content/site";

export function ConceptBlock({ c, children }: { c: Concept; children: ReactNode }) {
  return (
    <article id={c.id} className="relative mb-20 scroll-mt-20 last:mb-0">
      <span className="rail-node" data-on="true" aria-hidden="true" />
      <h3 className="display text-2xl font-semibold tracking-tight md:text-[1.75rem]">{c.title}</h3>
      <p className="measure mt-3 text-muted">{c.tldr}</p>
      <div className="mt-8">{children}</div>
      <details className="howto mt-8">
        <summary>
          <span className="caret" aria-hidden="true" />
          How it works, step by step
        </summary>
        <div className="grid gap-8 pb-6 md:grid-cols-[1.4fr_1fr]">
          <ol className="measure list-decimal space-y-3 pl-5">
            {c.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <div className="space-y-6 text-[0.95rem]">
            <div>
              <p className="font-semibold">Decisions</p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                {c.decisions.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold">What broke</p>
              <p className="mt-2">{c.broke}</p>
            </div>
            <div>
              <p className="font-semibold">Stack</p>
              <p className="mt-2 text-muted">{c.stack.join(", ")}</p>
            </div>
            <div>
              <p className="font-semibold">My part</p>
              <p className="mt-2 text-muted">{c.role}</p>
            </div>
          </div>
        </div>
      </details>
    </article>
  );
}
