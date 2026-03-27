// ══ FIRMS DATABASE (Legal 500 Paris) ══
export const FIRMS_DB: Record<string, { nat: string; p: Record<string, string> }> = {
  'A&O Shearman':{nat:'UK',p:{'banque':'Tier 1','restructuring':'Tier 3','ma':'Tier 3','social':'Tier 2','pe':'Tier 2','immo':'Tier 2','fiscal':'Tier 2'}},
  'Ashurst':{nat:'UK',p:{'banque':'Tier 2','restructuring':'Tier 2','ma':'Tier 5','social':'Tier 4','pe':'Tier 3','immo':'Tier 3','fiscal':'Tier 4'}},
  'Baker McKenzie':{nat:'US',p:{'banque':'Tier 3','ma':'Tier 3','social':'Tier 3','immo':'Tier 3','fiscal':'Tier 1'}},
  'BDGS Associés':{nat:'FR',p:{'restructuring':'Tier 2','ma':'Tier 2','social':'Tier 2','pe':'Tier 2'}},
  'Bredin Prat':{nat:'FR',p:{'banque':'Tier 2','restructuring':'Tier 2','ma':'Tier 1','social':'Tier 1','pe':'Tier 2','fiscal':'Tier 1'}},
  'Cleary Gottlieb Steen & Hamilton':{nat:'US',p:{'banque':'Tier 2','ma':'Tier 1','pe':'Tier 3','fiscal':'Tier 2'}},
  'Clifford Chance':{nat:'UK',p:{'banque':'Tier 1','restructuring':'Tier 2','ma':'Tier 3','social':'Tier 3','pe':'Tier 2','immo':'Tier 1','fiscal':'Tier 2'}},
  'Darrois Villey Maillot Brochier':{nat:'FR',p:{'ma':'Tier 1','fiscal':'Tier 2'}},
  'De Pardieu Brocas Maffei':{nat:'FR',p:{'banque':'Tier 2','restructuring':'Tier 1','ma':'Tier 3','social':'Tier 3','pe':'Tier 2','immo':'Tier 1','fiscal':'Tier 2'}},
  'DLA Piper':{nat:'UK',p:{'banque':'Tier 3','restructuring':'Tier 4','ma':'Tier 4','social':'Tier 2','pe':'Tier 3','immo':'Tier 2','fiscal':'Tier 3'}},
  'Freshfields Bruckhaus Deringer':{nat:'UK',p:{'banque':'Tier 2','restructuring':'Tier 2','ma':'Tier 2','social':'Tier 2','pe':'Tier 2','fiscal':'Tier 2'}},
  'Gibson Dunn & Crutcher':{nat:'US',p:{'banque':'Tier 3','restructuring':'Tier 1','ma':'Tier 4','social':'Tier 3','pe':'Tier 3','fiscal':'Tier 3'}},
  'Gide Loyrette Nouel':{nat:'FR',p:{'banque':'Tier 2','restructuring':'Tier 4','ma':'Tier 2','social':'Tier 1','pe':'Tier 2','immo':'Tier 1','fiscal':'Tier 2'}},
  'Goodwin Procter':{nat:'US',p:{'banque':'Tier 3','ma':'Tier 4','pe':'Tier 2','fiscal':'Tier 3'}},
  'Herbert Smith Freehills':{nat:'UK',p:{'banque':'Tier 2','restructuring':'Tier 3','ma':'Tier 4','social':'Tier 3','immo':'Tier 3','fiscal':'Tier 4'}},
  'Hogan Lovells':{nat:'US',p:{'banque':'Tier 2','restructuring':'Tier 1','ma':'Tier 4','social':'Tier 2','pe':'Tier 2','immo':'Tier 5','fiscal':'Tier 3'}},
  'Jones Day':{nat:'US',p:{'banque':'Tier 4','restructuring':'Tier 2','ma':'Tier 4','social':'Tier 3','immo':'Tier 3','fiscal':'Tier 4'}},
  'King & Spalding':{nat:'US',p:{'banque':'Tier 3','ma':'Tier 4','pe':'Tier 3'}},
  'Kirkland & Ellis':{nat:'US',p:{'banque':'Tier 3','pe':'Tier 1','fiscal':'Tier 3'}},
  'Latham & Watkins':{nat:'US',p:{'banque':'Tier 1','restructuring':'Tier 1','ma':'Tier 3','social':'Tier 3','pe':'Tier 1','fiscal':'Tier 1'}},
  'Linklaters':{nat:'UK',p:{'banque':'Tier 1','restructuring':'Tier 2','ma':'Tier 3','social':'Tier 2','pe':'Tier 2','immo':'Tier 2','fiscal':'Tier 2'}},
  'Mayer Brown':{nat:'US',p:{'banque':'Tier 3','restructuring':'Tier 2','ma':'Tier 4','social':'Tier 3','pe':'Tier 2','immo':'Tier 2','fiscal':'Tier 2'}},
  'McDermott Will & Emery':{nat:'US',p:{'banque':'Tier 3','ma':'Tier 4','fiscal':'Tier 2'}},
  'Moncey Avocats':{nat:'FR',p:{'ma':'Tier 3','social':'Tier 3'}},
  'Orrick Herrington & Sutcliffe':{nat:'US',p:{'restructuring':'Tier 3','ma':'Tier 4','social':'Tier 2','pe':'Tier 3','immo':'Tier 5','fiscal':'Tier 5'}},
  'Paul Hastings':{nat:'US',p:{'banque':'Tier 3','restructuring':'Tier 3','ma':'Tier 4','social':'Tier 4','pe':'Tier 2','immo':'Tier 4','fiscal':'Tier 4'}},
  'Proskauer Rose':{nat:'US',p:{'banque':'Tier 3','pe':'Tier 2','social':'Tier 3'}},
  'Ropes & Gray':{nat:'US',p:{'pe':'Tier 1','ma':'Tier 3'}},
  'Skadden Arps Slate Meagher & Flom':{nat:'US',p:{'banque':'Tier 2','ma':'Tier 3','pe':'Tier 2'}},
  'Sullivan & Cromwell':{nat:'US',p:{'banque':'Tier 2','ma':'Tier 2','fiscal':'Tier 3'}},
  'Weil Gotshal & Manges':{nat:'US',p:{'banque':'Tier 2','restructuring':'Tier 1','ma':'Tier 3','pe':'Tier 2','fiscal':'Tier 3'}},
  'White & Case':{nat:'US',p:{'banque':'Tier 1','restructuring':'Tier 2','ma':'Tier 3','social':'Tier 3','pe':'Tier 2','fiscal':'Tier 2'}},
  'Willkie Farr & Gallagher':{nat:'US',p:{'banque':'Tier 3','restructuring':'Tier 2','ma':'Tier 3','pe':'Tier 1','fiscal':'Tier 3'}},
};

