import { stats } from "@/content/site";

export function Stats() {
  return (
    <section className="spine py-8">
      <dl className="spine-inner grid gap-6 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line lg:gap-0">
        {stats.map((s) => (
          <div key={s.label} className="lg:px-6 lg:first:pl-0">
            <dd className="display text-4xl font-semibold tracking-tight">{s.value}</dd>
            <dt className="mt-1 text-sm text-muted">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
