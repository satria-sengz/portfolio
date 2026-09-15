import { site } from "@/content/site";

const links: Array<[string, string]> = [
  ["#story", "Story"],
  ["#work", "How it works"],
  ["#skills", "Skills"],
  ["#experience", "Experience"],
  ["#contact", "Contact"],
];

export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur">
      <div className="spine">
        <div className="spine-inner flex h-14 items-center justify-between gap-4">
          <a href="#top" className="display text-lg font-semibold">
            Satria Putra
          </a>
          <nav aria-label="Sections" className="hidden gap-6 text-sm text-muted md:flex">
            {links.map(([href, label]) => (
              <a key={href} href={href} className="hover:text-ink">
                {label}
              </a>
            ))}
          </nav>
          <a href={site.links.cv} download className="btn btn-quiet py-1.5 text-sm">
            Download CV
          </a>
        </div>
      </div>
    </header>
  );
}
