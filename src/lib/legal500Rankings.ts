// ══ LEGAL 500 RANKINGS DATABASE ══
// Source: Legal 500 Paris — données 2025/2026
// Pratiques couvertes par Logan :
//   ma = Corporate/M&A (Fusions-acquisitions)
//   pe = Private Equity
//   banque = Financement LBO (Legal 500: Banque et Finance - Transactions)
//   projets = Financement de projets / Projects & Energy
//   social = Droit Social / Employment
//   immo = Immobilier / Real Estate
//   fiscal = Droit Fiscal / Tax
//   restructuring = Restructuring / Entreprises en difficulté
// Tier 0 = Firms to Watch

export type FirmRankings = Record<string, number>; // dept key → tier number (0 = Firms to Watch)

export interface FirmEntry {
  nat: 'FR' | 'US' | 'UK' | 'DE' | 'NL';
  rankings: FirmRankings;
}

export const LEGAL500_DB: Record<string, FirmEntry> = {
  // ── A ──
  'A&O Shearman':                     { nat: 'UK', rankings: { ma: 3, pe: 2, banque: 1, projets: 2, social: 2, immo: 2, fiscal: 2, restructuring: 3 } },
  'Actance':                          { nat: 'FR', rankings: { social: 1 } },
  'ADVANT Altana':                    { nat: 'FR', rankings: { ma: 5, social: 3, restructuring: 3 } },
  'Aerige Avocats':                   { nat: 'FR', rankings: { social: 3 } },
  'Alerion':                          { nat: 'FR', rankings: { ma: 6, restructuring: 4, vc: 4 } },
  'Alscio Avocats':                   { nat: 'FR', rankings: { social: 3 } },
  'Almain':                           { nat: 'FR', rankings: { ma: 6 } },
  'Aramis':                           { nat: 'FR', rankings: { ma: 5 } },
  'Archers A.A.R.P.I.':               { nat: 'FR', rankings: { ma: 5, pe: 4, banque: 4, immo: 2, restructuring: 4 } },
  'Arkwood SCP':                      { nat: 'FR', rankings: { fiscal: 3 } },
  'Arsene':                           { nat: 'FR', rankings: { fiscal: 1 } },
  'ASAFO & CO. AARPI':                { nat: 'FR', rankings: { projets: 3 } },
  'Ashurst':                          { nat: 'UK', rankings: { ma: 5, pe: 3, banque: 2, projets: 2, social: 4, immo: 3, fiscal: 4, restructuring: 2 } },
  'Astura':                           { nat: 'FR', rankings: { ma: 6 } },
  'August Debouzy':                   { nat: 'FR', rankings: { ma: 4, pe: 3, social: 1, immo: 2, fiscal: 4, restructuring: 3, vc: 3 } },
  // ── B ──
  'Baker McKenzie':                   { nat: 'US', rankings: { ma: 3, banque: 3, social: 3, immo: 3, fiscal: 1 } },
  'Barbier Legal':                    { nat: 'FR', rankings: { restructuring: 4 } },
  'Barthélémy Avocats':               { nat: 'FR', rankings: { social: 2 } },
  'BCTG Avocats':                     { nat: 'FR', rankings: { social: 4 } },
  'BDGS Associés':                    { nat: 'FR', rankings: { ma: 2, banque: 4, fiscal: 4, restructuring: 3 } },
  'Bersay':                           { nat: 'FR', rankings: { pe: 4, social: 4 } },
  'BG2V':                             { nat: 'FR', rankings: { ma: 6, immo: 3, social: 4, vc: 4 } },
  'Bignon Lebray':                    { nat: 'FR', rankings: { pe: 4, vc: 3 } },
  'Bird & Bird':                      { nat: 'UK', rankings: { ma: 5, banque: 4, social: 4, fiscal: 5, restructuring: 3, vc: 3 } },
  'Boché Dobelle':                    { nat: 'FR', rankings: { restructuring: 4 } },
  'Bracewell LLP':                    { nat: 'US', rankings: { projets: 0 } },
  'Bredin Prat':                      { nat: 'FR', rankings: { ma: 1, pe: 2, banque: 2, social: 1, fiscal: 1, restructuring: 2 } },
  'Bryan Cave Leighton Paisner':      { nat: 'UK', rankings: { ma: 6, banque: 4, social: 4, immo: 3, fiscal: 3, restructuring: 4 } },
  // ── C ──
  'Capstan Avocats, member of Ius Laboris': { nat: 'FR', rankings: { social: 1 } },
  'Cazals Manzo Pichot Saint Quentin':{ nat: 'FR', rankings: { fiscal: 4 } },
  'CGR Avocats':                      { nat: 'FR', rankings: { social: 4 } },
  'Chammas & Marcheteau':             { nat: 'FR', rankings: { fiscal: 5, restructuring: 4, vc: 2 } },
  'Charles Russell Speechlys':        { nat: 'UK', rankings: { social: 4, vc: 4 } },
  'CHASSANY WATRELOT & ASSOCIES':     { nat: 'FR', rankings: { social: 2 } },
  'Cleary Gottlieb Steen & Hamilton': { nat: 'US', rankings: { ma: 1, pe: 3, banque: 2, projets: 3, fiscal: 2 } },
  'Clifford Chance':                  { nat: 'UK', rankings: { ma: 3, pe: 2, banque: 1, projets: 1, social: 3, immo: 1, fiscal: 2, restructuring: 2 } },
  'CMS Francis Lefebvre':             { nat: 'FR', rankings: { ma: 5, banque: 4, social: 2, immo: 3, fiscal: 2, restructuring: 3 } },
  'Cohen & Gresser LLP':              { nat: 'US', rankings: { social: 4, fiscal: 4 } },
  'Cornet Vincent Ségurel':           { nat: 'FR', rankings: { banque: 4 } },
  'Couderc Dinh & Associés':          { nat: 'FR', rankings: { fiscal: 5, vc: 4 } },
  // ── D ──
  'D\'Ornano + Co.':                  { nat: 'FR', rankings: { pe: 4 } },
  'Daher Avocats':                    { nat: 'FR', rankings: { social: 4 } },
  'Darrois Villey Maillot Brochier':  { nat: 'FR', rankings: { ma: 1, fiscal: 2 } },
  'De Gaulle Fleurance & Associés':   { nat: 'FR', rankings: { ma: 6, banque: 4, social: 4, immo: 5, fiscal: 5 } },
  'De Pardieu Brocas Maffei':         { nat: 'FR', rankings: { ma: 3, pe: 2, banque: 2, projets: 2, social: 3, immo: 1, fiscal: 3, restructuring: 1 } },
  'Dechert LLP':                      { nat: 'US', rankings: { ma: 5, social: 3, immo: 4, fiscal: 3 } },
  'Delaby Dorison Avocats':           { nat: 'FR', rankings: { fiscal: 4 } },
  'Deloitte Société d\'Avocats':      { nat: 'FR', rankings: { ma: 6, social: 4, fiscal: 5 } },
  'Delsol Avocats':                   { nat: 'FR', rankings: { ma: 5, social: 4, fiscal: 5, vc: 3 } },
  'Dentons':                          { nat: 'UK', rankings: { ma: 5, pe: 4, banque: 3, projets: 4, social: 3, immo: 4, fiscal: 4, restructuring: 4, vc: 3 } },
  'DLA Piper':                        { nat: 'UK', rankings: { ma: 4, pe: 3, banque: 3, projets: 2, social: 2, immo: 2, fiscal: 3, restructuring: 4 } },
  'DS Avocats':                       { nat: 'FR', rankings: { ma: 6, social: 4 } },
  'Duroc Partners':                   { nat: 'FR', rankings: { pe: 3 } },
  // ── E ──
  'Eversheds Sutherland':             { nat: 'UK', rankings: { ma: 5, social: 4, immo: 4 } },
  'EY Société d\'Avocats':            { nat: 'FR', rankings: { ma: 6, immo: 5, fiscal: 1 } },
  // ── F ──
  'FACTORHY':                         { nat: 'FR', rankings: { social: 3 } },
  'Fairway A.A.R.P.I.':               { nat: 'FR', rankings: { immo: 1, fiscal: 5 } },
  'FIDAL':                            { nat: 'FR', rankings: { ma: 6, pe: 4, banque: 4, social: 4, fiscal: 5, restructuring: 4, vc: 4 } },
  'Fieldfisher':                      { nat: 'UK', rankings: { ma: 6, pe: 4, banque: 4, social: 4, immo: 5, fiscal: 5 } },
  'FLICHY GRANGÉ AVOCATS':            { nat: 'FR', rankings: { social: 1 } },
  'Franklin':                         { nat: 'FR', rankings: { ma: 6, pe: 3, social: 3, immo: 3, fiscal: 5, restructuring: 4 } },
  'Freshfields Bruckhaus Deringer':   { nat: 'UK', rankings: { ma: 2, pe: 2, banque: 2, social: 2, fiscal: 2, restructuring: 2 } },
  'Fromont Briens':                   { nat: 'FR', rankings: { social: 2 } },
  'FTMS Avocats':                     { nat: 'FR', rankings: { social: 3 } },
  'FTPA':                             { nat: 'FR', rankings: { ma: 5, pe: 4, fiscal: 5, restructuring: 3, vc: 3 } },
  // ── G ──
  'GALM Avocats':                     { nat: 'FR', rankings: { immo: 5, fiscal: 5 } },
  'Gibson Dunn & Crutcher':           { nat: 'US', rankings: { ma: 4, pe: 3, banque: 3, projets: 2, social: 3, fiscal: 3, restructuring: 1 } },
  'Gide Loyrette Nouel':              { nat: 'FR', rankings: { ma: 2, pe: 2, banque: 2, projets: 1, social: 1, immo: 1, fiscal: 2, restructuring: 4, vc: 1 } },
  'Goodwin Procter':                  { nat: 'US', rankings: { ma: 4, pe: 2, banque: 3, fiscal: 3, vc: 2 } },
  // ── H ──
  'Herbert Smith Freehills':          { nat: 'UK', rankings: { ma: 4, banque: 2, projets: 2, social: 3, immo: 3, fiscal: 4, restructuring: 3 } },
  'HOCHE AVOCATS':                    { nat: 'FR', rankings: { ma: 5, pe: 4, social: 4, fiscal: 5 } },
  'Hogan Lovells':                    { nat: 'US', rankings: { ma: 4, pe: 2, banque: 2, projets: 3, social: 2, immo: 5, fiscal: 3, restructuring: 1, vc: 2 } },
  'Holis Avocats':                    { nat: 'FR', rankings: { social: 3 } },
  // ── J ──
  'jasper Avocats':                   { nat: 'FR', rankings: { social: 3 } },
  'Jeantet':                          { nat: 'FR', rankings: { ma: 4, pe: 3, banque: 4, social: 4, fiscal: 4, restructuring: 3, projets: 0 } },
  'Jeausserand Audouard':             { nat: 'FR', rankings: { pe: 2, fiscal: 4 } },
  'Joffe & Associés':                 { nat: 'FR', rankings: { ma: 6, pe: 4, banque: 4, social: 4, vc: 3 } },
  'Jones Day':                        { nat: 'US', rankings: { ma: 4, banque: 4, social: 3, immo: 3, projets: 3, fiscal: 4, restructuring: 2, vc: 1 } },
  // ── K ──
  'K&L Gates LLP':                    { nat: 'US', rankings: { social: 4, banque: 4 } },
  'Karman Associés':                  { nat: 'FR', rankings: { social: 4 } },
  'King & Spalding':                  { nat: 'US', rankings: { ma: 5, pe: 4, banque: 3 } },
  'Kirkland & Ellis':                 { nat: 'US', rankings: { pe: 1, banque: 3, fiscal: 3 } },
  'Kopper':                           { nat: 'FR', rankings: { social: 4 } },
  'KPMG Avocats, France':             { nat: 'FR', rankings: { social: 4, fiscal: 4 } },
  // ── L ──
  'Lacourte Raquin & Associés':       { nat: 'FR', rankings: { ma: 4, banque: 4, immo: 1, fiscal: 3 } },
  'Lamoure Rivals':                   { nat: 'FR', rankings: { restructuring: 4 } },
  'Latham & Watkins':                 { nat: 'US', rankings: { ma: 3, pe: 1, banque: 1, social: 3, fiscal: 1, restructuring: 1, vc: 4 } },
  'Latournerie Wolfrom Avocats':      { nat: 'FR', rankings: { ma: 6 } },
  'Le 16 Law':                        { nat: 'FR', rankings: { immo: 5, restructuring: 0 } },
  'Lext Avocats':                     { nat: 'FR', rankings: { social: 4 } },
  'Linklaters':                       { nat: 'UK', rankings: { ma: 3, pe: 2, banque: 1, projets: 1, social: 2, immo: 2, fiscal: 2, restructuring: 2 } },
  'Littler France':                   { nat: 'US', rankings: { social: 3 } },
  'LL Berg':                          { nat: 'FR', rankings: { pe: 3 } },
  'LPA Law':                          { nat: 'FR', rankings: { ma: 6, social: 3, immo: 2, banque: 4, fiscal: 4 } },
  'Lusis Avocats':                    { nat: 'FR', rankings: { social: 4 } },
  // ── M ──
  'Majj Avocats':                     { nat: 'FR', rankings: { social: 3 } },
  'Mayer Brown':                      { nat: 'US', rankings: { ma: 4, pe: 2, banque: 3, projets: 3, social: 3, immo: 2, fiscal: 2, restructuring: 2 } },
  'McDermott Will & Emery':           { nat: 'US', rankings: { ma: 5, pe: 2, fiscal: 2, restructuring: 3, vc: 3 } },
  'Mermoz Avocats':                   { nat: 'FR', rankings: { pe: 3, fiscal: 5 } },
  'MGG Legal':                        { nat: 'FR', rankings: { social: 3 } },
  'Milestone Avocats':                { nat: 'FR', rankings: { social: 4 } },
  'Moncey Avocats':                   { nat: 'FR', rankings: { ma: 5, pe: 3, banque: 4, fiscal: 5, restructuring: 4 } },
  'Morgan, Lewis & Bockius LLP':      { nat: 'US', rankings: { ma: 6, banque: 4, vc: 3 } },
  // ── N ──
  'Nabarro Béraud Avocats':           { nat: 'FR', rankings: { banque: 4 } },
  'Norton Rose Fulbright':            { nat: 'UK', rankings: { ma: 6, banque: 3, immo: 5, fiscal: 3, restructuring: 4 } },
  // ── O ──
  'Ogletree Deakins':                 { nat: 'US', rankings: { social: 2 } },
  'Opleo Avocats':                    { nat: 'FR', rankings: { pe: 4, fiscal: 4 } },
  'Orrick Herrington & Sutcliffe':    { nat: 'US', rankings: { ma: 4, pe: 3, projets: 2, social: 2, immo: 5, fiscal: 5, restructuring: 3, vc: 2 } },
  'Osborne Clarke':                   { nat: 'UK', rankings: { ma: 4, social: 4, fiscal: 5, restructuring: 4 } },
  // ── P ──
  'Paul Hastings':                    { nat: 'US', rankings: { ma: 4, pe: 2, banque: 3, social: 4, immo: 4, fiscal: 4, restructuring: 3 } },
  'PBA LEGAL':                        { nat: 'FR', rankings: { social: 4 } },
  'PDGB':                             { nat: 'FR', rankings: { immo: 0, fiscal: 5, restructuring: 0 } },
  'Peltier Juvigny Marpeau & Associés':{ nat: 'FR', rankings: { ma: 4, social: 3, restructuring: 3 } },
  'Pinsent Masons LLP':               { nat: 'UK', rankings: { projets: 4 } },
  'Piotraut Giné Avocats (PGA)':      { nat: 'FR', rankings: { pe: 4 } },
  'PLM Avocats':                      { nat: 'FR', rankings: { restructuring: 3 } },
  'Proskauer Rose':                   { nat: 'US', rankings: { ma: 6, pe: 2, banque: 3, vc: 0 } },
  'Pwc Société d\'Avocats':           { nat: 'FR', rankings: { ma: 6, fiscal: 2 } },
  // ── R ──
  'Racine':                           { nat: 'FR', rankings: { ma: 5, pe: 4, banque: 4, social: 2, immo: 3, fiscal: 4, restructuring: 3 } },
  'Reed Smith':                       { nat: 'US', rankings: { ma: 6, immo: 4, banque: 0, fiscal: 5, vc: 4 } },
  'Reinhart Marville Torre':          { nat: 'FR', rankings: { social: 3 } },
  'Rescue Law':                       { nat: 'FR', rankings: { restructuring: 4 } },
  'Ropes & Gray':                     { nat: 'US', rankings: { ma: 3, pe: 1 } },
  // ── S ──
  'sbkg & Associés':                  { nat: 'FR', rankings: { immo: 3 } },
  'Scotto Partners':                  { nat: 'FR', rankings: { pe: 2, fiscal: 4 } },
  'Sekri Valentin Zerrouk':           { nat: 'FR', rankings: { ma: 5, pe: 3, banque: 4, immo: 0, fiscal: 5, vc: 2 } },
  'Simon Associés':                   { nat: 'FR', rankings: { social: 3, restructuring: 3 } },
  'Simmons & Simmons':                { nat: 'UK', rankings: { ma: 5, banque: 4, social: 3, immo: 4, fiscal: 3 } },
  'Skadden Arps Slate Meagher & Flom':{ nat: 'US', rankings: { ma: 2, pe: 4, social: 4, fiscal: 3 } },
  'Spark Avocats':                    { nat: 'FR', rankings: { pe: 4 } },
  'Squair':                           { nat: 'FR', rankings: { banque: 0 } },
  'Squadra Avocats':                  { nat: 'FR', rankings: { restructuring: 4 } },
  'Squire Patton Boggs':              { nat: 'US', rankings: { ma: 6, pe: 4, social: 4 } },
  'Stephenson Harwood':               { nat: 'UK', rankings: { ma: 6, pe: 4, banque: 4, social: 4, fiscal: 5, restructuring: 4 } },
  'Sullivan & Cromwell':              { nat: 'US', rankings: { ma: 3, fiscal: 1 } },
  // ── T ──
  'Taylor Wessing':                   { nat: 'UK', rankings: { ma: 6, social: 4, immo: 5, vc: 4 } },
  'Tirard Naudin A.A.R.P.I':          { nat: 'FR', rankings: { fiscal: 5 } },
  'TNDA Avocats':                     { nat: 'FR', rankings: { social: 3 } },
  'Trinity International LLP':        { nat: 'UK', rankings: { projets: 4 } },
  // ── U ──
  'UGGC Avocats':                     { nat: 'FR', rankings: { ma: 5, banque: 4, social: 3, immo: 5, restructuring: 4, vc: 2 } },
  // ── V ──
  'VALOREN':                          { nat: 'FR', rankings: { restructuring: 3 } },
  'Valther':                          { nat: 'FR', rankings: { pe: 4 } },
  'Veil Jourde':                      { nat: 'FR', rankings: { ma: 5, pe: 4, banque: 4, social: 4, immo: 5, fiscal: 5, restructuring: 4 } },
  'VGG & Associés':                   { nat: 'FR', rankings: { ma: 5 } },
  'Viguié Schmidt & Associés':        { nat: 'FR', rankings: { ma: 4, vc: 3 } },
  'Villechenon':                      { nat: 'FR', rankings: { pe: 4, vc: 3 } },
  'Vivien & Associés':                { nat: 'FR', rankings: { ma: 5, social: 4, fiscal: 5 } },
  'VOLT Associés':                    { nat: 'FR', rankings: { pe: 4, banque: 4, restructuring: 4 } },
  // ── W ──
  'Watson Farley & Williams LLP':     { nat: 'UK', rankings: { social: 0, immo: 4, banque: 4, fiscal: 5 } },
  'Weil Gotshal & Manges':            { nat: 'US', rankings: { ma: 3, pe: 1, banque: 2, fiscal: 3, restructuring: 1 } },
  'White & Case':                     { nat: 'US', rankings: { ma: 3, pe: 2, banque: 1, projets: 1, social: 3, immo: 3, fiscal: 3, restructuring: 1, vc: 2 } },
  'Willkie Farr & Gallagher':         { nat: 'US', rankings: { ma: 3, pe: 1, banque: 2, projets: 2, fiscal: 4, restructuring: 1 } },
  'Altaïr Avocats':                   { nat: 'FR', rankings: { vc: 4 } },
  'FBL Avocats':                      { nat: 'FR', rankings: { vc: 4 } },
  'Harlay Avocats':                   { nat: 'FR', rankings: { vc: 3 } },
  'Orsay Avocats':                    { nat: 'FR', rankings: { vc: 3 } },
  'OYAT':                             { nat: 'FR', rankings: { vc: 4 } },
  'Parallel Avocats AARPI':           { nat: 'FR', rankings: { vc: 4 } },
  'Walter Billet Avocats':            { nat: 'FR', rankings: { vc: 3 } },
  'Winston Taylor':                   { nat: 'FR', rankings: { ma: 5, pe: 3, banque: 4, social: 4, fiscal: 5 } },
  // ── Y ──
  'YARDS':                            { nat: 'FR', rankings: { pe: 4, social: 4, fiscal: 5, vc: 3 } },
};

