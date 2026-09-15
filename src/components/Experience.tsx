import { experience } from "@/content/site";

export function Experience() {
  return (
    <ol className="m-0 list-none p-0">
      {experience.map((e) => (
        <li key={`${e.role}-${e.dates}`} className="relative mb-10 last:mb-0">
          <span className="rail-node" data-on="true" aria-hidden="true" />
          <div className="flex flex-wrap items-baseline gap-x-3">
            <p className="display text-xl font-semibold">{e.role}</p>
            <p className="text-muted">{e.org}</p>
          </div>
          <p className="text-sm text-muted">{e.dates}</p>
          <ul className="measure mt-3 list-disc space-y-1.5 pl-5 text-[0.95rem]">
            {e.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
