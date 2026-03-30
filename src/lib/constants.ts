export const CABINETS = [
  "A&O Shearman",
  "Ashurst",
  "Baker McKenzie",
  "BDGS Associés",
  "Bredin Prat",
  "Cleary Gottlieb Steen & Hamilton",
  "Clifford Chance",
  "Darrois Villey Maillot Brochier",
  "De Pardieu Brocas Maffei",
  "DLA Piper",
  "Freshfields Bruckhaus Deringer",
  "Gibson Dunn & Crutcher",
  "Gide Loyrette Nouel",
  "Goodwin Procter",
  "Herbert Smith Freehills",
  "Hogan Lovells",
  "Jones Day",
  "King & Spalding",
  "Kirkland & Ellis",
  "Latham & Watkins",
  "Linklaters",
  "Mayer Brown",
  "McDermott Will & Emery",
  "Moncey Avocats",
  "Orrick Herrington & Sutcliffe",
  "Paul Hastings",
  "Proskauer Rose",
  "Ropes & Gray",
  "Skadden Arps Slate Meagher & Flom",
  "Sullivan & Cromwell",
  "Weil Gotshal & Manges",
  "White & Case",
  "Willkie Farr & Gallagher",
].sort((a, b) => a.localeCompare(b));

export const CABINET_META: Record<string, { nat: string; tier: string }> = {
  "Linklaters": { nat: "Anglais", tier: "Band 1" },
  "Kirkland & Ellis": { nat: "Américain", tier: "Band 1" },
  "Bredin Prat": { nat: "Français", tier: "Band 1" },
  "Darrois Villey Maillot Brochier": { nat: "Français", tier: "Band 1" },
  "Cleary Gottlieb Steen & Hamilton": { nat: "Américain", tier: "Band 1" },
  "A&O Shearman": { nat: "Anglais", tier: "Band 1" },
  "Clifford Chance": { nat: "Anglais", tier: "Band 1" },
  "Latham & Watkins": { nat: "Américain", tier: "Band 1" },
  "Sullivan & Cromwell": { nat: "Américain", tier: "Band 1" },
  "Ropes & Gray": { nat: "Américain", tier: "Band 1" },
  "BDGS Associés": { nat: "Français", tier: "Band 2" },
  "Freshfields Bruckhaus Deringer": { nat: "Anglais", tier: "Band 2" },
  "Gide Loyrette Nouel": { nat: "Français", tier: "Band 2" },
  "Skadden Arps Slate Meagher & Flom": { nat: "Américain", tier: "Band 2" },
  "Gibson Dunn & Crutcher": { nat: "Américain", tier: "Band 2" },
  "White & Case": { nat: "Américain", tier: "Band 2" },
  "Weil Gotshal & Manges": { nat: "Américain", tier: "Band 2" },
  "Willkie Farr & Gallagher": { nat: "Américain", tier: "Band 2" },
  "Herbert Smith Freehills": { nat: "Anglais", tier: "Band 2" },
  "Hogan Lovells": { nat: "Anglais", tier: "Band 2" },
  "De Pardieu Brocas Maffei": { nat: "Français", tier: "Band 2" },
  "Goodwin Procter": { nat: "Américain", tier: "Band 2" },
  "DLA Piper": { nat: "Anglais", tier: "Band 3" },
  "Baker McKenzie": { nat: "Américain", tier: "Band 3" },
  "Jones Day": { nat: "Américain", tier: "Band 3" },
  "Mayer Brown": { nat: "Américain", tier: "Band 3" },
  "Paul Hastings": { nat: "Américain", tier: "Band 3" },
  "Ashurst": { nat: "Anglais", tier: "Band 3" },
  "Proskauer Rose": { nat: "Américain", tier: "Band 3" },
  "McDermott Will & Emery": { nat: "Américain", tier: "Band 3" },
  "Orrick Herrington & Sutcliffe": { nat: "Américain", tier: "Band 3" },
  "King & Spalding": { nat: "Américain", tier: "Band 3" },
  "Moncey Avocats": { nat: "Français", tier: "Band 3" },
};

export const DEPARTEMENTS = [
  "Corporate", "Droit Social", "Financement LBO", "Financement de projets", "Immobilier",
  "M&A (dominante)", "Private Equity (dominante)", "Restructuring", "Venture Capital"
];




// Activities specific to each practice area
export interface ActivityItem {
  key: string;
  label: string;
  children?: ActivityItem[];
}