// Aliases : noms alternatifs → nom canonique
export const FIRM_ALIASES: Record<string, string> = {
  'Freshfields': 'Freshfields Bruckhaus Deringer',
  'Freshfields LLP': 'Freshfields Bruckhaus Deringer',
  'Goodwin': 'Goodwin Procter',
  'Gibson Dunn': 'Gibson Dunn & Crutcher',
  'Hogan Lovells (Paris) LLP': 'Hogan Lovells',
  'Herbert Smith Freehills LLP': 'Herbert Smith Freehills',
  'Herbert Smith Freehills Kramer LLP': 'Herbert Smith Freehills',
  'Paul Hastings LLP': 'Paul Hastings',
  'Kirkland & Ellis LLP': 'Kirkland & Ellis',
  'King & Spalding LLP': 'King & Spalding',
  'Skadden, Arps, Slate, Meagher & Flom LLP': 'Skadden Arps Slate Meagher & Flom',
  'White & Case LLP': 'White & Case',
  'Weil, Gotshal & Manges LLP': 'Weil Gotshal & Manges',
  'Weil Gotshal & Manges LLP': 'Weil Gotshal & Manges',
  'Sullivan & Cromwell LLP': 'Sullivan & Cromwell',
  'Willkie Farr & Gallagher LLP': 'Willkie Farr & Gallagher',
  'Proskauer Rose LLP': 'Proskauer Rose',
  'McDermott Will & Schulte': 'McDermott Will & Emery',
  'Ashurst LLP': 'Ashurst',
  'Ropes & Gray France AARPI': 'Ropes & Gray',
  'Orrick': 'Orrick Herrington & Sutcliffe',
  'Flichy Grangé Avocats': 'FLICHY GRANGÉ AVOCATS',
  'Capstan Avocats': 'Capstan Avocats, member of Ius Laboris',
};

