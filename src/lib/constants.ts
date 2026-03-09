export const CABINETS = [
  "A&O Shearman", "ADVANT Altana", "Alerion", "August Debouzy",
  "Baker McKenzie", "BDGS Associés", "Bird & Bird", "Bredin Prat",
  "Capstan Avocats", "Chammas & Marcheteau", "Cleary Gottlieb Steen & Hamilton",
  "Clifford Chance", "CMS Francis Lefebvre", "Coblence Avocats",
  "Darrois Villey Maillot Brochier", "De Gaulle Fleurance & Associés",
  "De Pardieu Brocas Maffei", "Debevoise & Plimpton", "Dechert", "Dentons",
  "DLA Piper", "FIDAL", "Fieldfisher", "Flichy Grangé Avocats", "Franklin",
  "Freshfields", "Fried Frank", "Gide Loyrette Nouel", "Gibson Dunn", "Goodwin",
  "Herbert Smith Freehills", "Hogan Lovells", "Jeantet", "Jones Day",
  "Kirkland & Ellis", "Lacourte Raquin & Associés", "Latham & Watkins",
  "Linklaters", "Littler", "Mayer Brown", "Morgan Lewis",
  "Norton Rose Fulbright", "Orrick", "Osborne Clarke", "Paul Hastings",
  "PLM Avocats", "Proskauer Rose", "Racine", "Reed Smith", "Ropes & Gray",
  "Simon Associés", "Simmons & Simmons", "Skadden", "Sullivan & Cromwell",
  "Taylor Wessing", "UGGC Avocats", "Veil Jourde", "Voltaire",
  "Weil Gotshal & Manges", "White & Case", "Willkie Farr & Gallagher",
  "Winston & Strawn"
].sort((a, b) => a.localeCompare(b));

export const CABINET_META: Record<string, { nat: string; tier: string }> = {
  "Bredin Prat": { nat: "Français", tier: "Band 1" },
  "Cleary Gottlieb Steen & Hamilton": { nat: "Américain", tier: "Band 1" },
  "Darrois Villey Maillot Brochier": { nat: "Français", tier: "Band 1" },
  "Kirkland & Ellis": { nat: "Américain", tier: "Band 1" },
  "BDGS Associés": { nat: "Français", tier: "Band 2" },
  "Freshfields": { nat: "Anglais", tier: "Band 2" },
  "Gide Loyrette Nouel": { nat: "Français", tier: "Band 2" },
  "Skadden": { nat: "Américain", tier: "Band 2" },
  "A&O Shearman": { nat: "Anglais", tier: "Band 1" },
  "Clifford Chance": { nat: "Anglais", tier: "Band 1" },
  "Linklaters": { nat: "Anglais", tier: "Band 1" },
  "Latham & Watkins": { nat: "Américain", tier: "Band 1" },
  "Sullivan & Cromwell": { nat: "Américain", tier: "Band 1" },
  "White & Case": { nat: "Américain", tier: "Band 2" },
  "Gibson Dunn": { nat: "Américain", tier: "Band 2" },
  "Weil Gotshal & Manges": { nat: "Américain", tier: "Band 2" },
  "Willkie Farr & Gallagher": { nat: "Américain", tier: "Band 2" },
  "Herbert Smith Freehills": { nat: "Anglais", tier: "Band 2" },
  "Hogan Lovells": { nat: "Anglais", tier: "Band 2" },
  "August Debouzy": { nat: "Français", tier: "Band 2" },
  "De Pardieu Brocas Maffei": { nat: "Français", tier: "Band 2" },
  "DLA Piper": { nat: "Anglais", tier: "Band 3" },
  "CMS Francis Lefebvre": { nat: "Français", tier: "Band 3" },
  "Baker McKenzie": { nat: "Américain", tier: "Band 3" },
  "Norton Rose Fulbright": { nat: "Anglais", tier: "Band 3" },
  "Jones Day": { nat: "Américain", tier: "Band 3" },
  "Dentons": { nat: "Anglais", tier: "Band 3" },
  "Mayer Brown": { nat: "Américain", tier: "Band 3" },
};

export const DEPARTEMENTS = [
  "M&A / Private Equity", "Banque & Finance", "Droit Social", "Fiscal",
  "Immobilier", "Restructuring", "Marchés de Capitaux",
  "Arbitrage / Contentieux", "Droit Public", "Concurrence", "IP / Tech", "Autre"
];

export const ACTIVITES = {
  nature: [
    { key: "ca", label: "Conseil amiable" },
    { key: "cj", label: "Conseil judiciaire" },
    { key: "cont", label: "Contentieux des affaires" },
    { key: "pc", label: "Proc. collectives" },
  ],
  position: [
    { key: "deb", label: "Côté débiteur" },
    { key: "cre", label: "Côté créancier" },
  ],
  restr: [
    { key: "rf", label: "Restructuration financière" },
    { key: "rb", label: "Reprise à la barre" },
    { key: "dm", label: "Distressed M&A" },
  ],
};

export const QUALITES = [
  "Flexibilité", "Autonomie", "Deal Flow", "Ambiance d'équipe",
  "Formation", "International", "Pro bono", "Dossiers complexes",
  "Relation clients", "Rémunération", "Télétravail", "Évolution rapide"
];

export const AXES = [
  "Rémunération", "Équilibre vie pro/perso", "Moins de contentieux",
  "Moins de reporting", "Plus d'autonomie", "Meilleure communication",
  "Vers counsel", "Plus de conseil", "Environnement international",
  "Moins de déplacements", "Culture d'entreprise", "Taille d'équipe"
];

export const NOGO_SUGGESTIONS = [
  "Pas de télétravail", "Contentieux uniquement", "Pas de management",
  "Billable hours élevés", "Pas de mobilité", "Cabinet < 20 avocats",
  "Pas de transactionnel", "Hors Paris"
];

export const NATIONALITES = ["Français", "Américain", "Anglais", "Allemand", "Autre"];

export const TIERS = ["Band 1", "Band 2", "Band 3", "Band 4", "Boutique"];

export const ANGLAIS_OPTIONS = ["Courant", "Professionnel", "Notions", "Bilingue"];

export const TYPES_CLIENTS = [
  "CAC 40 / SBF 120", "ETI", "PME", "Start-ups / Scale-ups",
  "Fonds d'investissement", "Banques", "Institutionnels", "Particuliers HNWI"
];

export const MOIS = [
  { value: 1, label: "Janvier" }, { value: 2, label: "Février" },
  { value: 3, label: "Mars" }, { value: 4, label: "Avril" },
  { value: 5, label: "Mai" }, { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" }, { value: 8, label: "Août" },
  { value: 9, label: "Septembre" }, { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" }, { value: 12, label: "Décembre" },
];
