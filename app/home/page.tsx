import Image from "next/image";
import {
  SectionBody,
  SectionSubtitle,
  SectionTitle,
} from "@/components/SectionCopy";
import {
  HOME_CLOSING_MEDIA,
  HOME_CLOSING_ROCKET,
  HOME_CLOSING_TITLE,
  HOME_SECTIONS,
} from "@/lib/home";

export const metadata = {
  title: "Home",
  description:
    "Precision in motion. High-end 3D animation where engineering meets visual excellence.",
};

export default function HomePage() {
  const rocketScale = 0.88;
  const rocketLeft = `calc(-${rocketScale} * ${HOME_CLOSING_MEDIA.height} / ${HOME_CLOSING_MEDIA.width} * ${HOME_CLOSING_ROCKET.slotLeft} / ${HOME_CLOSING_ROCKET.height} * 100%)`;
  const rocketBottom = `calc(-${rocketScale} * (${HOME_CLOSING_ROCKET.height} - ${HOME_CLOSING_ROCKET.slotBottom}) / ${HOME_CLOSING_ROCKET.height} * 100%)`;

  return (
    <div className="home-canvas relative">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-20 px-4 py-14 sm:px-6 sm:py-16 lg:gap-28 lg:py-20">
        {HOME_SECTIONS.map((section, index) => {
          const media = (
            <Image
              src={section.media.src}
              alt={section.media.alt}
              width={section.media.width}
              height={section.media.height}
              priority={index === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full"
            />
          );

          const copy = (
            <div>
              <SectionTitle as={section.id === "precision" ? "h1" : "h2"}>
                {section.title}
              </SectionTitle>
              <SectionSubtitle>{section.subtitle}</SectionSubtitle>
              <SectionBody>{section.body}</SectionBody>
            </div>
          );

          return (
            <section
              key={section.id}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div className={section.mediaSide === "left" ? "lg:order-2" : ""}>
                {copy}
              </div>
              <div
                className={section.mediaSide === "left" ? "lg:order-1" : ""}
                data-home-media={section.id}
              >
                {media}
              </div>
            </section>
          );
        })}
      </div>

      <section className="relative pb-32 sm:pb-36">
        <h2 className="mx-auto max-w-[1120px] px-4 text-center font-heading text-[1.85rem] font-bold tracking-tight sm:px-6 sm:text-[2.35rem] lg:text-[2.65rem]">
          {HOME_CLOSING_TITLE}
        </h2>
        <div className="relative mx-auto mt-10 max-w-[1120px] px-7 sm:px-9">
          <div className="relative">
            <Image
              src={HOME_CLOSING_MEDIA.src}
              alt={HOME_CLOSING_MEDIA.alt}
              width={HOME_CLOSING_MEDIA.width}
              height={HOME_CLOSING_MEDIA.height}
              sizes="(min-width: 1024px) 1120px, 100vw"
              className="home-closing-photo relative z-10 h-auto w-full"
            />
            <Image
              src={HOME_CLOSING_ROCKET.src}
              alt=""
              width={HOME_CLOSING_ROCKET.width}
              height={HOME_CLOSING_ROCKET.height}
              sizes="40vw"
              aria-hidden="true"
              className="pointer-events-none absolute z-20 h-[88%] w-auto max-w-none"
              style={{ left: rocketLeft, bottom: rocketBottom }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
