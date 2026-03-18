// Mock data for the admin dashboard

export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  dept: string;
  pqe: string;
  origin: string;
  status: 'nouveau' | 'qualifié' | 'en_process' | 'placé' | 'inactif';
  createdAt: string;
  linkedinUrl?: string;
  mobilite: string;
  anglais: string;
}

export interface AdminOffer {
  id: string;
  cabinetName: string;
  dept: string;
  seniority: string;
  palier: string;
  status: 'active' | 'pourvue' | 'expirée';
  createdAt: string;
  profilesMatched: number;
}

export interface AdminProcess {
  id: string;
  candidatId: string;
  candidatName: string;
  cabinetName: string;
  dept: string;
  stage: 'intérêt' | 'entretien_logan' | 'présentation' | 'entretien_cabinet' | 'offre' | 'placé' | 'abandonné';
  startedAt: string;
  updatedAt: string;
}

export const MOCK_PROFILES: AdminProfile[] = [
  { id: 'LGN-C-001', fullName: 'Alexandre Dumont', email: 'a.dumont@email.com', dept: 'M&A', pqe: '7', origin: 'Bredin Prat', status: 'qualifié', createdAt: '2026-03-08', mobilite: 'Paris', anglais: 'Bilingue' },
  { id: 'LGN-C-002', fullName: 'Marie Lefèvre', email: 'm.lefevre@email.com', dept: 'Private Equity', pqe: '4', origin: 'Darrois Villey', status: 'nouveau', createdAt: '2026-03-09', mobilite: 'Paris / Londres', anglais: 'Courant' },
  { id: 'LGN-C-003', fullName: 'Thomas Bernard', email: 't.bernard@email.com', dept: 'Fiscal', pqe: '12', origin: 'CMS Francis Lefebvre', status: 'en_process', createdAt: '2026-03-05', mobilite: 'Paris', anglais: 'Professionnel' },
  { id: 'LGN-C-004', fullName: 'Sophie Chen', email: 's.chen@email.com', dept: 'Financement', pqe: '6', origin: 'Gide Loyrette Nouel', status: 'qualifié', createdAt: '2026-03-07', mobilite: 'Paris / Singapour', anglais: 'Bilingue' },
  { id: 'LGN-C-005', fullName: 'Pierre Moreau', email: 'p.moreau@email.com', dept: 'Droit Social', pqe: '9', origin: 'Flichy Grangé', status: 'nouveau', createdAt: '2026-03-10', mobilite: 'Paris', anglais: 'Courant' },
  { id: 'LGN-C-006', fullName: 'Camille Roux', email: 'c.roux@email.com', dept: 'M&A', pqe: '3', origin: 'Cleary Gottlieb', status: 'nouveau', createdAt: '2026-03-10', mobilite: 'Paris / New York', anglais: 'Bilingue' },
  { id: 'LGN-C-007', fullName: 'Jean-Baptiste Petit', email: 'jb.petit@email.com', dept: 'Private Equity', pqe: '11', origin: 'Weil Gotshal', status: 'placé', createdAt: '2026-02-15', mobilite: 'Paris', anglais: 'Bilingue' },
  { id: 'LGN-C-008', fullName: 'Léa Martin', email: 'l.martin@email.com', dept: 'Fiscal', pqe: '5', origin: 'Arsene Taxand', status: 'inactif', createdAt: '2026-02-20', mobilite: 'Lyon', anglais: 'Professionnel' },
];

export const MOCK_OFFERS: AdminOffer[] = [
  { id: 'OFF-001', cabinetName: 'Bredin Prat', dept: 'M&A', seniority: 'Collaborateur Senior (5-8 PQE)', palier: 'premium', status: 'active', createdAt: '2026-03-06', profilesMatched: 4 },
  { id: 'OFF-002', cabinetName: 'Darrois Villey', dept: 'Private Equity', seniority: 'Counsel (8-12 PQE)', palier: 'standard', status: 'active', createdAt: '2026-03-08', profilesMatched: 2 },
  { id: 'OFF-003', cabinetName: 'De Pardieu Brocas', dept: 'Banque & Finance', seniority: 'Collaborateur (3-5 PQE)', palier: 'essentiel', status: 'active', createdAt: '2026-03-09', profilesMatched: 5 },
  { id: 'OFF-004', cabinetName: 'August Debouzy', dept: 'Droit Social', seniority: 'Collaborateur Senior (5-8 PQE)', palier: 'premium', status: 'pourvue', createdAt: '2026-02-10', profilesMatched: 7 },
  { id: 'OFF-005', cabinetName: 'Gide Loyrette Nouel', dept: 'Fiscal', seniority: 'Counsel (8-12 PQE)', palier: 'standard', status: 'expirée', createdAt: '2026-01-15', profilesMatched: 3 },
];

export const MOCK_PROCESSES: AdminProcess[] = [
  { id: 'PRC-001', candidatId: 'LGN-C-003', candidatName: 'Thomas Bernard', cabinetName: 'Bredin Prat', dept: 'M&A', stage: 'entretien_cabinet', startedAt: '2026-03-05', updatedAt: '2026-03-09' },
  { id: 'PRC-002', candidatId: 'LGN-C-004', candidatName: 'Sophie Chen', cabinetName: 'Darrois Villey', dept: 'Banque & Finance', stage: 'présentation', startedAt: '2026-03-07', updatedAt: '2026-03-08' },
  { id: 'PRC-003', candidatId: 'LGN-C-001', candidatName: 'Alexandre Dumont', cabinetName: 'De Pardieu Brocas', dept: 'M&A', stage: 'intérêt', startedAt: '2026-03-09', updatedAt: '2026-03-09' },
  { id: 'PRC-004', candidatId: 'LGN-C-007', candidatName: 'Jean-Baptiste Petit', cabinetName: 'August Debouzy', dept: 'Private Equity', stage: 'placé', startedAt: '2026-02-01', updatedAt: '2026-03-01' },
  { id: 'PRC-005', candidatId: 'LGN-C-002', candidatName: 'Marie Lefèvre', cabinetName: 'Gide Loyrette Nouel', dept: 'Private Equity', stage: 'entretien_logan', startedAt: '2026-03-09', updatedAt: '2026-03-10' },
];

export const STAGE_LABELS: Record<string, string> = {
  intérêt: 'Intérêt exprimé',
  entretien_logan: 'Entretien Logan',
  présentation: 'Présentation au cabinet',
  entretien_cabinet: 'Entretien cabinet',
  offre: 'Offre en cours',
  placé: 'Placé ✓',
  abandonné: 'Abandonné',
};

export const STATUS_LABELS: Record<string, string> = {
  nouveau: 'Nouveau',
  qualifié: 'Qualifié',
  en_process: 'En process',
  placé: 'Placé',
  inactif: 'Inactif',
};