export const NAT_LABELS: Record<string, string> = {
  FR: 'Cabinet français',
  US: 'Cabinet US',
  UK: 'Cabinet UK',
};

export const NAT_FLAGS: Record<string, string> = {
  FR: 'FR',
  US: 'US',
  UK: 'GB',
};

export const DEPT_KEY_MAP: Record<string, string> = {
  'Banque & Finance': 'banque',
  'Corporate / M&A & PE': 'ma',
  'Droit Social': 'social',
  'Immobilier': 'immo',
  'Restructuring': 'restructuring',
  'Fiscal': 'fiscal',
  'Contentieux': 'contentieux',
};

export const DEPARTMENTS = [
  'Banque & Finance',
  'Corporate / M&A & PE',
  'Droit Social',
  'Immobilier',
  'Restructuring',
  'Fiscal',
  'Contentieux',
];

export const CABINET_TYPES = [
  'Cabinet US',
  'Cabinet UK',
  'Cabinet français',
];

export const EXPERTISES = [
  'M&A Industriel',
  'Private Equity / LBO',
  'Venture Capital',
  'Corporate',
  'Financement',
  'Restructuring',
  'Immobilier transactionnel',
  'Droit Social',
];

export const CABINET_EXPERTISE_DETAIL: Record<string, { sections: { title: string; items: { key: string; label: string }[] }[] }> = {
  'M&A Industriel': {
    sections: [
      {
        title: 'Nature des opérations',
        items: [
          { key: 'ma_acq', label: 'Acquisitions' },
          { key: 'ma_cess', label: 'Cessions' },
          { key: 'ma_jv', label: 'Joint-ventures' },
          { key: 'ma_reorg', label: 'Réorganisations' },
          { key: 'ma_cross', label: 'Cross-border' },
        ],
      },
      {
        title: 'Taille des opérations',
        items: [
          { key: 'ma_sm', label: 'Small cap (< 50 M€)' },
          { key: 'ma_mid', label: 'Mid cap (50–500 M€)' },
          { key: 'ma_lg', label: 'Large cap (> 500 M€)' },
        ],
      },
    ],
  },
  'Private Equity / LBO': {
    sections: [
      {
        title: 'Type d\'opérations',
        items: [
          { key: 'pe_lbo', label: 'LBO / Leveraged Buy-Out' },
          { key: 'pe_growth', label: 'Growth equity' },
          { key: 'pe_second', label: 'Secondaire' },
          { key: 'pe_exit', label: 'Sorties / IPO' },
          { key: 'pe_mgt', label: 'Management packages' },
        ],
      },
      {
        title: 'Positionnement',
        items: [
          { key: 'pe_fonds', label: 'Côté fonds' },
          { key: 'pe_mgtside', label: 'Côté management' },
          { key: 'pe_coinvest', label: 'Co-investissement' },
        ],
      },
    ],
  },
  'Venture Capital': {
    sections: [
      {
        title: 'Stade d\'intervention',
        items: [
          { key: 'vc_seed', label: 'Seed / Amorçage' },
          { key: 'vc_seriesa', label: 'Série A / B' },
          { key: 'vc_late', label: 'Late stage / Growth' },
        ],
      },
      {
        title: 'Spécialités',
        items: [
          { key: 'vc_bsa', label: 'BSA / BSPCE' },
          { key: 'vc_sha', label: 'Pactes d\'associés' },
          { key: 'vc_cross', label: 'Cross-border' },
        ],
      },
    ],
  },
  'Corporate': {
    sections: [
      {
        title: 'Nature des opérations',
        items: [
          { key: 'corp_gouv', label: 'Gouvernance' },
          { key: 'corp_reorg', label: 'Réorganisations' },
          { key: 'corp_jv', label: 'Joint-ventures' },
          { key: 'corp_pact', label: 'Pactes d\'actionnaires' },
          { key: 'corp_gen', label: 'Droit des sociétés général' },
        ],
      },
    ],
  },
  'Financement': {
    sections: [
      {
        title: 'Type de financement',
        items: [
          { key: 'fin_acq', label: 'Financements d\'acquisition' },
          { key: 'fin_proj', label: 'Financements de projet' },
          { key: 'fin_struc', label: 'Financements structurés' },
          { key: 'fin_immo', label: 'Financements immobiliers' },
          { key: 'fin_titr', label: 'Titrisation' },
        ],
      },
      {
        title: 'Positionnement',
        items: [
          { key: 'fin_pret', label: 'Côté prêteur' },
          { key: 'fin_empr', label: 'Côté emprunteur' },
        ],
      },
    ],
  },
  'Restructuring': {
    sections: [
      {
        title: 'Nature du travail',
        items: [
          { key: 'rst_amiable', label: 'Conseil amiable' },
          { key: 'rst_jud', label: 'Procédures collectives' },
          { key: 'rst_rfin', label: 'Restructuration financière' },
          { key: 'rst_barre', label: 'Reprise à la barre' },
        ],
      },
      {
        title: 'Positionnement',
        items: [
          { key: 'rst_deb', label: 'Côté débiteur' },
          { key: 'rst_cre', label: 'Côté créancier' },
        ],
      },
    ],
  },
  'Immobilier transactionnel': {
    sections: [
      {
        title: 'Opérations',
        items: [
          { key: 'imm_acq', label: 'Acquisitions immobilières' },
          { key: 'imm_bail', label: 'Baux commerciaux' },
          { key: 'imm_promo', label: 'Promotion immobilière' },
          { key: 'imm_vefa', label: 'VEFA' },
          { key: 'imm_urba', label: 'Urbanisme' },
        ],
      },
      {
        title: 'Type d\'actifs',
        items: [
          { key: 'imm_bureau', label: 'Bureaux' },
          { key: 'imm_retail', label: 'Retail / Commerce' },
          { key: 'imm_logi', label: 'Logistique' },
        ],
      },
    ],
  },
  'Droit Social': {
    sections: [
      {
        title: 'Nature de l\'activité',
        items: [
          { key: 'soc_conseil', label: 'Conseil quotidien' },
          { key: 'soc_cont', label: 'Contentieux prud\'homal' },
          { key: 'soc_coll', label: 'Relations collectives' },
          { key: 'soc_restr', label: 'Restructurations sociales' },
        ],
      },
      {
        title: 'Spécialités',
        items: [
          { key: 'soc_remun', label: 'Rémunération & avantages' },
          { key: 'soc_mob', label: 'Mobilité internationale' },
          { key: 'soc_pse', label: 'PSE / Plans sociaux' },
        ],
      },
    ],
  },
};

