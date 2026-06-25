export interface GameLevel {
  id: number;
  imageUrl?: string;
  imageAlt: string;
  hint: string;
  target: {
    xPercent: number;
    yPercent: number;
    radiusPercent: number;
  };
  successMessage: string;
  bgColor: string;
}

export const gameLevels: GameLevel[] = [
  {
    id: 1,
    imageAlt: "Level 1 - Kitchen Scene",
    hint: "Mommy loves the kitchen…",
    target: { xPercent: 65, yPercent: 40, radiusPercent: 12 },
    successMessage: "Yay! You found Mommy! 🌸",
    bgColor: "#FDF6EC",
  },
  {
    id: 2,
    imageAlt: "Level 2 - Living Room",
    hint: "Where does Mommy love to relax?",
    target: { xPercent: 45, yPercent: 55, radiusPercent: 12 },
    successMessage: "There she is! 💕",
    bgColor: "#F7C5CC40",
  },
  {
    id: 3,
    imageAlt: "Level 3 - Garden",
    hint: "Mommy loves flowers…",
    target: { xPercent: 30, yPercent: 50, radiusPercent: 12 },
    successMessage: "Found her in the garden! 🌺",
    bgColor: "#C9B8D840",
  },
  {
    id: 4,
    imageAlt: "Level 4 - Market",
    hint: "Mommy is always finding the best deals!",
    target: { xPercent: 70, yPercent: 45, radiusPercent: 12 },
    successMessage: "Aha! Smart shopper Mommy! 🛍️",
    bgColor: "#FFBE8840",
  },
  {
    id: 5,
    imageAlt: "Level 5 - Library",
    hint: "Where would the smartest person be?",
    target: { xPercent: 55, yPercent: 35, radiusPercent: 12 },
    successMessage: "Reading again! 📚",
    bgColor: "#F5EDD8",
  },
  {
    id: 6,
    imageAlt: "Level 6 - Beach",
    hint: "Mommy loves the waves…",
    target: { xPercent: 40, yPercent: 60, radiusPercent: 12 },
    successMessage: "Sun and fun Mommy! 🌊",
    bgColor: "#C9B8D850",
  },
  {
    id: 7,
    imageAlt: "Level 7 - Mall",
    hint: "Shopping? Or just window shopping?",
    target: { xPercent: 60, yPercent: 50, radiusPercent: 12 },
    successMessage: "Of course she's here! 👜",
    bgColor: "#F7C5CC50",
  },
  {
    id: 8,
    imageAlt: "Level 8 - Church",
    hint: "Mommy's favorite place on Sunday…",
    target: { xPercent: 50, yPercent: 40, radiusPercent: 12 },
    successMessage: "Amen! Found her! 🙏",
    bgColor: "#FDF6EC",
  },
  {
    id: 9,
    imageAlt: "Level 9 - Sofa",
    hint: "Maybe she's resting?",
    target: { xPercent: 50, yPercent: 65, radiusPercent: 14 },
    successMessage: "Napping time! 😄",
    bgColor: "#FFBE8830",
  },
  {
    id: 10,
    imageAlt: "Level 10 - Home",
    hint: "The most important place of all…",
    target: { xPercent: 50, yPercent: 50, radiusPercent: 15 },
    successMessage: "She was home all along. 🏡❤️",
    bgColor: "#F7C5CC30",
  },
];