export const ACTIVITES_BY_PRACTICE: Record<string, { sections: { title: string; items: ActivityItem[] }[] }> = {
  "M&A (dominante)": {
    sections: [
      { title: "Nature des opérations", items: [
        { key: "acq", label: "Acquisitions" }, { key: "cess", label: "Cessions" },
        { key: "lbo", label: "LBO / Leveraged Buy-Out" }, { key: "jv", label: "Joint-ventures" },
        { key: "reorg", label: "Réorganisations" },
      ]},
      { title: "Positionnement", items: [
        { key: "sell", label: "Côté vendeur" }, { key: "buy", label: "Côté acquéreur" },
        { key: "fonds", label: "Côté fonds" }, { key: "mgt", label: "Côté management" },
      ]},
      { title: "Taille des opérations", items: [
        { key: "sm", label: "Small cap (< 50M€)" }, { key: "mid", label: "Mid cap (50-500M€)" },
        { key: "lg", label: "Large cap (> 500M€)" },
      ]},
    ],
  },
  "Private Equity (dominante)": {
    sections: [
      { title: "Nature des opérations", items: [
        { key: "pe_fonds", label: "Investissements de fonds" }, { key: "pe_lbo", label: "LBO / Leveraged Buy-Out" },
        { key: "pe_vc", label: "Venture Capital" }, { key: "pe_cotes", label: "Public-to-Private" },
        { key: "pe_exit", label: "Exits / Cessions" },
      ]},
      { title: "Positionnement", items: [
        { key: "pe_sell", label: "Côté vendeur" }, { key: "pe_buy", label: "Côté acquéreur" },
        { key: "pe_gp", label: "Côté GP / Management Company" }, { key: "pe_mgt", label: "Côté management" },
      ]},
      { title: "Taille des opérations", items: [
        { key: "pe_sm", label: "Small cap (< 50M€)" }, { key: "pe_mid", label: "Mid cap (50-500M€)" },
        { key: "pe_lg", label: "Large cap (> 500M€)" },
      ]},
    ],
  },
  "Corporate": {
    sections: [
      { title: "Nature du travail", items: [
        { key: "corp_gouv", label: "Gouvernance" }, { key: "corp_reorg", label: "Réorganisations" },
        { key: "corp_jv", label: "Joint-ventures" }, { key: "corp_pact", label: "Pactes d'actionnaires" },
        { key: "corp_gen", label: "Droit des sociétés général" },
      ]},
    ],
  },
  "Venture Capital": {
    sections: [
      { title: "Stade d'intervention", items: [
        { key: "vc_seed", label: "Seed / Amorçage" }, { key: "vc_seriesa", label: "Série A / B" },
        { key: "vc_late", label: "Late stage / Growth" },
      ]},
      { title: "Spécialités", items: [
        { key: "vc_bsa", label: "BSA / BSPCE" }, { key: "vc_sha", label: "Pactes d'associés" },
        { key: "vc_cross", label: "Cross-border" },
      ]},
    ],
  },
  "Financement LBO": {
    sections: [
      { title: "Type de financement", items: [
        { key: "fin_obligataire", label: "Financement obligataire" }, { key: "fin_acq", label: "Financement d'acquisition" },
        { key: "fin_lbo", label: "Financement LBO" }, { key: "fin_immo", label: "Financement immobilier" },
        { key: "fin_actifs", label: "Financement d'actifs" }, { key: "fin_titrisation", label: "Titrisation" },
      ]},
    ],
  },
  "Financement de projets": {
    sections: [
      { title: "Type de financement", items: [
        { key: "finp_infra", label: "Infrastructures" }, { key: "finp_energie", label: "Énergie & ENR" },
        { key: "finp_ppp", label: "PPP / Concessions" }, { key: "finp_export", label: "Crédit export" },
        { key: "finp_immo", label: "Financement immobilier" }, { key: "finp_structuré", label: "Financements structurés" },
      ]},
    ],
  },
  "Droit Social": {
    sections: [
      { title: "Nature de l'activité", items: [
        { key: "conseil", label: "Conseil quotidien" }, { key: "cont", label: "Contentieux prud'homal" },
        { key: "coll", label: "Relations collectives" }, { key: "restr", label: "Restructurations sociales" },
      ]},
      { title: "Spécialités", items: [
        { key: "remun", label: "Rémunération & avantages" }, { key: "mob", label: "Mobilité internationale" },
        { key: "disc", label: "Discrimination & harcèlement" }, { key: "pse", label: "PSE / Plans sociaux" },
      ]},
    ],
  },
  "Immobilier": {
    sections: [
      { title: "Nature des opérations", items: [
        { key: "acqimmo", label: "Acquisitions immobilières" }, { key: "bail", label: "Baux commerciaux" },
        { key: "promo", label: "Promotion immobilière" }, { key: "vefa", label: "VEFA" },
        { key: "urba", label: "Urbanisme" },
      ]},
      { title: "Type d'actifs", items: [
        { key: "bureau", label: "Bureaux" }, { key: "retail", label: "Retail / Commerce" },
        { key: "logi", label: "Logistique" }, { key: "resid", label: "Résidentiel" },
      ]},
    ],
  },
  "Real Estate": {
    sections: [
      { title: "Nature des opérations", items: [
        { key: "acqimmo", label: "Acquisitions immobilières" }, { key: "bail", label: "Baux commerciaux" },
        { key: "promo", label: "Promotion immobilière" }, { key: "vefa", label: "VEFA" },
        { key: "urba", label: "Urbanisme" },
      ]},
      { title: "Type d'actifs", items: [
        { key: "bureau", label: "Bureaux" }, { key: "retail", label: "Retail / Commerce" },
        { key: "logi", label: "Logistique" }, { key: "resid", label: "Résidentiel" },
      ]},
    ],
  },
  "Restructuring": {
    sections: [
      { title: "Répartition de l'activité", items: [
        { key: "restr_restructuring", label: "Restructuring" }, { key: "restr_contentieux", label: "Contentieux" },
      ]},
    ],
  },
};