export const SENIORITY_OPTIONS = [
  { key: 'junior', label: 'Junior', pqe: '0–3 ans' },
  { key: 'mid', label: 'Mid Level', pqe: '3–6 ans' },
  { key: 'senior', label: 'Sénior', pqe: '+6 ans' },
];

export const SENIORITY_MAP: Record<string, string> = {
  junior: 'Junior (0–3 ans)',
  mid: 'Mid Level (3–6 ans)',
  senior: 'Sénior (+6 ans)',
  counsel: 'Counsel',
  associe: 'Associé',
};

export const CONF_OPTIONS = [
  {
    key: 'confidentielle',
    title: 'Confidentielle',
    badge: 'Recommandé',
    desc: 'LOGAN agit de manière proactive en votre nom. Les candidats ne voient pas votre recherche — LOGAN les approche directement selon votre brief.',
  },
  {
    key: 'semi',
    title: 'Semi-confidentielle',
    badge: '',
    desc: 'Le candidat voit la nationalité de votre cabinet et son positionnement, sans connaître son nom. Il peut manifester son intérêt.',
  },
];

export const SUBSCRIPTION_ADVANTAGES = [
  {
    icon: '🔓',
    title: 'Accès continu au vivier premium',
    desc: 'Consultez les meilleurs profils à l\'écoute du marché, en temps réel — pas uniquement quand vous êtes en urgence.',
  },
  {
    icon: '🎯',
    title: 'Recrutement stratégique',
    desc: 'Identifiez les talents avant vos concurrents. La meilleure embauche se fait rarement dans l\'urgence.',
  },
  {
    icon: '♾️',
    title: 'Illimité, tout le cabinet',
    desc: 'Tous les départements, tous les associés, sans limite de recherche ni de profil consulté.',
  },
  {
    icon: '🤝',
    title: 'Zéro commission au placement',
    desc: 'Pas de pourcentage sur la rétrocession. Votre abonnement couvre tout.',
  },
  {
    icon: '📊',
    title: 'Consultant LOGAN dédié',
    desc: 'Un interlocuteur unique, reporting mensuel, suivi personnalisé de vos recrutements.',
  },
  {
    icon: '🔔',
    title: 'Alertes prioritaires',
    desc: 'Soyez notifié en premier dès qu\'un profil correspondant à vos critères rejoint le vivier.',
  },
];

