import Image from "next/image";
import {
  SectionBody,
  SectionSubtitle,
  SectionTitle,
} from "@/components/SectionCopy";
import { VISUALISATIONS_HERO } from "@/lib/visualisations";

export const metadata = {
  title: "Visualisations",
  description: VISUALISATIONS_HERO.subtitle,
};

export default function VisualisationsPage() {
  const { title, subtitle, body, media } = VISUALISATIONS_HERO;

  return (
    <div className="home-canvas relative lg:flex lg:flex-1 lg:items-center">
      <div className="mx-auto w-full max-w-[1120px] px-4 py-14 sm:px-6 sm:py-16 lg:py-10">
        <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,22.5rem)_minmax(0,1fr)] lg:gap-4">
          <div>
            <SectionTitle as="h1">{title}</SectionTitle>
            <SectionSubtitle>{subtitle}</SectionSubtitle>
            <SectionBody>{body}</SectionBody>
          </div>
          <div className="relative min-w-0">
            <Image
              src={media.src}
              alt={media.alt}
              width={media.width}
              height={media.height}
              priority
              sizes="(min-width: 1024px) 720px, 100vw"
              className="h-auto w-full mix-blend-screen"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
