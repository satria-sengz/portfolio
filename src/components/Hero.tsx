import { site } from "@/content/site";
import { DeliveryLoop } from "./DeliveryLoop";

export function Hero() {
  const { links } = site;
  return (
    <section id="top" className="spine pt-12 pb-10 md:pt-20 md:pb-14">
      <div className="spine-inner grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photo.jpg" alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
            <p className="text-muted">{site.role}</p>
          </div>
          <h1 className="display mt-4 text-[2.6rem] font-semibold leading-[1.02] tracking-tight md:text-6xl">
            {site.hook}
          </h1>
          <p className="measure mt-6 text-lg">{site.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn" href={links.cv} download>
              Download CV
            </a>
            <a className="btn btn-quiet" href={links.linkedin} rel="me">
              LinkedIn
            </a>
            <a className="btn btn-quiet" href={links.github} rel="me">
              GitHub
            </a>
            <a className="btn btn-quiet" href={`mailto:${links.email}`}>
              Email
            </a>
          </div>
          <p className="mt-6 text-sm text-muted">{site.location}</p>
        </div>
        <DeliveryLoop />
      </div>
    </section>
  );
}
