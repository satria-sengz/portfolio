import { concepts, timeline } from "@/content/site";
import { Rail } from "@/components/Rail";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Section } from "@/components/Section";
import { Timeline } from "@/components/Timeline";
import { ConceptBlock } from "@/components/ConceptBlock";
import { ReceiptOCR } from "@/components/concepts/ReceiptOCR";
import { AgentPipeline } from "@/components/concepts/AgentPipeline";
import { GoMigration } from "@/components/concepts/GoMigration";
import { FraudLayers } from "@/components/concepts/FraudLayers";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";

const byId = Object.fromEntries(concepts.map((c) => [c.id, c]));

export default function Home() {
  return (
    <>
      <Rail />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Stats />
        <Section
          id="story"
          title="How I got here with AI"
          lede="Ten months, in order. Each step changed how the next one was done."
        >
          <Timeline entries={timeline} />
        </Section>
        <Section
          id="work"
          title="How it works"
          lede="Four systems from the CV, explained the way I would on a whiteboard. Press the buttons; nothing is sent anywhere."
        >
          <ConceptBlock c={byId.ocr}>
            <ReceiptOCR />
          </ConceptBlock>
          <ConceptBlock c={byId.pipeline}>
            <AgentPipeline />
          </ConceptBlock>
          <ConceptBlock c={byId.go}>
            <GoMigration />
          </ConceptBlock>
          <ConceptBlock c={byId.fraud}>
            <FraudLayers />
          </ConceptBlock>
        </Section>
        <Section id="skills" title="What I work with">
          <Skills />
        </Section>
        <Section id="experience" title="Where I have worked">
          <Experience />
        </Section>
        <Footer />
      </main>
    </>
  );
}
