export type PexelsImage = {
  src: string;
  alt: string;
  creditUrl: string;
};

/** Pexels assets — local copies in /public/images */
export const PEXELS_IMAGES: PexelsImage[] = [
  {
    src: "/images/pink-waves.jpg",
    alt: "Abstract pink waves in minimalist composition",
    creditUrl:
      "https://www.pexels.com/photo/abstract-pink-waves-in-minimalist-composition-31216387/",
  },
  {
    src: "/images/orange-sculpture.jpg",
    alt: "Abstract orange sculptural form on gradient background",
    creditUrl:
      "https://www.pexels.com/photo/abstract-orange-sculptural-form-on-gradient-background-36025195/",
  },
  {
    src: "/images/violet-pink-geometric.jpg",
    alt: "Abstract violet and pink 3D geometric art",
    creditUrl:
      "https://www.pexels.com/photo/abstract-violet-and-pink-3d-geometric-art-36025199/",
  },
  {
    src: "/images/green-waves.jpg",
    alt: "Abstract green wave pattern with smooth curves",
    creditUrl:
      "https://www.pexels.com/photo/abstract-green-wave-pattern-with-smooth-curves-31216390/",
  },
  {
    src: "/images/floral-sphere.jpg",
    alt: "Abstract 3D floral sphere on pastel background",
    creditUrl:
      "https://www.pexels.com/photo/abstract-3d-floral-sphere-on-pastel-background-34268916/",
  },
  {
    src: "/images/orange-paper.jpg",
    alt: "Orange paper cutouts on orange surface",
    creditUrl:
      "https://www.pexels.com/photo/orange-paper-cutouts-on-orange-surface-12966861/",
  },
];

function shuffleImages(images: PexelsImage[], seed: number): PexelsImage[] {
  const result = [...images];
  let s = seed;

  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function pickImages(count: number, seed: number): PexelsImage[] {
  const result: PexelsImage[] = [];
  let round = 0;

  while (result.length < count) {
    result.push(...shuffleImages(PEXELS_IMAGES, seed + round * 97));
    round++;
  }

  return result.slice(0, count);
}

export const PARALLAX_IMAGES = pickImages(3, 31216387);
export const GALLERY_IMAGES = pickImages(6, 31216387 + 500);
