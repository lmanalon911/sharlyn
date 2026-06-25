export interface StorybookSpread {
  id: number;
  // When spreadImage is set, one photo spans both pages as a continuous spread
  spreadImage?: string;
  leftPage: {
    type: "image" | "text";
    imageUrl?: string;
    text?: string;
    caption?: string;
  };
  rightPage: {
    type: "image" | "text";
    imageUrl?: string;
    text?: string;
    caption?: string;
  };
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

export const storybookSpreads: StorybookSpread[] = [
  {
    id: 1,
    leftPage: {
      type: "image",
      caption: "[A photo of Daddy and Mommy when they first met]",
    },
    rightPage: {
      type: "text",
      text: "Before I came along, Daddy and Mommy were just two people in a very big world. But I like to think the universe was already working on something special.",
    },
  },
  {
    id: 2,
    leftPage: {
      type: "text",
      text: "Mommy tells me Daddy made her laugh a lot. Daddy tells me Mommy made everything feel warmer. I think they're both right.",
    },
    rightPage: {
      type: "image",
      caption: "[A happy photo of Mommy]",
    },
  },
  {
    id: 3,
    leftPage: {
      type: "image",
      caption: "[A fun photo of Daddy]",
    },
    rightPage: {
      type: "text",
      text: "Daddy isn't always cool, but Mommy thinks he is. And that's the most important thing.",
    },
  },
  {
    id: 4,
    leftPage: {
      type: "text",
      text: "They went on adventures together. Small ones. Big ones. The kind that don't feel like adventures until you look back and realize — that was everything.",
    },
    rightPage: {
      type: "image",
      caption: "[A travel or adventure photo]",
    },
  },
  {
    id: 5,
    leftPage: {
      type: "image",
      caption: "[A cozy home photo]",
    },
    rightPage: {
      type: "text",
      text: "They built a home together. Not just a house — a home. The kind that smells like food and sounds like laughter and always feels safe.",
    },
  },
  {
    id: 6,
    leftPage: {
      type: "text",
      text: "And somewhere in all of that love… I started to exist. First as a dream. Then as a hope. Then as me!",
    },
    rightPage: {
      type: "image",
      caption: "[Baby photo or ultrasound]",
    },
  },
  {
    id: 7,
    leftPage: {
      type: "image",
      caption: "[A sweet family photo]",
    },
    rightPage: {
      type: "text",
      text: "I didn't get to see the days before me. But from everything I know — they were already beautiful. Because they led to me. And to us.",
    },
  },
  {
    id: 8,
    leftPage: {
      type: "text",
      text: "Mommy, I know I can be loud. And messy. And sometimes I ask too many questions. But I learned all of that from watching you love fearlessly.",
    },
    rightPage: {
      type: "image",
      caption: "[Photo of Mommy and Sofiel together]",
    },
  },
  {
    id: 9,
    leftPage: {
      type: "image",
      caption: "[A family photo, all three together]",
    },
    rightPage: {
      type: "text",
      text: "The three of us are the best story ever told. And we're still only at the beginning.",
    },
  },
  {
    id: 10,
    leftPage: {
      type: "text",
      text: "Things I Know For Sure:",
    },
    rightPage: {
      type: "text",
      text: "✦ Mommy is the prettiest mommy in the whole world.\n✦ Daddy says I can't have a boyfriend until I'm 44.\n✦ I was always their biggest dream.\n\n— The End (for now) —",
    },
  },
];
