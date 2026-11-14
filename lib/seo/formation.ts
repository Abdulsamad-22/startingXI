export type FormationGuide = {
  slug: string;
  name: string;
  formatSize: number;
  intro: string;
  shape: string;
  roles: { position: string; job: string }[];
  strengths: string[];
  weaknesses: string[];
  bestFor: string;
};

export const FORMATION_GUIDES: FormationGuide[] = [
  {
    slug: "4-3-3",
    name: "4-3-3",
    formatSize: 11,
    intro:
      "The 4-3-3 is a front-foot formation: four defenders, three midfielders and three forwards. It is built around width in attack and a compact midfield.",
    shape:
      "A goalkeeper, a back four (two centre-backs and two full-backs), three central midfielders, and a front three of two wide forwards and a centre-forward.",
    roles: [
      {
        position: "Full-backs",
        job: "Provide width and overlap the wingers when you attack.",
      },
      {
        position: "Holding midfielder",
        job: "Sits in front of the defence, breaks up play and starts attacks.",
      },
      {
        position: "Wide forwards",
        job: "Stretch the pitch, take on full-backs and cut inside or cross.",
      },
      {
        position: "Centre-forward",
        job: "Leads the line, holds the ball up and finishes chances.",
      },
    ],
    strengths: [
      "Strong attacking width and a natural passing triangle in midfield",
      "Three forwards press high and keep the opposition back line busy",
    ],
    weaknesses: [
      "Space can open behind attacking full-backs",
      "Needs hard-working midfielders to cover the whole pitch",
    ],
    bestFor:
      "Teams with quick wingers and a mobile midfield who want to control possession.",
  },
  // add 4-4-2, 4-2-3-1, 3-5-2 ... each with its own genuine content
];
