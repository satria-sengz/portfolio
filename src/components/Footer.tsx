import { site } from "@/content/site";

export function Footer() {
  const { links } = site;
  return (
    <footer id="contact" className="spine scroll-mt-16 py-16 md:py-24">
      <div className="spine-inner relative">
        <span
          aria-hidden="true"
          className="absolute h-5 w-5 rounded-full bg-ink"
          style={{ left: "calc(-1 * var(--gutter) - 9px)", top: "0.45em" }}
        />
        <h2 className="display text-3xl font-semibold tracking-tight md:text-4xl">Get in touch</h2>
        <p className="measure mt-3 text-muted">
          If you are hiring for a role where the delivery pipeline is part of the product, I would like to hear
          about it. Email is fastest.
        </p>
        <a
          href={`mailto:${links.email}`}
          className="display mt-6 inline-block text-2xl font-semibold underline decoration-ticket decoration-4 underline-offset-4 md:text-3xl"
        >
          {links.email}
        </a>
        <div className="mt-8 flex flex-wrap gap-3">
          <a className="btn btn-quiet" href={links.linkedin} rel="me">
            LinkedIn
          </a>
          <a className="btn btn-quiet" href={links.github} rel="me">
            GitHub
          </a>
          <a className="btn btn-quiet" href={links.cv} download>
            CV as PDF
          </a>
        </div>
        <p className="mt-16 text-xs text-muted">
          Static site, no tracking. Built with Next.js; the diagrams are plain SVG and the replays run in your
          browser.
        </p>
      </div>
    </footer>
  );
}
