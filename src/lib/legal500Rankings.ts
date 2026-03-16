// ══ LEGAL 500 RANKINGS DATABASE ══
// Source: Legal 500 Paris & France editions (scraped March 2026)
// Department keys: banque, finproj, ma, pe, social, immo, public, restructuring, contentieux, regulatory, arbitrage, assurance, vc

export type FirmRankings = Record<string, number>; // dept key → tier number (0 = Firms to Watch)

export interface FirmEntry {
  nat: 'FR' | 'US' | 'UK' | 'DE' | 'NL';
  rankings: FirmRankings;
}

export const LEGAL500_DB: Record<string, FirmEntry> = {
  // ── TIER 1 INTERNATIONAL ──
  'A&O Shearman': { nat: 'UK', rankings: { banque: 1, ma: 3, social: 2, pe: 2, immo: 2, restructuring: 3, contentieux: 1, finproj: 2, public: 1, regulatory: 1, arbitrage: 3 } },
  'Ashurst LLP': { nat: 'UK', rankings: { banque: 2, ma: 5, social: 4, pe: 3, immo: 3, restructuring: 2, finproj: 2, arbitrage: 4, regulatory: 1 } },
  'Baker McKenzie': { nat: 'US', rankings: { banque: 3, ma: 3, social: 3, immo: 3, contentieux: 3, public: 4, arbitrage: 5 } },
  'Bredin Prat': { nat: 'FR', rankings: { banque: 2, ma: 1, social: 1, pe: 2, restructuring: 2, contentieux: 1, public: 2, regulatory: 3, arbitrage: 3 } },
  'Cleary Gottlieb Steen & Hamilton': { nat: 'US', rankings: { banque: 2, ma: 1, pe: 3, regulatory: 2, contentieux: 1, arbitrage: 4 } },
  'Clifford Chance': { nat: 'UK', rankings: { banque: 1, ma: 3, social: 3, pe: 2, immo: 1, restructuring: 2, public: 1, regulatory: 1, arbitrage: 2, finproj: 1 } },
  'Darrois Villey Maillot Brochier': { nat: 'FR', rankings: { ma: 1, public: 1, regulatory: 3, contentieux: 1, arbitrage: 3 } },
  'De Pardieu Brocas Maffei': { nat: 'FR', rankings: { banque: 2, ma: 3, social: 3, pe: 2, immo: 1, restructuring: 1, contentieux: 2, finproj: 2 } },
  'DLA Piper': { nat: 'UK', rankings: { banque: 3, ma: 4, social: 2, pe: 3, immo: 2, restructuring: 4, contentieux: 3, finproj: 2, public: 3, assurance: 1, arbitrage: 3 } },
  'Freshfields LLP': { nat: 'UK', rankings: { banque: 2, ma: 2, social: 2, pe: 2, restructuring: 2, contentieux: 2, public: 2, arbitrage: 2 } },
  'Gibson Dunn': { nat: 'US', rankings: { banque: 3, ma: 4, social: 3, pe: 3, restructuring: 1, contentieux: 2, finproj: 2 } },
  'Gide Loyrette Nouel A.A.R.P.I.': { nat: 'FR', rankings: { banque: 2, ma: 2, social: 1, pe: 2, immo: 1, restructuring: 4, contentieux: 2, finproj: 1, public: 1, regulatory: 1, arbitrage: 3, assurance: 1, vc: 1 } },
  'Goodwin': { nat: 'US', rankings: { banque: 3, ma: 4, pe: 2, vc: 2 } },
  'Herbert Smith Freehills Kramer LLP': { nat: 'UK', rankings: { banque: 2, ma: 4, social: 3, immo: 3, restructuring: 3, contentieux: 3, finproj: 2, public: 3, regulatory: 2, assurance: 2, arbitrage: 3 } },
  'Hogan Lovells (Paris) LLP': { nat: 'US', rankings: { banque: 2, ma: 4, social: 2, pe: 2, immo: 5, restructuring: 1, contentieux: 2, finproj: 3, public: 3, regulatory: 2, assurance: 2, vc: 1, arbitrage: 3 } },
  'Jones Day': { nat: 'US', rankings: { banque: 4, ma: 4, social: 3, immo: 3, restructuring: 2, contentieux: 4, finproj: 3, public: 1, vc: 1, arbitrage: 3 } },
  'King & Spalding LLP': { nat: 'US', rankings: { banque: 3, ma: 5, pe: 4, contentieux: 4, arbitrage: 3 } },
  'Kirkland & Ellis LLP': { nat: 'US', rankings: { banque: 3, pe: 1 } },
  'Latham & Watkins': { nat: 'US', rankings: { banque: 1, ma: 3, social: 3, pe: 1, restructuring: 1, arbitrage: 3 } },
  'Linklaters': { nat: 'UK', rankings: { banque: 1, ma: 3, social: 2, pe: 2, immo: 2, restructuring: 2, contentieux: 2, finproj: 1, public: 2, regulatory: 3, arbitrage: 3 } },
  'Mayer Brown': { nat: 'US', rankings: { banque: 3, ma: 4, social: 3, pe: 2, immo: 2, restructuring: 2, contentieux: 3, finproj: 3, arbitrage: 2 } },
  'Orrick': { nat: 'US', rankings: { ma: 4, social: 2, pe: 3, immo: 5, restructuring: 3, contentieux: 2, finproj: 2, public: 2, vc: 2 } },
  'Paul Hastings LLP': { nat: 'US', rankings: { banque: 3, ma: 4, social: 4, pe: 2, immo: 4, restructuring: 3, contentieux: 3 } },
  'Skadden, Arps, Slate, Meagher & Flom LLP': { nat: 'US', rankings: { ma: 2, pe: 4, social: 4 } },
  'Sullivan & Cromwell LLP': { nat: 'US', rankings: { ma: 3 } },
  'Weil, Gotshal & Manges LLP': { nat: 'US', rankings: { banque: 2, ma: 3, pe: 1, restructuring: 1, contentieux: 2, public: 1 } },
  'White & Case LLP': { nat: 'US', rankings: { banque: 1, ma: 3, social: 3, pe: 2, immo: 3, restructuring: 1, contentieux: 1, finproj: 1, public: 1, regulatory: 3, arbitrage: 1 } },
  'Willkie Farr & Gallagher LLP': { nat: 'US', rankings: { banque: 2, ma: 3, pe: 1, restructuring: 1, contentieux: 2, finproj: 2, public: 1, arbitrage: 5 } },
  'Winston & Strawn LLP': { nat: 'US', rankings: { banque: 4, ma: 5, social: 4, pe: 3 } },

  // ── FRENCH ELITE ──
  'August Debouzy': { nat: 'FR', rankings: { ma: 4, social: 1, pe: 3, immo: 2, restructuring: 3, contentieux: 3, public: 2, arbitrage: 5, vc: 3 } },
  'BDGS Associés': { nat: 'FR', rankings: { banque: 4, ma: 2, restructuring: 3, contentieux: 1 } },
  'Lacourte Raquin & Associés': { nat: 'FR', rankings: { banque: 4, ma: 4, immo: 1, contentieux: 3, public: 3 } },

  // ── FRENCH MID-SIZE ──
  'Actance': { nat: 'FR', rankings: { social: 1 } },
  'ADVANT Altana': { nat: 'FR', rankings: { social: 3, ma: 5, restructuring: 3, contentieux: 3, assurance: 2 } },
  'Alerion': { nat: 'FR', rankings: { ma: 6, restructuring: 4, assurance: 4, vc: 4 } },
  'Aramis': { nat: 'FR', rankings: { ma: 5, contentieux: 4, public: 4 } },
  'Archers A.A.R.P.I.': { nat: 'FR', rankings: { banque: 4, ma: 5, pe: 4, immo: 2, restructuring: 4, contentieux: 4 } },
  'BG2V': { nat: 'FR', rankings: { ma: 6, social: 4, immo: 3, contentieux: 4, vc: 4 } },
  'Capstan Avocats, member of Ius Laboris': { nat: 'FR', rankings: { social: 1 } },
  'CHASSANY WATRELOT & ASSOCIES': { nat: 'FR', rankings: { social: 2 } },
  'CMS Francis Lefebvre': { nat: 'FR', rankings: { banque: 4, ma: 5, social: 2, immo: 3, restructuring: 3, public: 3, regulatory: 3, contentieux: 4 } },
  'De Gaulle Fleurance & Associés': { nat: 'FR', rankings: { banque: 4, ma: 6, social: 4, immo: 5, restructuring: 4, contentieux: 4, public: 4, regulatory: 3, arbitrage: 4 } },
  'Delsol Avocats': { nat: 'FR', rankings: { ma: 5, social: 4, vc: 3 } },
  'DS Avocats': { nat: 'FR', rankings: { ma: 6, social: 4, contentieux: 4, public: 5 } },
  'Fairway A.A.R.P.I.': { nat: 'FR', rankings: { immo: 1 } },
  'FIDAL': { nat: 'FR', rankings: { ma: 6, social: 4, pe: 4, restructuring: 4, vc: 4 } },
  'Flichy Grangé Avocats': { nat: 'FR', rankings: { social: 1 } },
  'Franklin': { nat: 'FR', rankings: { social: 3, ma: 6, pe: 3, immo: 3, restructuring: 4, public: 4 } },
  'Fromont Briens': { nat: 'FR', rankings: { social: 2 } },
  'FTPA': { nat: 'FR', rankings: { ma: 6, pe: 4, restructuring: 3, public: 4, vc: 3 } },
  'HOCHE AVOCATS': { nat: 'FR', rankings: { ma: 5, social: 4, pe: 4 } },
  'Jeantet': { nat: 'FR', rankings: { banque: 4, ma: 4, social: 4, pe: 3, restructuring: 3, contentieux: 4, regulatory: 3, assurance: 4, arbitrage: 5 } },
  'Joffe & Associés': { nat: 'FR', rankings: { ma: 6, social: 4, pe: 4, contentieux: 4, public: 4, vc: 3 } },
  'LPA Law': { nat: 'FR', rankings: { social: 3, immo: 2, contentieux: 4, public: 3, assurance: 3 } },
  'Moncey Avocats': { nat: 'FR', rankings: { banque: 4, ma: 5, pe: 3, restructuring: 4, contentieux: 4 } },
  'Racine': { nat: 'FR', rankings: { banque: 4, ma: 5, social: 2, pe: 4, immo: 3, restructuring: 3, contentieux: 3, public: 4, regulatory: 3 } },
  'Reinhart Marville Torre': { nat: 'FR', rankings: { social: 3, contentieux: 2, public: 5 } },
  'Scotto Partners': { nat: 'FR', rankings: { pe: 2 } },
  'Sekri Valentin Zerrouk': { nat: 'FR', rankings: { banque: 4, ma: 5, pe: 3, contentieux: 4, public: 5, vc: 2 } },
  'Signature Litigation AARPI': { nat: 'FR', rankings: { contentieux: 1, assurance: 2, arbitrage: 5 } },
  'Veil Jourde': { nat: 'FR', rankings: { ma: 5, social: 4, pe: 4, immo: 5, restructuring: 4, contentieux: 2, public: 5 } },
  'Viguié Schmidt & Associés': { nat: 'FR', rankings: { ma: 4, contentieux: 1, vc: 2 } },
  'UGGC Avocats': { nat: 'FR', rankings: { banque: 4, ma: 5, social: 3, immo: 5, restructuring: 4, public: 3, arbitrage: 5, vc: 2 } },
  'VOLT Associés': { nat: 'FR', rankings: { banque: 4, pe: 4, restructuring: 4 } },
  'YARDS': { nat: 'FR', rankings: { pe: 4, social: 4, vc: 3 } },

  // ── OTHER INTERNATIONAL ──
  'Bird & Bird': { nat: 'UK', rankings: { banque: 4, ma: 5, social: 4, restructuring: 3, contentieux: 4, public: 5, vc: 2 } },
  'Bryan Cave Leighton Paisner': { nat: 'UK', rankings: { banque: 4, ma: 6, social: 4, immo: 3, restructuring: 4, contentieux: 3 } },
  'Cornet Vincent Ségurel': { nat: 'FR', rankings: { banque: 4, public: 5 } },
  'Dechert LLP': { nat: 'US', rankings: { banque: 4, ma: 5, social: 3, immo: 4, contentieux: 3 } },
  'Dentons': { nat: 'UK', rankings: { banque: 3, ma: 5, social: 3, pe: 4, immo: 4, restructuring: 4, public: 1, assurance: 1, vc: 3, arbitrage: 5 } },
  'Eversheds Sutherland (France) LLP': { nat: 'UK', rankings: { ma: 5, social: 4, immo: 4, arbitrage: 4 } },
  'Fieldfisher': { nat: 'UK', rankings: { banque: 4, ma: 6, social: 4, immo: 5, pe: 4 } },
  'McDermott Will & Schulte': { nat: 'US', rankings: { ma: 5, restructuring: 3, contentieux: 3, public: 2, vc: 3 } },
  'Morgan, Lewis & Bockius LLP': { nat: 'US', rankings: { banque: 4, ma: 6, regulatory: 2, vc: 3 } },
  'Norton Rose Fulbright': { nat: 'UK', rankings: { banque: 3, ma: 6, immo: 5, restructuring: 4, assurance: 3, regulatory: 3 } },
  'Osborne Clarke': { nat: 'UK', rankings: { ma: 4, social: 4, restructuring: 4, public: 5 } },
  'Proskauer Rose LLP': { nat: 'US', rankings: { banque: 3, ma: 6, pe: 2 } },
  'Simmons & Simmons': { nat: 'UK', rankings: { banque: 4, ma: 5, social: 3, immo: 4, contentieux: 3, assurance: 3, arbitrage: 5 } },
  'Squire Patton Boggs': { nat: 'US', rankings: { ma: 6, social: 4, pe: 4, assurance: 2, arbitrage: 2 } },
  'Stephenson Harwood': { nat: 'UK', rankings: { banque: 4, ma: 6, social: 4, pe: 4, immo: 4, restructuring: 4, assurance: 3 } },
  'Taylor Wessing': { nat: 'DE', rankings: { ma: 6, social: 4, immo: 5, public: 4, assurance: 2, vc: 4 } },
  'Watson Farley & Williams LLP': { nat: 'UK', rankings: { banque: 4, immo: 4, public: 4, assurance: 3 } },

  // ── ARBITRAGE SPECIALISTS ──
  'Gaillard Banifatemi Shelbaya Disputes': { nat: 'FR', rankings: { arbitrage: 1 } },
  'Quinn Emanuel Urquhart & Sullivan, LLP': { nat: 'US', rankings: { arbitrage: 1 } },
  'Three Crowns LLP': { nat: 'UK', rankings: { arbitrage: 1 } },
  'Derains & Gharavi': { nat: 'FR', rankings: { arbitrage: 2 } },
  'Curtis, Mallet-Prevost, Colt & Mosle LLP': { nat: 'US', rankings: { arbitrage: 2 } },

  // ── ASSURANCE SPECIALISTS ──
  'Clyde & Co LLP': { nat: 'UK', rankings: { assurance: 1, arbitrage: 4 } },
  'HFW': { nat: 'UK', rankings: { assurance: 1 } },
  'Kennedys': { nat: 'UK', rankings: { assurance: 1 } },

  // ── REGULATORY / NICHE ──
  'Spitz Poulle Kannan': { nat: 'FR', rankings: { regulatory: 1 } },
  'CABANES Avocats': { nat: 'FR', rankings: { public: 1 } },

  // ── VENTURE CAPITAL SPECIALISTS ──
  'Chammas & Marcheteau': { nat: 'FR', rankings: { vc: 2, restructuring: 4 } },
  'Villechenon': { nat: 'FR', rankings: { pe: 4, vc: 3 } },

  // ── SOCIAL SPECIALISTS ──
  'Ogletree Deakins': { nat: 'US', rankings: { social: 2 } },
  'Barthélémy Avocats': { nat: 'FR', rankings: { social: 2 } },

  // ── OTHER NOTABLE ──
  'Addleshaw Goddard': { nat: 'UK', rankings: { immo: 5, public: 4 } },
  'Charles Russell Speechlys': { nat: 'UK', rankings: { social: 4, vc: 4 } },
  'K&L Gates LLP': { nat: 'US', rankings: { ma: 6, social: 4, assurance: 3, arbitrage: 5 } },
  'Reed Smith': { nat: 'US', rankings: { immo: 4, arbitrage: 4, vc: 4 } },
  'Latournerie Wolfrom Avocats': { nat: 'FR', rankings: { ma: 6, public: 3 } },
  'Pinsent Masons LLP': { nat: 'UK', rankings: { finproj: 4, arbitrage: 5 } },
  'Jeausserand Audouard': { nat: 'FR', rankings: { pe: 2 } },
  'LL Berg': { nat: 'FR', rankings: { pe: 3 } },
  'Mermoz Avocats': { nat: 'FR', rankings: { pe: 3 } },
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
