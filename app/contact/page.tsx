import Image from "next/image";
import { ContactForm } from "@/components/ContactForm";
import { SectionSubtitle, SectionTitle } from "@/components/SectionCopy";
import { SiteQrCode } from "@/components/SiteQrCode";
import { SocialLinks } from "@/components/SocialLinks";
import { CONTACT_HERO } from "@/lib/contact";

export const metadata = {
  title: "Contact Us",
  description: CONTACT_HERO.subtitle,
};

export default function ContactPage() {
  const { title, subtitle, heading, note, media } = CONTACT_HERO;

  return (
    <div className="home-canvas relative lg:flex lg:flex-1 lg:items-center">
      <div className="mx-auto w-full max-w-[1120px] px-4 py-14 sm:px-6 sm:py-16 lg:py-10">
        <section className="grid grid-cols-1 gap-x-12 [grid-template-areas:'title'_'subtitle'_'media'_'heading'_'form'_'note'] lg:grid-cols-2 lg:[grid-template-areas:'title_._'_'subtitle_heading'_'media_form'_'._note']">
          <div className="[grid-area:title]">
            <SectionTitle as="h1" className="mb-[1lh]">
              {title}
            </SectionTitle>
          </div>
          <div className="[grid-area:subtitle]">
            <SectionSubtitle>{subtitle}</SectionSubtitle>
          </div>
          <h2 className="[grid-area:heading] mt-10 font-heading text-lg font-semibold tracking-tight sm:text-xl lg:mt-4">
            {heading}
          </h2>
          <div className="relative flex min-w-0 flex-col [grid-area:media]">
            <Image
              src={media.src}
              alt={media.alt}
              width={media.width}
              height={media.height}
              priority
              sizes="(min-width: 1024px) 416px, 100vw"
              className="mx-auto mt-8 h-auto w-[min(100%,26rem)] mix-blend-screen"
            />
            <div className="absolute inset-x-0 bottom-0 hidden items-end justify-between lg:flex">
              <SiteQrCode />
              <SocialLinks />
            </div>
          </div>
          <div className="min-w-0 [grid-area:form]">
            <div className="mt-5">
              <ContactForm />
            </div>
          </div>
          <div className="[grid-area:note]">
            <p className="mt-3 text-sm italic text-muted">{note}</p>
            <SocialLinks className="mt-4 lg:hidden" />
          </div>
        </section>
      </div>
    </div>
  );
}
