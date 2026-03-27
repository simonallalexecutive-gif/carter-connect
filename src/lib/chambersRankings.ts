// ══ CHAMBERS RANKINGS DATABASE ══
// Source: Chambers & Partners France 2026 rankings
// Department keys: ma, pe, banque, restructuring, public, arbitrage, social, concurrence, immo, projets
// Band number = ranking tier (1 = highest)

export type ChambersRankings = Record<string, number>; // dept key → band number

export interface ChambersFirmEntry {
  nat: 'FR' | 'US' | 'UK';
  rankings: ChambersRankings;
}

export const CHAMBERS_DEPARTMENTS: { key: string; label: string }[] = [
  { key: 'ma', label: 'Corporate/M&A' },
  { key: 'pe', label: 'Private Equity' },
  { key: 'banque', label: 'Banking & Finance' },
  { key: 'restructuring', label: 'Restructuring/Insolvency' },
  { key: 'public', label: 'Public Law' },
  { key: 'arbitrage', label: 'International Arbitration' },
  { key: 'social', label: 'Employment' },
  { key: 'concurrence', label: 'Competition/European Law' },
  { key: 'immo', label: 'Real Estate' },
  { key: 'projets', label: 'Projects & Energy' },
];

export const CHAMBERS_DB: Record<string, ChambersFirmEntry> = {
  // ── A&O Shearman ──
  'A&O Shearman': {
    nat: 'UK',
    rankings: { ma: 2, pe: 4, banque: 1, restructuring: 5, public: 1, arbitrage: 4, social: 2, concurrence: 4, immo: 2, projets: 4 },
  },
  // ── Ashurst ──
  'Ashurst': {
    nat: 'UK',
    rankings: { banque: 4, restructuring: 5, concurrence: 4, projets: 3 },
  },
  // ── Baker McKenzie ──
  'Baker McKenzie': {
    nat: 'US',
    rankings: { ma: 4, banque: 5, public: 2, social: 3, concurrence: 3, immo: 3 },
  },
  // ── BDGS Associés ──
  'BDGS Associés': {
    nat: 'FR',
    rankings: { ma: 2, restructuring: 4, concurrence: 2 },
  },
  // ── Bredin Prat ──
  'Bredin Prat': {
    nat: 'FR',
    rankings: { ma: 1, pe: 3, banque: 2, restructuring: 2, public: 3, arbitrage: 2, social: 1, concurrence: 1 },
  },
  // ── Cleary Gottlieb Steen & Hamilton ──
  'Cleary Gottlieb Steen & Hamilton': {
    nat: 'US',
    rankings: { ma: 1, arbitrage: 3, concurrence: 2, projets: 3 },
  },
  // ── Clifford Chance ──
  'Clifford Chance': {
    nat: 'UK',
    rankings: { ma: 2, pe: 3, banque: 2, restructuring: 3, public: 1, arbitrage: 2, social: 2, concurrence: 2, immo: 2, projets: 1 },
  },
  // ── Darrois Villey Maillot Brochier ──
  'Darrois Villey Maillot Brochier': {
    nat: 'FR',
    rankings: { ma: 1, restructuring: 4, public: 2, arbitrage: 4, concurrence: 2 },
  },
  // ── De Pardieu Brocas Maffei ──
  'De Pardieu Brocas Maffei': {
    nat: 'FR',
    rankings: { ma: 4, pe: 3, banque: 3, restructuring: 1, immo: 1, social: 4, concurrence: 2 },
  },
  // ── DLA Piper ──
  'DLA Piper': {
    nat: 'UK',
    rankings: { banque: 5, social: 3, arbitrage: 4, immo: 3 },
  },
  // ── Freshfields Bruckhaus Deringer ──
  'Freshfields Bruckhaus Deringer': {
    nat: 'UK',
    rankings: { ma: 2, pe: 2, banque: 2, restructuring: 3, public: 4, arbitrage: 2, social: 2, concurrence: 2 },
  },
  // ── Gibson Dunn & Crutcher ──
  'Gibson Dunn & Crutcher': {
    nat: 'US',
    rankings: { restructuring: 1 },
  },
  // ── Gide Loyrette Nouel ──
  'Gide Loyrette Nouel': {
    nat: 'FR',
    rankings: { ma: 2, banque: 1, public: 1, arbitrage: 3, social: 2, concurrence: 2, immo: 1, projets: 1 },
  },
  // ── Goodwin Procter ──
  'Goodwin Procter': {
    nat: 'US',
    rankings: { pe: 2, banque: 4 },
  },
  // ── Herbert Smith Freehills ──
  'Herbert Smith Freehills': {
    nat: 'UK',
    rankings: { ma: 4, banque: 3, arbitrage: 4, concurrence: 3, projets: 1 },
  },
  // ── Hogan Lovells ──
  'Hogan Lovells': {
    nat: 'US',
    rankings: { ma: 4, pe: 3, banque: 2, restructuring: 2, arbitrage: 4, social: 4, concurrence: 4, projets: 2 },
  },
  // ── Jones Day ──
  'Jones Day': {
    nat: 'US',
    rankings: { ma: 4, banque: 4, restructuring: 5, public: 1, arbitrage: 3, social: 5, concurrence: 4, immo: 4, projets: 4 },
  },
  // ── King & Spalding ──
  'King & Spalding': {
    nat: 'US',
    rankings: { banque: 5, arbitrage: 3 },
  },
  // ── Kirkland & Ellis ──
  'Kirkland & Ellis': {
    nat: 'US',
    rankings: { pe: 2 },
  },
  // ── Latham & Watkins ──
  'Latham & Watkins': {
    nat: 'US',
    rankings: { ma: 3, pe: 1, banque: 1, restructuring: 2, social: 5, concurrence: 1 },
  },
  // ── Linklaters ──
  'Linklaters': {
    nat: 'UK',
    rankings: { ma: 3, pe: 3, banque: 2, restructuring: 2, public: 4, arbitrage: 4, concurrence: 1, immo: 3, projets: 1 },
  },
  // ── Mayer Brown ──
  'Mayer Brown': {
    nat: 'US',
    rankings: { pe: 2, banque: 4, arbitrage: 3, concurrence: 4, projets: 4 },
  },
  // ── McDermott Will & Emery ──
  'McDermott Will & Emery': {
    nat: 'US',
    rankings: { pe: 3, banque: 5, restructuring: 4, public: 4 },
  },
  // ── Moncey Avocats ──
  'Moncey Avocats': {
    nat: 'FR',
    rankings: { pe: 4 },
  },
  // ── Orrick Herrington & Sutcliffe ──
  'Orrick Herrington & Sutcliffe': {
    nat: 'US',
    rankings: { ma: 4, restructuring: 4, public: 3, social: 3, concurrence: 5, projets: 2 },
  },
  // ── Paul Hastings ──
  'Paul Hastings': {
    nat: 'US',
    rankings: { pe: 2, banque: 3 },
  },
  // ── Proskauer Rose ──
  'Proskauer Rose': {
    nat: 'US',
    rankings: { pe: 3, banque: 5 },
  },
  // ── Ropes & Gray ──
  'Ropes & Gray': {
    nat: 'US',
    rankings: { pe: 4 },
  },
  // ── Skadden Arps Slate Meagher & Flom ──
  'Skadden Arps Slate Meagher & Flom': {
    nat: 'US',
    rankings: { ma: 3 },
  },
  // ── Sullivan & Cromwell ──
  'Sullivan & Cromwell': {
    nat: 'US',
    rankings: { ma: 3 },
  },
  // ── Weil Gotshal & Manges ──
  'Weil Gotshal & Manges': {
    nat: 'US',
    rankings: { ma: 2, pe: 1, banque: 2, restructuring: 1, public: 2, concurrence: 5 },
  },
  // ── White & Case ──
  'White & Case': {
    nat: 'US',
    rankings: { ma: 3, banque: 1, restructuring: 1, public: 2, arbitrage: 1, concurrence: 3, immo: 4, projets: 4 },
  },
  // ── Willkie Farr & Gallagher ──
  'Willkie Farr & Gallagher': {
    nat: 'US',
    rankings: { ma: 4, pe: 1, banque: 3, restructuring: 2, public: 1, concurrence: 3, projets: 2 },
  },
};

