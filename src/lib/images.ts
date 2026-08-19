export type PexelsImage = {
  src: string;
  alt: string;
  creditUrl: string;
};

/** All Pexels assets — local copies in /public/images */
export const PEXELS_IMAGES: PexelsImage[] = [
  {
    src: "/images/abstract-art.jpg",
    alt: "A 3D rendering of abstract art",
    creditUrl: "https://www.pexels.com/photo/a-3d-rendering-of-an-abstract-art-13026928/",
  },
  {
    src: "/images/geometry-orange.jpg",
    alt: "Geometry room in orange light",
    creditUrl: "https://www.pexels.com/photo/geometry-room-in-orange-light-12627678/",
  },
  {
    src: "/images/golden-pipes.jpg",
    alt: "Golden pipes in a room",
    creditUrl: "https://www.pexels.com/photo/golden-pipes-in-a-room-12623749/",
  },
  {
    src: "/images/red-purple-pyramid.jpg",
    alt: "Vivid abstract red and purple pyramid render",
    creditUrl: "https://www.pexels.com/photo/vivid-abstract-red-and-purple-pyramid-render-29751269/",
  },
  {
    src: "/images/red-geometric.jpg",
    alt: "Red light on transparent geometric shape in dark",
    creditUrl: "https://www.pexels.com/photo/red-light-on-transparent-geometric-shape-in-dark-16264087/",
  },
  {
    src: "/images/colorful-geometric.jpg",
    alt: "Colorful abstract geometric art with gradient",
    creditUrl: "https://www.pexels.com/photo/colorful-abstract-geometric-art-with-gradient-28551568/",
  },
  {
    src: "/images/abstract-modern.jpg",
    alt: "Abstract art modern render",
    creditUrl: "https://www.pexels.com/photo/abstract-art-modern-render-12627677/",
  },
  {
    src: "/images/golden-construction.jpg",
    alt: "Golden construction in a building",
    creditUrl: "https://www.pexels.com/photo/golden-construction-in-a-building-12623752/",
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

function assignSectionImages(
  parallaxCount: number,
  galleryCount: number,
  seed: number
): { parallax: PexelsImage[]; gallery: PexelsImage[] } {
  const shuffled = shuffleImages(PEXELS_IMAGES, seed);
  const parallax = shuffled.slice(0, parallaxCount);
  const remainder = shuffled.slice(parallaxCount);
  const extras = shuffleImages(PEXELS_IMAGES, seed + 99).slice(
    0,
    galleryCount - remainder.length
  );

  return { parallax, gallery: [...remainder, ...extras] };
}

const { parallax, gallery } = assignSectionImages(3, 6, 13026928);

export const PARALLAX_IMAGES = parallax;
export const GALLERY_IMAGES = gallery;