export interface CabinetProfile {
  id: string;
  dept: string;
  deptLabel: string;
  title: string;
  pqe: string;
  nat: string;
  natFlag: string;
  origin: string;
  originTier: string;
  english: string;
  seniority: string;
  isNew: boolean;
  expertise: string[];
  split: Record<string, number>;
  formation: string;
  droit_etranger: string;
  langue2: string;
  retro_actuel: string;
  disponibilite: string;
  mobilite: string;
  motivation: string;
  match: number;
}

export const PROFILES: CabinetProfile[] = [
  {
    id: 'C-2024-042', dept: 'banque', deptLabel: 'Banque & Finance',
    title: 'Senior Associate Finance — 5 ans PQE',
    pqe: '5 ans', nat: 'FR', natFlag: 'FR',
    origin: 'Cabinet US Tier 1', originTier: 'Tier 1',
    english: 'Bilingue', seniority: 'Mid Level / Sénior', isNew: true,
    expertise: ['Financement', 'Private Equity / LBO'],
    split: { 'Financement': 60, 'Private Equity / LBO': 40 },
    formation: 'Paris II Panthéon-Assas — Master 2 Droit bancaire',
    droit_etranger: '—', langue2: '—',
    retro_actuel: '65–72 K€ fixe',
    disponibilite: 'Sous 3 mois', mobilite: 'Paris',
    motivation: 'Profil très structuré, habitué aux financements d\'acquisition et aux refinancements complexes. Souhaite rejoindre un environnement franco-français avec plus d\'autonomie et de contact client direct.',
    match: 92,
  },
  {
    id: 'C-2024-057', dept: 'ma', deptLabel: 'M&A / Corporate',
    title: 'Collaborateur M&A — 4 ans PQE',
    pqe: '4 ans', nat: 'FR', natFlag: 'FR',
    origin: 'Cabinet français Tier 1', originTier: 'Tier 1',
    english: 'Courant', seniority: 'Mid Level', isNew: true,
    expertise: ['M&A Industriel', 'Private Equity / LBO'],
    split: { 'M&A Industriel': 70, 'Private Equity / LBO': 30 },
    formation: 'HEC + Master 2 Droit des affaires Paris I',
    droit_etranger: '—', langue2: '—',
    retro_actuel: '58–65 K€ fixe',
    disponibilite: 'Sous 2 mois', mobilite: 'Paris',
    motivation: 'Solide expérience M&A mid-cap. Souhaite évoluer vers une structure avec une practice PE plus développée et des dossiers cross-border.',
    match: 88,
  },
  {
    id: 'C-2024-071', dept: 'banque', deptLabel: 'Banque & Finance',
    title: 'Collaborateur Finance — 3 ans PQE',
    pqe: '3 ans', nat: 'UK', natFlag: 'GB',
    origin: 'Cabinet UK Tier 2', originTier: 'Tier 2',
    english: 'Bilingue', seniority: 'Junior / Mid', isNew: false,
    expertise: ['Financement', 'Restructuring'],
    split: { 'Financement': 70, 'Restructuring': 30 },
    formation: 'DJCE + LL.M. UCL Londres',
    droit_etranger: 'Solicitor (Angleterre & Pays de Galles)',
    langue2: 'Allemand intermédiaire',
    retro_actuel: '48–52 K€ fixe',
    disponibilite: 'Immédiate', mobilite: 'Paris',
    motivation: 'Profil très technique en leveraged finance. Motivé par une structure plus franco-française avec dossiers plus autonomes dès maintenant.',
    match: 79,
  },
  {
    id: 'C-2024-083', dept: 'social', deptLabel: 'Droit Social',
    title: 'Counsel Droit Social — 8 ans PQE',
    pqe: '8 ans', nat: 'FR', natFlag: 'FR',
    origin: 'Cabinet français Tier 1', originTier: 'Tier 1',
    english: 'Professionnel', seniority: 'Counsel', isNew: false,
    expertise: ['Droit Social', 'Contentieux'],
    split: { 'Droit Social': 80, 'Contentieux': 20 },
    formation: 'Université Paris II Panthéon-Assas — Master 2 spécialisé',
    droit_etranger: '—', langue2: '—',
    retro_actuel: '75–80 K€ fixe',
    disponibilite: 'Sous 3 mois', mobilite: 'Paris',
    motivation: '8 ans de pratique conseil et contentieux. Souhaite accéder à un rôle d\'associé ou préparer un projet d\'association à moyen terme.',
    match: 85,
  },
  {
    id: 'C-2024-095', dept: 'fiscal', deptLabel: 'Fiscalité',
    title: 'Collaborateur Fiscal — 5 ans PQE',
    pqe: '5 ans', nat: 'FR', natFlag: 'FR',
    origin: 'Cabinet français Tier 1', originTier: 'Tier 1',
    english: 'Courant', seniority: 'Mid Level', isNew: true,
    expertise: ['Fiscal', 'M&A Industriel'],
    split: { 'Fiscal': 75, 'M&A Industriel': 25 },
    formation: 'HEC + Master 2 Fiscalité ESSEC',
    droit_etranger: '—', langue2: '—',
    retro_actuel: '62–68 K€ fixe',
    disponibilite: 'Sous 2 mois', mobilite: 'Paris',
    motivation: 'Fiscaliste M&A expérimenté, à l\'aise en structuration d\'acquisitions et price adjustments. Cherche cabinet avec practice corporate intégrée.',
    match: 81,
  },
  {
    id: 'C-2024-068', dept: 'ma', deptLabel: 'M&A / Corporate',
    title: 'Associé M&A — 12 ans PQE',
    pqe: '12 ans', nat: 'FR', natFlag: 'FR',
    origin: 'Cabinet français Tier 2', originTier: 'Tier 2',
    english: 'Bilingue', seniority: 'Associé', isNew: false,
    expertise: ['M&A Industriel', 'Private Equity / LBO', 'Droit boursier'],
    split: { 'M&A Industriel': 50, 'Private Equity / LBO': 30, 'Droit boursier': 20 },
    formation: 'Sciences Po Paris + Université Columbia LLM',
    droit_etranger: 'New York Bar', langue2: 'Espagnol courant',
    retro_actuel: 'Rémunération associé (sur devis)',
    disponibilite: 'Sous 6 à 9 mois', mobilite: 'Paris · International possible',
    motivation: 'Associé avec book client constitué. Réfléchit à un projet latéral ou fondation d\'une structure dédiée.',
    match: 74,
  },
  {
    id: 'C-2024-102', dept: 'banque', deptLabel: 'Banque & Finance',
    title: 'Senior Associate Finance — 7 ans PQE',
    pqe: '7 ans', nat: 'US', natFlag: 'US',
    origin: 'Cabinet US Tier 1', originTier: 'Tier 1',
    english: 'Langue de travail', seniority: 'Sénior', isNew: false,
    expertise: ['Financement', 'Private Equity / LBO', 'Restructuring'],
    split: { 'Financement': 50, 'Private Equity / LBO': 30, 'Restructuring': 20 },
    formation: 'Paris I + NYU LLM',
    droit_etranger: 'New York Bar', langue2: '—',
    retro_actuel: '85–95 K€ fixe',
    disponibilite: 'Sous 4 mois', mobilite: 'Paris',
    motivation: 'Senior associate avec expérience leveraged finance et restructuring. Cherche structure à taille humaine.',
    match: 76,
  },
  {
    id: 'C-2024-111', dept: 'ma', deptLabel: 'M&A / Corporate',
    title: 'Junior M&A — 2 ans PQE',
    pqe: '2 ans', nat: 'UK', natFlag: 'GB',
    origin: 'Cabinet UK Tier 1', originTier: 'Tier 1',
    english: 'Bilingue', seniority: 'Junior', isNew: true,
    expertise: ['M&A Industriel', 'Droit boursier'],
    split: { 'M&A Industriel': 70, 'Droit boursier': 30 },
    formation: "King's College London + Université Paris I",
    droit_etranger: 'Solicitor qualifié', langue2: '—',
    retro_actuel: '42–46 K€ fixe',
    disponibilite: 'Immédiate', mobilite: 'Paris',
    motivation: 'Profil double qualification (FR / UK) recherchant une structure Paris avec dossiers cross-border.',
    match: 83,
  },
  {
    id: 'C-2024-079', dept: 'pe', deptLabel: 'Private Equity / LBO',
    title: 'Collaborateur PE — 5 ans PQE',
    pqe: '5 ans', nat: 'FR', natFlag: 'FR',
    origin: 'Cabinet US Tier 2', originTier: 'Tier 2',
    english: 'Courant', seniority: 'Mid Level', isNew: false,
    expertise: ['Private Equity / LBO', 'M&A Industriel'],
    split: { 'Private Equity / LBO': 65, 'M&A Industriel': 35 },
    formation: 'EDHEC + Master 2 Droit des affaires Paris II',
    droit_etranger: '—', langue2: '—',
    retro_actuel: '65–72 K€ fixe',
    disponibilite: 'Sous 3 mois', mobilite: 'Paris',
    motivation: '5 ans de pratique LBO mid-cap / small-cap. Souhaite rejoindre une structure avec pratique equity plus développée.',
    match: 86,
  },
  {
    id: 'C-2024-058', dept: 'social', deptLabel: 'Droit Social',
    title: 'Collaborateur Droit Social — 4 ans PQE',
    pqe: '4 ans', nat: 'FR', natFlag: 'FR',
    origin: 'Cabinet français Tier 2', originTier: 'Tier 2',
    english: 'Professionnel', seniority: 'Mid Level', isNew: false,
    expertise: ['Droit Social'],
    split: { 'Droit Social': 100 },
    formation: 'Université Paris II — Master 2 Relations de travail',
    droit_etranger: '—', langue2: '—',
    retro_actuel: '50–55 K€ fixe',
    disponibilite: 'Sous 2 mois', mobilite: 'Paris · Région parisienne',
    motivation: 'Solide pratique conseil employeur. Cherche un environnement plus stimulant avec dossiers de restructuration plus complexes.',
    match: 77,
  },
  {
    id: 'C-2024-119', dept: 'banque', deptLabel: 'Banque & Finance',
    title: 'Counsel Finance — 9 ans PQE',
    pqe: '9 ans', nat: 'FR', natFlag: 'FR',
    origin: 'Cabinet UK Tier 2', originTier: 'Tier 2',
    english: 'Bilingue', seniority: 'Counsel', isNew: false,
    expertise: ['Financement', 'Restructuring', 'Private Equity / LBO'],
    split: { 'Financement': 55, 'Restructuring': 25, 'Private Equity / LBO': 20 },
    formation: 'ENS + Paris I + Cambridge LLM',
    droit_etranger: 'Solicitor', langue2: 'Allemand courant',
    retro_actuel: '90–100 K€ fixe',
    disponibilite: 'Sous 6 mois', mobilite: 'Paris',
    motivation: 'Counsel très expérimenté, connaissance profonde des marchés de dette. Ambition d\'associé clairement posée.',
    match: 80,
  },
  {
    id: 'C-2024-133', dept: 'fiscal', deptLabel: 'Fiscalité',
    title: 'Collaborateur Fiscal International — 6 ans PQE',
    pqe: '6 ans', nat: 'US', natFlag: 'US',
    origin: 'Cabinet US Tier 2', originTier: 'Tier 2',
    english: 'Bilingue', seniority: 'Sénior', isNew: true,
    expertise: ['Fiscal', 'Private Equity / LBO'],
    split: { 'Fiscal': 60, 'Private Equity / LBO': 40 },
    formation: 'Columbia LLM (Tax) + Paris II',
    droit_etranger: 'New York Bar', langue2: '—',
    retro_actuel: '80–90 K€ fixe',
    disponibilite: 'Sous 4 mois', mobilite: 'Paris',
    motivation: 'Spécialiste fiscalité internationale et structuration PE. Cherche un cabinet avec une pratique corporate forte.',
    match: 78,
  },
];

export const SPLIT_COLORS = [
  'hsl(var(--foreground))',
  'hsl(var(--muted-foreground))',
  '#374151',
  '#6B7280',
  '#9CA3AF',
  '#4B4B4B',
  '#111111',
  '#7A7A7A',
  '#D1D5DB',
  '#374151',
];

// L500_URLS removed — Legal 500 functionality has been discontinued

export function getFirmTier(firm: { p: Record<string, string> }, depts: string[]): string {
  const deptKeys = depts.map((d) => DEPT_KEY_MAP[d]).filter(Boolean);
  if (deptKeys.length === 0) {
    const tiers = Object.values(firm.p);
    return tiers.sort()[0] || '';
  }
  const relevantTiers = deptKeys.map((k) => firm.p[k]).filter(Boolean);
  return relevantTiers.sort()[0] || '';
}
