// ══ LEGAL 500 RANKINGS DATABASE ══
// Source: Legal 500 Paris & France editions (scraped March 2026)
// Department keys: banque, finproj, ma, pe, social, immo, public, restructuring, contentieux, regulatory, arbitrage, assurance, vc

export type FirmRankings = Record<string, number>; // dept key → tier number (0 = Firms to Watch)

export interface FirmEntry {
  nat: 'FR' | 'US' | 'UK' | 'DE' | 'NL';
  rankings: FirmRankings;
}

export const LEGAL500_DB: Record<string, FirmEntry> = {
  'A&O Shearman': { nat: 'UK', rankings: { banque: 1, ma: 3, social: 2, pe: 2, immo: 2, restructuring: 3, contentieux: 1, finproj: 2, public: 1, regulatory: 1, arbitrage: 3 } },
  'Ashurst': { nat: 'UK', rankings: { banque: 2, ma: 5, social: 4, pe: 3, immo: 3, restructuring: 2, finproj: 2, arbitrage: 4, regulatory: 1 } },
  'Baker McKenzie': { nat: 'US', rankings: { banque: 3, ma: 3, social: 3, immo: 3, contentieux: 3, public: 4, arbitrage: 5 } },
  'BDGS Associés': { nat: 'FR', rankings: { banque: 4, ma: 2, restructuring: 3, contentieux: 1 } },
  'Bredin Prat': { nat: 'FR', rankings: { banque: 2, ma: 1, social: 1, pe: 2, restructuring: 2, contentieux: 1, public: 2, regulatory: 3, arbitrage: 3 } },
  'Cleary Gottlieb Steen & Hamilton': { nat: 'US', rankings: { banque: 2, ma: 1, pe: 3, regulatory: 2, contentieux: 1, arbitrage: 4 } },
  'Clifford Chance': { nat: 'UK', rankings: { banque: 1, ma: 3, social: 3, pe: 2, immo: 1, restructuring: 2, public: 1, regulatory: 1, arbitrage: 2, finproj: 1 } },
  'Darrois Villey Maillot Brochier': { nat: 'FR', rankings: { ma: 1, public: 1, regulatory: 3, contentieux: 1, arbitrage: 3 } },
  'De Pardieu Brocas Maffei': { nat: 'FR', rankings: { banque: 2, ma: 3, social: 3, pe: 2, immo: 1, restructuring: 1, contentieux: 2, finproj: 2 } },
  'DLA Piper': { nat: 'UK', rankings: { banque: 3, ma: 4, social: 2, pe: 3, immo: 2, restructuring: 4, contentieux: 3, finproj: 2, public: 3, assurance: 1, arbitrage: 3 } },
  'Freshfields Bruckhaus Deringer': { nat: 'UK', rankings: { banque: 2, ma: 2, social: 2, pe: 2, restructuring: 2, contentieux: 2, public: 2, arbitrage: 2 } },
  'Gibson Dunn & Crutcher': { nat: 'US', rankings: { banque: 3, ma: 4, social: 3, pe: 3, restructuring: 1, contentieux: 2, finproj: 2 } },
  'Gide Loyrette Nouel': { nat: 'FR', rankings: { banque: 2, ma: 2, social: 1, pe: 2, immo: 1, restructuring: 4, contentieux: 2, finproj: 1, public: 1, regulatory: 1, arbitrage: 3, assurance: 1, vc: 1 } },
  'Goodwin Procter': { nat: 'US', rankings: { banque: 3, ma: 4, pe: 2, vc: 2 } },
  'Herbert Smith Freehills': { nat: 'UK', rankings: { banque: 2, ma: 4, social: 3, immo: 3, restructuring: 3, contentieux: 3, finproj: 2, public: 3, regulatory: 2, assurance: 2, arbitrage: 3 } },
  'Hogan Lovells': { nat: 'US', rankings: { banque: 2, ma: 4, social: 2, pe: 2, immo: 5, restructuring: 1, contentieux: 2, finproj: 3, public: 3, regulatory: 2, assurance: 2, vc: 1, arbitrage: 3 } },
  'Jones Day': { nat: 'US', rankings: { banque: 4, ma: 4, social: 3, immo: 3, restructuring: 2, contentieux: 4, finproj: 3, public: 1, vc: 1, arbitrage: 3 } },
  'King & Spalding': { nat: 'US', rankings: { banque: 3, ma: 5, pe: 4, contentieux: 4, arbitrage: 3 } },
  'Kirkland & Ellis': { nat: 'US', rankings: { banque: 3, pe: 1 } },
  'Latham & Watkins': { nat: 'US', rankings: { banque: 1, ma: 3, social: 3, pe: 1, restructuring: 1, arbitrage: 3 } },
  'Linklaters': { nat: 'UK', rankings: { banque: 1, ma: 3, social: 2, pe: 2, immo: 2, restructuring: 2, contentieux: 2, finproj: 1, public: 2, regulatory: 3, arbitrage: 3 } },
  'Mayer Brown': { nat: 'US', rankings: { banque: 3, ma: 4, social: 3, pe: 2, immo: 2, restructuring: 2, contentieux: 3, finproj: 3, arbitrage: 2 } },
  'McDermott Will & Emery': { nat: 'US', rankings: { ma: 5, restructuring: 3, contentieux: 3, public: 2, vc: 3 } },
  'Moncey Avocats': { nat: 'FR', rankings: { banque: 4, ma: 5, pe: 3, restructuring: 4, contentieux: 4 } },
  'Orrick Herrington & Sutcliffe': { nat: 'US', rankings: { ma: 4, social: 2, pe: 3, immo: 5, restructuring: 3, contentieux: 2, finproj: 2, public: 2, vc: 2 } },
  'Paul Hastings': { nat: 'US', rankings: { banque: 3, ma: 4, social: 4, pe: 2, immo: 4, restructuring: 3, contentieux: 3 } },
  'Proskauer Rose': { nat: 'US', rankings: { banque: 3, ma: 6, pe: 2 } },
  'Ropes & Gray': { nat: 'US', rankings: { pe: 1, ma: 3 } },
  'Skadden Arps Slate Meagher & Flom': { nat: 'US', rankings: { ma: 2, pe: 4, social: 4 } },
  'Sullivan & Cromwell': { nat: 'US', rankings: { ma: 3 } },
  'Weil Gotshal & Manges': { nat: 'US', rankings: { banque: 2, ma: 3, pe: 1, restructuring: 1, contentieux: 2, public: 1 } },
  'White & Case': { nat: 'US', rankings: { banque: 1, ma: 3, social: 3, pe: 2, immo: 3, restructuring: 1, contentieux: 1, finproj: 1, public: 1, regulatory: 3, arbitrage: 1 } },
  'Willkie Farr & Gallagher': { nat: 'US', rankings: { banque: 2, ma: 3, pe: 1, restructuring: 1, contentieux: 2, finproj: 2, public: 1, arbitrage: 5 } },
};

