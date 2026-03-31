export interface CandidateOffer {
  id: string;
  reference: string;
  dept: string;
  seniority: string;
  description: string;
  location: string;
  postedAt: string;
  tags: string[];
  activitySplit?: Record<string, number>;
  contexte?: string;
  equipe?: string;
  retroStr?: string;
  heures?: string;
  tt?: string;
  profilCriteres?: string[];
  ranking?: string;
  /** Nationality of the firm: FR, US, UK */
  nat?: 'FR' | 'US' | 'UK';
  /** Chambers band number (1 = highest) */
  chambersBand?: number;
  /** Chambers department key matching CHAMBERS_DEPARTMENTS */
  chambersDeptKey?: string;
  /** Flag emoji for display */
  natFlag?: string;
}

const NAT_TO_FLAG: Record<string, string> = { FR: '🇫🇷', US: '🇺🇸', UK: '🇬🇧' };

/** Helper to get natFlag from nat */
export function getOfferNatFlag(offer: CandidateOffer): string {
  if (offer.natFlag) return offer.natFlag;
  if (offer.nat) return NAT_TO_FLAG[offer.nat] || '';
  return '';
}

export const CANDIDATE_OFFERS: CandidateOffer[] = [
  {
    id: 'OFF-C-001',
    reference: 'LGN-2026-041',
    dept: 'Corporate/M&A',
    seniority: 'Collaborateur Senior (5-8 ans)',
    description: 'Cabinet de premier plan recherche un collaborateur senior en M&A pour renforcer son équipe dédiée aux opérations de haut de bilan. Environnement international, dossiers cross-border.',
    location: 'Paris',
    postedAt: '2026-03-08',
    tags: ['Cross-border', 'LBO', 'Private Equity'],
    activitySplit: { 'Corporate/M&A': 60, 'Private Equity': 40 },
    contexte: "Renforcement d'équipe",
    equipe: '3 associé(s), 1 counsel(s), 5 collaborateur(s)',
    retroStr: '90.000€ — 130.000€',
    heures: '1800h',
    tt: '2 jours / semaine',
    profilCriteres: ['Autonome', 'Anglais courant', 'Gestion de dossiers complexes'],
    ranking: 'Band 1 · Corporate/M&A',
    nat: 'FR',
    chambersBand: 1,
    chambersDeptKey: 'ma',
  },
  {
    id: 'OFF-C-002',
    reference: 'LGN-2026-042',
    dept: 'Private Equity',
    seniority: 'Counsel (8-12 ans)',
    description: 'Structure anglo-saxonne de référence cherche un counsel pour piloter des opérations de fonds et transactions de capital-investissement. Poste à forte autonomie.',
    location: 'Paris / Londres',
    postedAt: '2026-03-07',
    tags: ['Fonds', 'Capital-investissement', 'Structuration'],
    activitySplit: { 'Private Equity': 70, 'Banking & Finance': 30 },
    contexte: 'Départ à remplacer',
    equipe: '2 associé(s), 2 counsel(s), 4 collaborateur(s)',
    retroStr: '150.000€ — 200.000€',
    heures: '1900h',
    tt: '1 jour / semaine',
    profilCriteres: ['Esprit entrepreneurial', 'Anglais courant', 'Capacité à encadrer'],
    ranking: 'Band 1 · Private Equity',
    nat: 'UK',
    chambersBand: 1,
    chambersDeptKey: 'pe',
  },
  {
    id: 'OFF-C-003',
    reference: 'LGN-2026-043',
    dept: 'Banking & Finance',
    seniority: 'Collaborateur (3-5 ans)',
    description: 'Cabinet français indépendant reconnu recherche un collaborateur en financement d\'acquisition et financements structurés. Belle courbe de progression.',
    location: 'Paris',
    postedAt: '2026-03-09',
    tags: ['Financements structurés', 'Acquisition finance'],
    contexte: "Renforcement d'équipe",
    equipe: '1 associé(s), 3 collaborateur(s)',
    retroStr: '70.000€ — 95.000€',
    heures: '1700h',
    tt: '2 jours / semaine',
    profilCriteres: ['Rigueur & organisation', 'Bon relationnel client'],
    ranking: 'Band 2 · Banking & Finance',
    nat: 'FR',
    chambersBand: 2,
    chambersDeptKey: 'banque',
  },
  {
    id: 'OFF-C-004',
    reference: 'LGN-2026-044',
    dept: 'Tax',
    seniority: 'Collaborateur Senior (5-8 ans)',
    description: 'Cabinet international de premier rang recherche un fiscaliste senior spécialisé en fiscalité transactionnelle. Interaction directe avec les équipes M&A.',
    location: 'Paris',
    postedAt: '2026-03-06',
    tags: ['Fiscalité transactionnelle', 'International'],
    activitySplit: { 'Tax': 80, 'Corporate/M&A': 20 },
    contexte: 'Départ à remplacer',
    equipe: '2 associé(s), 1 counsel(s), 3 collaborateur(s)',
    retroStr: '100.000€ — 140.000€',
    profilCriteres: ['Autonome', 'Anglais courant', 'Polyvalent'],
    ranking: 'Band 1 · Tax',
    nat: 'US',
    chambersBand: 1,
    chambersDeptKey: 'tax',
  },
  {
    id: 'OFF-C-005',
    reference: 'LGN-2026-045',
    dept: 'Employment',
    seniority: 'Counsel (8-12 ans)',
    description: 'Cabinet de niche en droit social recherche un counsel pour accompagner des opérations de restructuration et de mobilité internationale.',
    location: 'Paris / Lyon',
    postedAt: '2026-03-05',
    tags: ['Restructuration', 'Mobilité internationale'],
    contexte: "Renforcement d'équipe",
    equipe: '1 associé(s), 1 counsel(s), 2 collaborateur(s)',
    tt: '3 jours / semaine',
    profilCriteres: ['Esprit d\'équipe', 'Capacité rédactionnelle', 'Proactivité'],
    ranking: 'Band 3 · Employment',
    nat: 'FR',
    chambersBand: 3,
    chambersDeptKey: 'social',
  },
];
