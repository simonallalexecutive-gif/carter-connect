// Unified palette for activity pie charts across all candidate registration panels.
// Order matters: panels assign segments by index into this list, with a safe rotation.
//
// Colors requested by product: ivoire, noir, gris foncé, gris clair, bleu clair,
// bleu foncé, taupe, beige. No greens, no oranges.
export const ACTIVITY_CHART_PALETTE = [
  'hsl(0, 0%, 8%)',        // 0 Noir
  'hsl(220, 45%, 22%)',    // 1 Bleu foncé (nuit)
  'hsl(0, 0%, 32%)',       // 2 Gris foncé
  'hsl(30, 12%, 50%)',     // 3 Taupe
  'hsl(210, 35%, 58%)',    // 4 Bleu clair
  'hsl(35, 22%, 72%)',     // 5 Beige
  'hsl(0, 0%, 78%)',       // 6 Gris clair
  'hsl(40, 28%, 90%)',     // 7 Ivoire
];

// Neutral color reserved for SquareGauge fills.
// Intentionally OUTSIDE the chart palette so gauges remain visually
// dissociated from pie chart segments.
export const GAUGE_NEUTRAL = 'hsl(220, 8%, 38%)';

// Helper to pick a color by index (rotates on overflow).
export const paletteColor = (i: number) =>
  ACTIVITY_CHART_PALETTE[i % ACTIVITY_CHART_PALETTE.length];