/** Résout un nom de cabinet vers son nom canonique */
export function resolveCanonicalName(name: string): string {
  return FIRM_ALIASES[name] || name;
}

/** Toutes les pratiques couvertes par Logan */
export const LEGAL500_DEPARTMENTS: { key: string; label: string }[] = [
  { key: 'ma',            label: 'M&A' },
  { key: 'pe',            label: 'Private Equity' },
  { key: 'banque',        label: 'Financement LBO' },
  { key: 'projets',       label: 'Financement de projets' },
  { key: 'social',        label: 'Droit social' },
  { key: 'immo',          label: 'Droit immobilier' },
  { key: 'fiscal',        label: 'Droit fiscal' },
  { key: 'restructuring', label: 'Restructuring' },
  { key: 'vc',            label: 'Venture Capital' },
];

/** Tier d'une firme pour une pratique donnée (résout les aliases) */
export function getFirmTierForDept(firmName: string, deptKey: string): number | null {
  const canonical = resolveCanonicalName(firmName);
  const firm = LEGAL500_DB[canonical];
  if (!firm) return null;
  return firm.rankings[deptKey] ?? null;
}

/** Liste triée de tous les noms de cabinets (pour autocomplete) */
export function getAllFirmNames(): string[] {
  // Noms canoniques + aliases
  const canonical = Object.keys(LEGAL500_DB);
  const aliases = Object.keys(FIRM_ALIASES);
  return [...new Set([...canonical, ...aliases])].sort((a, b) => a.localeCompare(b, 'fr'));
}