/**
 * Get the Chambers band for a firm in a specific department
 * Returns null if firm is not ranked in that department
 */
export function getChambersRanking(firmName: string, deptKey: string): number | null {
  const firm = CHAMBERS_DB[firmName];
  if (!firm) return null;
  return firm.rankings[deptKey] ?? null;
}

/**
 * Get all Chambers departments where a firm is ranked, with their bands
 */
export function getFirmChambersRankings(firmName: string): { key: string; label: string; band: number }[] {
  const firm = CHAMBERS_DB[firmName];
  if (!firm) return [];
  return CHAMBERS_DEPARTMENTS
    .filter(d => firm.rankings[d.key] !== undefined)
    .map(d => ({ key: d.key, label: d.label, band: firm.rankings[d.key]! }))
    .sort((a, b) => a.band - b.band);
}

/**
 * Format Chambers band display
 */
export function formatChambersBand(band: number): string {
  return `Band ${band}`;
}

/**
 * Mapping from Chambers department keys to French practice labels used in registration
 */
export const CHAMBERS_KEY_TO_PRACTICE: Record<string, string> = {
  ma: 'Corporate/M&A',
  pe: 'Private Equity',
  banque: 'Banking & Finance',
  restructuring: 'Restructuring/Insolvency',
  social: 'Employment',
  immo: 'Real Estate',
  concurrence: 'Competition/European Law',
  public: 'Public Law',
  arbitrage: 'International Arbitration',
  projets: 'Projects & Energy',
};

/**
 * Get the practices (French labels) available for a given firm based on Chambers rankings
 * Returns an array of { label, chambersKey, band }
 */
export function getFirmPractices(firmName: string): { label: string; chambersKey: string; band: number }[] {
  const firm = CHAMBERS_DB[firmName];
  if (!firm) return [];
  return Object.entries(firm.rankings)
    .filter(([key]) => CHAMBERS_KEY_TO_PRACTICE[key])
    .map(([key, band]) => ({
      label: CHAMBERS_KEY_TO_PRACTICE[key],
      chambersKey: key,
      band,
    }))
    .sort((a, b) => a.band - b.band);
}

/**
 * Get the Chambers band for a firm given a French practice label
 */
export function getChambersRankingByPractice(firmName: string, practiceLabel: string): number | null {
  const key = Object.entries(CHAMBERS_KEY_TO_PRACTICE).find(([, label]) => label === practiceLabel)?.[0];
  if (!key) return null;
  return getChambersRanking(firmName, key);
}

/**
 * Get all firm names in the Chambers database
 */
export function getAllChambersFirmNames(): string[] {
  return Object.keys(CHAMBERS_DB).sort();
}
