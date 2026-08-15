// Arcade pixel type — the colourways and the numbers that define the effect.
// Ported for the changelog splash; textures are generated procedurally (see
// textures.ts) instead of loaded from external plates, so this stays
// dependency-free.

export type Colorway = {
  name: string;
  /** The ground the word is burnt into. */
  ground: [number, number, number];
  /** The dark ink. A hair off pure black keeps it from reading as flat. */
  ink: [number, number, number];
  /** The light face of the letters. */
  paper: [number, number, number];
  /** Tint of the coloured speckle along the quantised edges. */
  fringe: [number, number, number];
};

export const COLORWAYS: Colorway[] = [
  {
    name: "Arcade Red",
    ground: [0.922, 0.031, 0.035],
    ink: [0.02, 0.024, 0.02],
    paper: [1, 1, 1],
    fringe: [0.35, 1, 0.9],
  },
  {
    name: "Acid",
    ground: [0.804, 1, 0.05],
    ink: [0.04, 0.06, 0.02],
    paper: [1, 1, 0.96],
    fringe: [1, 0.2, 0.75],
  },
  {
    name: "Cyanide",
    ground: [0.04, 0.85, 0.92],
    ink: [0.01, 0.05, 0.08],
    paper: [0.96, 1, 1],
    fringe: [1, 0.35, 0.2],
  },
  {
    name: "Monochrome",
    ground: [0.9, 0.89, 0.87],
    ink: [0.04, 0.04, 0.05],
    paper: [1, 1, 1],
    fringe: [0.5, 0.55, 0.6],
  },
  {
    name: "Ultraviolet",
    ground: [0.36, 0.05, 0.85],
    ink: [0.03, 0.01, 0.08],
    paper: [0.95, 0.92, 1],
    fringe: [1, 0.85, 0.2],
  },
  {
    name: "Ember",
    ground: [1, 0.42, 0.02],
    ink: [0.08, 0.02, 0.0],
    paper: [1, 0.97, 0.9],
    fringe: [0.2, 0.7, 1],
  },
  {
    // Cyanide, pushed down into a dark charcoal-teal — for running the field
    // continuously behind real content instead of as a one-shot bright
    // reveal. Keeps real contrast between ground/ink/paper so the letterform
    // and grain stay visible; ArcadeBackground's own `opacity` prop is what
    // actually recedes this into the page — pushing the colors themselves
    // this dark washes out the texture entirely instead of just dimming it.
    name: "Cyanide Dark",
    ground: [0.06, 0.22, 0.24],
    ink: [0.01, 0.03, 0.04],
    paper: [0.55, 0.78, 0.8],
    fringe: [0.4, 0.6, 0.62],
  },
];

export interface ArcadeParams {
  word: string;
  /** Where the quantised edge lands, 0..1. */
  threshold: number;
  /** Cells across the low-res grid — the block size. */
  cols: number;
  /** White halo width, in cells. */
  halo: number;
  /** Black keyline width, in cells. */
  keyline: number;
  /** How far the black keyline is pushed, in cells, as [dx, dy]. */
  keylineOffset: [number, number];
  italic: boolean;
  /** Surface strength (moire/grain/dust), scaling all three plates together. */
  texture: number;
  /** The drop shadow follows the pointer. */
  magnet: boolean;
  magnetReach: number;
  parallax: number;
  pull: number;
  swim: number;
  separation: number;
  colorway: number;
}

export const DEFAULTS: ArcadeParams = {
  word: "changelog",
  threshold: 0.588,
  cols: 150,
  halo: 3,
  keyline: 3,
  keylineOffset: [1, 1],
  italic: true,
  texture: 0.25,
  magnet: true,
  magnetReach: 1,
  swim: 1,
  parallax: 0.009,
  pull: 0.016,
  separation: 1,
  colorway: 2, // Cyanide — closest of the set to this site's own blue accent.
};

export const TEXTURE_ANGLE = 80.5;
export const TEXTURE_PERIOD = 0.0065;

export const LEVELS_IN = [5 / 255, 230 / 255] as const;
export const VIBRANCE = 0.2;

// This site's own heaviest shipped weight, not the original's Neue Montreal —
// the effect needs fat letters, a thin stroke doesn't survive quantisation.
export const FONT_CSS = "var(--font-geist), system-ui, sans-serif";
export const FONT_WEIGHT = 700;