/** Nationalité d'une firme */
export function getFirmNationality(firmName: string): string | null {
  const canonical = resolveCanonicalName(firmName);
  return LEGAL500_DB[canonical]?.nat ?? null;
}

/** Formate le tier pour affichage */
export function formatTier(tier: number | null): string {
  if (tier === null || tier === undefined) return '—';
  if (tier === 0) return 'Firms to Watch';
  return `Tier ${tier}`;
}

/** All Legal 500 rankings for a given firm (for display) */
export function getFirmRankings(firmName: string): { key: string; label: string; tier: number }[] {
  const canonical = resolveCanonicalName(firmName);
  const firm = LEGAL500_DB[canonical];
  if (!firm) return [];
  return LEGAL500_DEPARTMENTS
    .filter(d => firm.rankings[d.key] !== undefined)
    .map(d => ({ key: d.key, label: d.label, tier: firm.rankings[d.key] }));
}

/** Résumé du classement Legal 500 pour un cabinet+pratique */
export function getLegal500Summary(firmName: string, deptKey: string): string | null {
  const tier = getFirmTierForDept(firmName, deptKey);
  if (tier === null) return null;
  const deptLabel = LEGAL500_DEPARTMENTS.find(d => d.key === deptKey)?.label || deptKey;
  if (tier === 0) return `Firms to Watch — ${deptLabel}`;
  return `Tier ${tier} — Legal 500 ${deptLabel}`;
}