// Department labels and keys
export const LEGAL500_DEPARTMENTS: { key: string; label: string }[] = [
  { key: 'banque', label: 'Banque & Finance' },
  { key: 'finproj', label: 'Financement de projet' },
  { key: 'ma', label: 'Fusions-Acquisitions' },
  { key: 'pe', label: 'Private Equity (LBO)' },
  { key: 'vc', label: 'Venture Capital' },
  { key: 'social', label: 'Droit Social' },
  { key: 'immo', label: 'Immobilier' },
  { key: 'public', label: 'Droit Public' },
  { key: 'restructuring', label: 'Restructuring' },
  { key: 'contentieux', label: 'Contentieux' },
  { key: 'regulatory', label: 'Regulatory' },
  { key: 'arbitrage', label: 'Arbitrage' },
  { key: 'assurance', label: 'Assurances' },
];

export const NAT_LABELS: Record<string, string> = {
  FR: 'Cabinet français',
  US: 'Cabinet américain',
  UK: 'Cabinet britannique',
  DE: 'Cabinet allemand',
  NL: 'Cabinet néerlandais',
};

export const NAT_FLAGS: Record<string, string> = {
  FR: 'FR',
  US: 'US',
  UK: 'GB',
  DE: 'DE',
  NL: 'NL',
};

/**
 * Get the tier for a firm in a specific department
 * Returns null if firm is not ranked in that department
 */
export function getFirmTierForDept(firmName: string, deptKey: string): number | null {
  const firm = LEGAL500_DB[firmName];
  if (!firm) return null;
  return firm.rankings[deptKey] ?? null;
}

/**
 * Get all departments where a firm is ranked, with their tiers
 */
export function getFirmRankings(firmName: string): { key: string; label: string; tier: number }[] {
  const firm = LEGAL500_DB[firmName];
  if (!firm) return [];
  return LEGAL500_DEPARTMENTS
    .filter(d => firm.rankings[d.key] !== undefined)
    .map(d => ({ key: d.key, label: d.label, tier: firm.rankings[d.key]! }))
    .sort((a, b) => a.tier - b.tier);
}

/**
 * Get firm nationality
 */
export function getFirmNationality(firmName: string): string | null {
  return LEGAL500_DB[firmName]?.nat ?? null;
}

/**
 * Get all firm names for autocomplete
 */
export function getAllFirmNames(): string[] {
  return Object.keys(LEGAL500_DB).sort();
}

/**
 * Format tier display
 */
export function formatTier(tier: number): string {
  if (tier === 0) return 'Firms to Watch';
  return `Tier ${tier}`;
}
