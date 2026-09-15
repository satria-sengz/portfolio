import { skills } from "@/content/site";

export function Skills() {
  return (
    <dl className="divide-y divide-line border-y border-line">
      {skills.map((s) => (
        <div key={s.group} className="grid gap-1 py-4 md:grid-cols-[180px_1fr] md:gap-6">
          <dt className="font-semibold">{s.group}</dt>
          <dd className="measure text-[0.95rem] text-ink/90">{s.items}</dd>
        </div>
      ))}
    </dl>
  );
}