// Fallback activities for "Autre" or unmapped departments
export const ACTIVITES_DEFAULT: { sections: { title: string; items: ActivityItem[] }[] } = {
  sections: [
    {
      title: "Nature du travail",
      items: [
        { key: "ca", label: "Conseil amiable" },
        { key: "cj", label: "Conseil judiciaire" },
        { key: "cont", label: "Contentieux des affaires" },
        { key: "redac", label: "Rédaction d'actes" },
      ],
    },
    {
      title: "Positionnement",
      items: [
        { key: "instit", label: "Institutionnels" },
        { key: "corp", label: "Entreprises" },
        { key: "part", label: "Particuliers" },
      ],
    },
  ],
};

// Keep old ACTIVITES for backward compatibility
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
  "Qualité des dossiers",
  "Autonomie",
  "Travail d'équipe",
  "Ambiance & culture du cabinet",
  "Formation continue",
  "Exposition internationale",
  "Relation directe avec les clients",
  "Diversité des mandats",
  "Rémunération compétitive",
  "Flexibilité (télétravail)",
  "Perspectives d'évolution",
  "Équilibre vie pro / vie perso",
];

export const AXES = [
  "Rémunération",
  "Équilibre vie pro / vie perso",
  "Qualité du management",
  "Plus d'autonomie",
  "Meilleure communication interne",
  "Montée en compétences",
  "Plus d'exposition client",
  "Environnement international",
  "Davantage de conseil (moins de contentieux)",
  "Davantage de contentieux (moins de conseil)",
  "Culture & valeurs du cabinet",
  "Taille d'équipe adaptée",
  "Perspectives d'évolution",
];

export const NOGO_SUGGESTIONS = [
  "Pas de télétravail possible",
  "Objectif heures facturables > 1 900h",
  "Absence de perspective associé",
  "Management trop vertical",
  "Pas de contact client direct",
  "Environnement trop compétitif",
  "Cabinet trop petit (< 20 avocats)",
  "Pas d'exposition internationale",
  "Rétrocession en dessous du marché",
  "Turnover élevé",
];

export const NATIONALITES = ["Français", "Américain", "Anglais", "Allemand", "Autre"];

export const TIERS = ["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5", "Tier 6", "Firms to Watch"];

export const ANGLAIS_OPTIONS = ["Bilingue", "Courant", "Professionnel", "Notions"];

export const TYPES_CLIENTS = [
  "CAC 40 / SBF 120", "ETI", "PME", "Start-ups / Scale-ups",
  "Fonds d'investissement", "Banques", "Institutionnels", "Particuliers HNWI"
];

export const TAILLE_OPERATIONS = ["Small cap (< 50M€)", "Mid cap (50–500M€)", "Large cap (> 500M€)"];

export const DISPONIBILITES = ["Immédiate", "Préavis 3 mois", "Préavis +3 mois", "Négociable"];

export const RAISONS_BAISSE_RETRO = [
  "Meilleure qualité de vie",
  "Perspectives d'évolution (counsel / associé)",
  "Projet entrepreneurial",
  "Environnement de travail plus stimulant",
  "Meilleur équilibre vie pro / vie perso",
  "Intérêt des dossiers",
];

export const MOIS = [
  { value: 1, label: "Janvier" }, { value: 2, label: "Février" },
  { value: 3, label: "Mars" }, { value: 4, label: "Avril" },
  { value: 5, label: "Mai" }, { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" }, { value: 8, label: "Août" },
  { value: 9, label: "Septembre" }, { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" }, { value: 12, label: "Décembre" },
];

export const ASSOC_ATTENTES = [
  "Accéder à l'association",
  "Développer ma clientèle personnelle",
  "Plus d'autonomie et de responsabilités",
  "Meilleure plateforme internationale",
  "Rémunération plus attractive",
  "Meilleur équilibre vie pro / vie perso",
  "Synergie avec d'autres pratiques",
  "Préparer un projet entrepreneurial",
];

export const ASSOC_CAB_TYPES = [
  "Cabinet US",
  "Cabinet UK",
  "Cabinet français indépendant",
  "Boutique spécialisée",
  "Structure en forte croissance",
  "Grand cabinet généraliste",
];
