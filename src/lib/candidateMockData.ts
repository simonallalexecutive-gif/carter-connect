export interface CandidateOffer {
  id: string;
  reference: string;
  dept: string;
  seniority: string;
  description: string;
  location: string;
  postedAt: string;
  tags: string[];
}

export const CANDIDATE_OFFERS: CandidateOffer[] = [
  {
    id: 'OFF-C-001',
    reference: 'LGN-2026-041',
    dept: 'M&A',
    seniority: 'Collaborateur Senior (5-8 PQE)',
    description: 'Cabinet de premier plan recherche un collaborateur senior en M&A pour renforcer son équipe dédiée aux opérations de haut de bilan. Environnement international, dossiers cross-border.',
    location: 'Paris',
    postedAt: '2026-03-08',
    tags: ['Cross-border', 'LBO', 'Private Equity'],
  },
  {
    id: 'OFF-C-002',
    reference: 'LGN-2026-042',
    dept: 'Private Equity',
    seniority: 'Counsel (8-12 PQE)',
    description: 'Structure anglo-saxonne de référence cherche un counsel pour piloter des opérations de fonds et transactions de capital-investissement. Poste à forte autonomie.',
    location: 'Paris / Londres',
    postedAt: '2026-03-07',
    tags: ['Fonds', 'Capital-investissement', 'Structuration'],
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
  },
];
