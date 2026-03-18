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
  natFlag?: string;
}

export const CANDIDATE_OFFERS: CandidateOffer[] = [
  {
    id: 'OFF-C-001',
    reference: 'LGN-2026-041',
    dept: 'M&A',
    seniority: 'Collaborateur Senior (5-8 ans)',
    description: 'Cabinet de premier plan recherche un collaborateur senior en M&A pour renforcer son équipe dédiée aux opérations de haut de bilan. Environnement international, dossiers cross-border.',
    location: 'Paris',
    postedAt: '2026-03-08',
    tags: ['Cross-border', 'LBO', 'Private Equity'],
    activitySplit: { 'M&A': 60, 'Private Equity': 40 },
    contexte: "Renforcement d'équipe",
    equipe: '3 associé(s), 1 counsel(s), 5 collaborateur(s)',
    retroStr: '90.000€ — 130.000€',
    heures: '1800h',
    tt: '2 jours / semaine',
    profilCriteres: ['Autonome', 'Anglais courant', 'Gestion de dossiers complexes'],
    ranking: 'Tier 1 · M&A',
    natFlag: 'GB',
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
    activitySplit: { 'Private Equity': 70, 'Financement': 30 },
    contexte: 'Départ à remplacer',
    equipe: '2 associé(s), 2 counsel(s), 4 collaborateur(s)',
    retroStr: '150.000€ — 200.000€',
    heures: '1900h',
    tt: '1 jour / semaine',
    profilCriteres: ['Esprit entrepreneurial', 'Anglais courant', 'Capacité à encadrer'],
    ranking: 'Tier 1 · Private Equity',
    natFlag: 'US',
  },
  {
    id: 'OFF-C-003',
    reference: 'LGN-2026-043',
    dept: 'Banque & Finance',
    seniority: 'Collaborateur (3-5 PQE)',
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
    ranking: 'Tier 2 · Banque & Finance',
    natFlag: 'FR',
  },
  {
    id: 'OFF-C-004',
    reference: 'LGN-2026-044',
    dept: 'Fiscal',
    seniority: 'Collaborateur Senior (5-8 PQE)',
    description: 'Cabinet international de premier rang recherche un fiscaliste senior spécialisé en fiscalité transactionnelle. Interaction directe avec les équipes M&A.',
    location: 'Paris',
    postedAt: '2026-03-06',
    tags: ['Fiscalité transactionnelle', 'International'],
    activitySplit: { 'Fiscal': 80, 'M&A': 20 },
    contexte: 'Départ à remplacer',
    equipe: '2 associé(s), 1 counsel(s), 3 collaborateur(s)',
    retroStr: '100.000€ — 140.000€',
    profilCriteres: ['Autonome', 'Anglais courant', 'Polyvalent'],
    ranking: 'Tier 1 · Fiscal',
    natFlag: 'US',
  },
  {
    id: 'OFF-C-005',
    reference: 'LGN-2026-045',
    dept: 'Droit Social',
    seniority: 'Counsel (8-12 PQE)',
    description: 'Cabinet de niche en droit social recherche un counsel pour accompagner des opérations de restructuration et de mobilité internationale.',
    location: 'Paris / Lyon',
    postedAt: '2026-03-05',
    tags: ['Restructuration', 'Mobilité internationale'],
    contexte: "Renforcement d'équipe",
    equipe: '1 associé(s), 1 counsel(s), 2 collaborateur(s)',
    tt: '3 jours / semaine',
    profilCriteres: ['Esprit d\'équipe', 'Capacité rédactionnelle', 'Proactivité'],
    ranking: 'Tier 3 · Droit Social',
    natFlag: 'FR',
  },
];
