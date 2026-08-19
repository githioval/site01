export type PexelsImage = {
  src: string;
  alt: string;
  creditUrl: string;
};

/** Bright Pexels assets — local copies in /public/images */
export const PEXELS_IMAGES: PexelsImage[] = [
  {
    src: "/images/dome-geometric.jpg",
    alt: "Intricate architectural dome with geometric patterns",
    creditUrl:
      "https://www.pexels.com/photo/intricate-architectural-dome-with-geometric-patterns-37982071/",
  },
  {
    src: "/images/beam-ceiling.jpg",
    alt: "Beam under ceiling in black and white",
    creditUrl:
      "https://www.pexels.com/photo/beam-under-ceiling-in-black-and-white-19176619/",
  },
  {
    src: "/images/orange-sculpture.jpg",
    alt: "Abstract orange sculptural form on gradient background",
    creditUrl:
      "https://www.pexels.com/photo/abstract-orange-sculptural-form-on-gradient-background-36025195/",
  },
  {
    src: "/images/green-fluid.jpg",
    alt: "Abstract green fluid shape on mint background",
    creditUrl:
      "https://www.pexels.com/photo/abstract-green-fluid-shape-on-mint-background-36025194/",
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

/** Pick `count` images from shuffled pool — cycles when count > unique images */
function pickImages(count: number, seed: number): PexelsImage[] {
  const result: PexelsImage[] = [];
  let round = 0;

  while (result.length < count) {
    const batch = shuffleImages(PEXELS_IMAGES, seed + round * 97);
    result.push(...batch);
    round++;
  }

  return result.slice(0, count);
}

export const PARALLAX_IMAGES = pickImages(3, 37982071);
export const GALLERY_IMAGES = pickImages(6, 37982071 + 500);
