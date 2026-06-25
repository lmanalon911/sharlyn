export interface StorybookSpread {
  id: number;
  // One image spanning both pages (2:1 landscape, e.g. 2000×1000px)
  spreadImage?: string;
}

export interface IntroSlide {
  id: number;
  imageUrl?: string;
  heading: string;
  body: string;
}

export const introSlides: IntroSlide[] = [
  {
    id: 1,
    heading: "Once upon a time…",
    body: "There was a woman so wonderful, the universe decided she needed her own story.",
  },
  {
    id: 2,
    heading: "Her name was Sharlyn.",
    body: "And before she was Mommy, she was already magic.",
  },
  {
    id: 3,
    heading: "She laughed the loudest.",
    body: "She loved the deepest. And she made everyone around her feel at home.",
  },
  {
    id: 4,
    heading: "Then one day…",
    body: "She met someone. And everything changed — in the best possible way.",
  },
  {
    id: 5,
    heading: "But wait…",
    body: "There's a little someone who wants to tell you the rest of this story herself.",
  },
];

const BASE = "https://ayvgxtdwylgpsjkpiulc.supabase.co/storage/v1/object/public/Media";

export const storybookSpreads: StorybookSpread[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  spreadImage: `${BASE}/${i + 1}.png`,
}));
