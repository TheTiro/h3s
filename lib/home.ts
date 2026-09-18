export const HOME_SECTIONS = [
  {
    id: "precision",
    title: "Precision\nin motion",
    subtitle: "Where engineering meets visual excellence.",
    body: [
      "Explore the complexity of ammunition and weapons assembly through high-end 3D animation.",
      "Every component, mechanism, and movement is brought to life with exceptional detail, transforming technical precision into an engaging visual experience.",
    ],
    media: {
      src: "/images/home/artillery.webp",
      alt: "Artillery assembly visualisation with wireframe overlay",
      width: 640,
      height: 443,
    },
    mediaSide: "right" as const,
  },
  {
    id: "engineering",
    title: "Engineering\nbeyond limits",
    subtitle: "A new dimension of technical visualisation.",
    body: [
      "Our 3D animations reveal the sophisticated engineering behind ammunition and weapons systems.",
      "From individual components to complete assembly sequences, every detail is visualised with clarity, accuracy, and cinematic impact.",
    ],
    media: {
      src: "/images/home/pistol.webp",
      alt: "Pistol wireframe visualisation",
      width: 640,
      height: 428,
    },
    mediaSide: "left" as const,
  },
  {
    id: "designed",
    title: "Designed\nto perform",
    subtitle: "Precision. Innovation. Performance.",
    body: [
      "Experience advanced 3D animation that showcases the design, engineering, and assembly of ammunition and weapons systems.",
      "A powerful combination of technical expertise and visual storytelling, created to communicate complex technology with remarkable clarity.",
    ],
    media: {
      src: "/images/home/uav.webp",
      alt: "UAV drone visualisation with wireframe overlay",
      width: 640,
      height: 479,
    },
    mediaSide: "right" as const,
  },
] as const;

export const HOME_CLOSING_TITLE = "Technology brought to life";
export const HOME_CLOSING_MEDIA = {
  src: "/images/home/ammunition.webp",
  alt: "Ammunition and rocket visualisations",
  width: 1024,
  height: 490,
} as const;

export const HOME_CLOSING_ROCKET = {
  src: "/images/home/rocket.webp",
  alt: "",
  width: 290,
  height: 596,
  /** Left edge of the lighter slot the photo corner fits into. */
  slotLeft: 169,
  /** Bottom edge of that slot, from the top of the rocket asset. */
  slotBottom: 486,
} as const;
