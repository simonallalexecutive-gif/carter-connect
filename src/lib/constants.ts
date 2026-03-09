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

// Legal 500 rankings by practice area
// Each practice maps cabinet names to their band ranking for that specific practice
export const LEGAL500_BY_PRACTICE: Record<string, Record<string, { nat: string; band: string }>> = {
  "M&A / Private Equity": {
    "Bredin Prat": { nat: "Français", band: "Band 1" },
    "Darrois Villey Maillot Brochier": { nat: "Français", band: "Band 1" },
    "Cleary Gottlieb Steen & Hamilton": { nat: "Américain", band: "Band 1" },
    "Linklaters": { nat: "Anglais", band: "Band 1" },
    "A&O Shearman": { nat: "Anglais", band: "Band 1" },
    "Latham & Watkins": { nat: "Américain", band: "Band 1" },
    "Gide Loyrette Nouel": { nat: "Français", band: "Band 2" },
    "Freshfields": { nat: "Anglais", band: "Band 2" },
    "Clifford Chance": { nat: "Anglais", band: "Band 2" },
    "Skadden": { nat: "Américain", band: "Band 2" },
    "Sullivan & Cromwell": { nat: "Américain", band: "Band 2" },
    "Willkie Farr & Gallagher": { nat: "Américain", band: "Band 2" },
    "Weil Gotshal & Manges": { nat: "Américain", band: "Band 2" },
    "De Pardieu Brocas Maffei": { nat: "Français", band: "Band 2" },
    "Gibson Dunn": { nat: "Américain", band: "Band 3" },
    "Herbert Smith Freehills": { nat: "Anglais", band: "Band 3" },
    "Hogan Lovells": { nat: "Anglais", band: "Band 3" },
    "August Debouzy": { nat: "Français", band: "Band 3" },
    "BDGS Associés": { nat: "Français", band: "Band 3" },
    "DLA Piper": { nat: "Anglais", band: "Band 4" },
    "CMS Francis Lefebvre": { nat: "Français", band: "Band 4" },
    "Jones Day": { nat: "Américain", band: "Band 4" },
    "Baker McKenzie": { nat: "Américain", band: "Band 4" },
    "Kirkland & Ellis": { nat: "Américain", band: "Band 1" },
  },
  "Banque & Finance": {
    "A&O Shearman": { nat: "Anglais", band: "Band 1" },
    "Clifford Chance": { nat: "Anglais", band: "Band 1" },
    "Linklaters": { nat: "Anglais", band: "Band 1" },
    "Gide Loyrette Nouel": { nat: "Français", band: "Band 1" },
    "White & Case": { nat: "Américain", band: "Band 1" },
    "Freshfields": { nat: "Anglais", band: "Band 2" },
    "Latham & Watkins": { nat: "Américain", band: "Band 2" },
    "Hogan Lovells": { nat: "Anglais", band: "Band 2" },
    "Herbert Smith Freehills": { nat: "Anglais", band: "Band 2" },
    "Mayer Brown": { nat: "Américain", band: "Band 2" },
    "CMS Francis Lefebvre": { nat: "Français", band: "Band 3" },
    "Norton Rose Fulbright": { nat: "Anglais", band: "Band 3" },
    "DLA Piper": { nat: "Anglais", band: "Band 3" },
    "Baker McKenzie": { nat: "Américain", band: "Band 3" },
    "De Pardieu Brocas Maffei": { nat: "Français", band: "Band 3" },
    "Dentons": { nat: "Anglais", band: "Band 4" },
  },
  "Droit Social": {
    "Bredin Prat": { nat: "Français", band: "Band 1" },
    "Capstan Avocats": { nat: "Français", band: "Band 1" },
    "Flichy Grangé Avocats": { nat: "Français", band: "Band 1" },
    "August Debouzy": { nat: "Français", band: "Band 1" },
    "Clifford Chance": { nat: "Anglais", band: "Band 2" },
    "Gide Loyrette Nouel": { nat: "Français", band: "Band 2" },
    "Littler": { nat: "Américain", band: "Band 2" },
    "Latham & Watkins": { nat: "Américain", band: "Band 2" },
    "CMS Francis Lefebvre": { nat: "Français", band: "Band 3" },
    "DLA Piper": { nat: "Anglais", band: "Band 3" },
    "Baker McKenzie": { nat: "Américain", band: "Band 3" },
    "Linklaters": { nat: "Anglais", band: "Band 3" },
    "Herbert Smith Freehills": { nat: "Anglais", band: "Band 3" },
    "Norton Rose Fulbright": { nat: "Anglais", band: "Band 4" },
  },
  "Fiscal": {
    "Bredin Prat": { nat: "Français", band: "Band 1" },
    "CMS Francis Lefebvre": { nat: "Français", band: "Band 1" },
    "Gide Loyrette Nouel": { nat: "Français", band: "Band 1" },
    "Linklaters": { nat: "Anglais", band: "Band 1" },
    "Clifford Chance": { nat: "Anglais", band: "Band 2" },
    "Freshfields": { nat: "Anglais", band: "Band 2" },
    "Skadden": { nat: "Américain", band: "Band 2" },
    "A&O Shearman": { nat: "Anglais", band: "Band 2" },
    "DLA Piper": { nat: "Anglais", band: "Band 3" },
    "Baker McKenzie": { nat: "Américain", band: "Band 3" },
    "Latham & Watkins": { nat: "Américain", band: "Band 3" },
    "Hogan Lovells": { nat: "Anglais", band: "Band 3" },
    "Dentons": { nat: "Anglais", band: "Band 4" },
    "Jones Day": { nat: "Américain", band: "Band 4" },
  },
  "Immobilier": {
    "Gide Loyrette Nouel": { nat: "Français", band: "Band 1" },
    "CMS Francis Lefebvre": { nat: "Français", band: "Band 1" },
    "De Pardieu Brocas Maffei": { nat: "Français", band: "Band 1" },
    "Clifford Chance": { nat: "Anglais", band: "Band 2" },
    "DLA Piper": { nat: "Anglais", band: "Band 2" },
    "Linklaters": { nat: "Anglais", band: "Band 2" },
    "Hogan Lovells": { nat: "Anglais", band: "Band 2" },
    "August Debouzy": { nat: "Français", band: "Band 3" },
    "Dentons": { nat: "Anglais", band: "Band 3" },
    "Baker McKenzie": { nat: "Américain", band: "Band 3" },
    "Norton Rose Fulbright": { nat: "Anglais", band: "Band 3" },
    "Taylor Wessing": { nat: "Anglais", band: "Band 3" },
  },
  "Restructuring": {
    "Weil Gotshal & Manges": { nat: "Américain", band: "Band 1" },
    "Hogan Lovells": { nat: "Anglais", band: "Band 1" },
    "Freshfields": { nat: "Anglais", band: "Band 1" },
    "Bredin Prat": { nat: "Français", band: "Band 1" },
    "Kirkland & Ellis": { nat: "Américain", band: "Band 1" },
    "Clifford Chance": { nat: "Anglais", band: "Band 2" },
    "A&O Shearman": { nat: "Anglais", band: "Band 2" },
    "Latham & Watkins": { nat: "Américain", band: "Band 2" },
    "White & Case": { nat: "Américain", band: "Band 2" },
    "Willkie Farr & Gallagher": { nat: "Américain", band: "Band 2" },
    "De Pardieu Brocas Maffei": { nat: "Français", band: "Band 3" },
    "Linklaters": { nat: "Anglais", band: "Band 3" },
    "BDGS Associés": { nat: "Français", band: "Band 3" },
    "DLA Piper": { nat: "Anglais", band: "Band 4" },
    "CMS Francis Lefebvre": { nat: "Français", band: "Band 4" },
  },
  "Marchés de Capitaux": {
    "Linklaters": { nat: "Anglais", band: "Band 1" },
    "Clifford Chance": { nat: "Anglais", band: "Band 1" },
    "A&O Shearman": { nat: "Anglais", band: "Band 1" },
    "Gide Loyrette Nouel": { nat: "Français", band: "Band 1" },
    "Freshfields": { nat: "Anglais", band: "Band 2" },
    "White & Case": { nat: "Américain", band: "Band 2" },
    "Latham & Watkins": { nat: "Américain", band: "Band 2" },
    "Cleary Gottlieb Steen & Hamilton": { nat: "Américain", band: "Band 2" },
    "Bredin Prat": { nat: "Français", band: "Band 3" },
    "De Pardieu Brocas Maffei": { nat: "Français", band: "Band 3" },
    "Herbert Smith Freehills": { nat: "Anglais", band: "Band 3" },
    "Hogan Lovells": { nat: "Anglais", band: "Band 3" },
  },
  "Arbitrage / Contentieux": {
    "Bredin Prat": { nat: "Français", band: "Band 1" },
    "Freshfields": { nat: "Anglais", band: "Band 1" },
    "White & Case": { nat: "Américain", band: "Band 1" },
    "Cleary Gottlieb Steen & Hamilton": { nat: "Américain", band: "Band 1" },
    "Gide Loyrette Nouel": { nat: "Français", band: "Band 2" },
    "Clifford Chance": { nat: "Anglais", band: "Band 2" },
    "Linklaters": { nat: "Anglais", band: "Band 2" },
    "Darrois Villey Maillot Brochier": { nat: "Français", band: "Band 2" },
    "Latham & Watkins": { nat: "Américain", band: "Band 2" },
    "Herbert Smith Freehills": { nat: "Anglais", band: "Band 3" },
    "DLA Piper": { nat: "Anglais", band: "Band 3" },
    "Hogan Lovells": { nat: "Anglais", band: "Band 3" },
    "August Debouzy": { nat: "Français", band: "Band 3" },
    "Jones Day": { nat: "Américain", band: "Band 4" },
    "Norton Rose Fulbright": { nat: "Anglais", band: "Band 4" },
  },
  "Droit Public": {
    "Gide Loyrette Nouel": { nat: "Français", band: "Band 1" },
    "Bredin Prat": { nat: "Français", band: "Band 1" },
    "August Debouzy": { nat: "Français", band: "Band 2" },
    "De Gaulle Fleurance & Associés": { nat: "Français", band: "Band 2" },
    "Clifford Chance": { nat: "Anglais", band: "Band 2" },
    "CMS Francis Lefebvre": { nat: "Français", band: "Band 3" },
    "DLA Piper": { nat: "Anglais", band: "Band 3" },
    "Linklaters": { nat: "Anglais", band: "Band 3" },
    "Dentons": { nat: "Anglais", band: "Band 4" },
  },
  "Concurrence": {
    "Cleary Gottlieb Steen & Hamilton": { nat: "Américain", band: "Band 1" },
    "Bredin Prat": { nat: "Français", band: "Band 1" },
    "Linklaters": { nat: "Anglais", band: "Band 1" },
    "Freshfields": { nat: "Anglais", band: "Band 2" },
    "Gide Loyrette Nouel": { nat: "Français", band: "Band 2" },
    "Clifford Chance": { nat: "Anglais", band: "Band 2" },
    "Latham & Watkins": { nat: "Américain", band: "Band 2" },
    "A&O Shearman": { nat: "Anglais", band: "Band 3" },
    "DLA Piper": { nat: "Anglais", band: "Band 3" },
    "Baker McKenzie": { nat: "Américain", band: "Band 3" },
    "Herbert Smith Freehills": { nat: "Anglais", band: "Band 3" },
    "Hogan Lovells": { nat: "Anglais", band: "Band 4" },
    "Jones Day": { nat: "Américain", band: "Band 4" },
  },
  "IP / Tech": {
    "Bird & Bird": { nat: "Anglais", band: "Band 1" },
    "August Debouzy": { nat: "Français", band: "Band 1" },
    "Hogan Lovells": { nat: "Anglais", band: "Band 2" },
    "DLA Piper": { nat: "Anglais", band: "Band 2" },
    "Gide Loyrette Nouel": { nat: "Français", band: "Band 2" },
    "Clifford Chance": { nat: "Anglais", band: "Band 2" },
    "Freshfields": { nat: "Anglais", band: "Band 3" },
    "Linklaters": { nat: "Anglais", band: "Band 3" },
    "Baker McKenzie": { nat: "Américain", band: "Band 3" },
    "CMS Francis Lefebvre": { nat: "Français", band: "Band 3" },
    "Osborne Clarke": { nat: "Anglais", band: "Band 3" },
    "Dentons": { nat: "Anglais", band: "Band 4" },
    "Taylor Wessing": { nat: "Anglais", band: "Band 4" },
  },
};

// Activities specific to each practice area
export const ACTIVITES_BY_PRACTICE: Record<string, { sections: { title: string; items: { key: string; label: string }[] }[] }> = {
  "M&A / Private Equity": {
    sections: [
      {
        title: "Nature des opérations",
        items: [
          { key: "acq", label: "Acquisitions" },
          { key: "cess", label: "Cessions" },
          { key: "lbo", label: "LBO / Leveraged Buy-Out" },
          { key: "jv", label: "Joint-ventures" },
          { key: "reorg", label: "Réorganisations" },
        ],
      },
      {
        title: "Positionnement",
        items: [
          { key: "sell", label: "Côté vendeur" },
          { key: "buy", label: "Côté acquéreur" },
          { key: "fonds", label: "Côté fonds" },
          { key: "mgt", label: "Côté management" },
        ],
      },
      {
        title: "Taille des opérations",
        items: [
          { key: "sm", label: "Small cap (< 50M€)" },
          { key: "mid", label: "Mid cap (50-500M€)" },
          { key: "lg", label: "Large cap (> 500M€)" },
        ],
      },
    ],
  },
  "Banque & Finance": {
    sections: [
      {
        title: "Type de financement",
        items: [
          { key: "acqfin", label: "Financements d'acquisition" },
          { key: "projfin", label: "Financements de projet" },
          { key: "struc", label: "Financements structurés" },
          { key: "immo", label: "Financements immobiliers" },
          { key: "titr", label: "Titrisation" },
        ],
      },
      {
        title: "Positionnement",
        items: [
          { key: "pret", label: "Côté prêteur" },
          { key: "empr", label: "Côté emprunteur" },
          { key: "agent", label: "Côté agent" },
        ],
      },
      {
        title: "Réglementaire",
        items: [
          { key: "reg", label: "Réglementaire bancaire" },
          { key: "conf", label: "Conformité / Compliance" },
        ],
      },
    ],
  },
  "Droit Social": {
    sections: [
      {
        title: "Nature de l'activité",
        items: [
          { key: "conseil", label: "Conseil quotidien" },
          { key: "cont", label: "Contentieux prud'homal" },
          { key: "coll", label: "Relations collectives" },
          { key: "restr", label: "Restructurations sociales" },
        ],
      },
      {
        title: "Spécialités",
        items: [
          { key: "remun", label: "Rémunération & avantages" },
          { key: "mob", label: "Mobilité internationale" },
          { key: "disc", label: "Discrimination & harcèlement" },
          { key: "pse", label: "PSE / Plans sociaux" },
        ],
      },
    ],
  },
  "Fiscal": {
    sections: [
      {
        title: "Nature de l'activité",
        items: [
          { key: "direct", label: "Fiscalité directe" },
          { key: "indirect", label: "Fiscalité indirecte (TVA)" },
          { key: "inter", label: "Fiscalité internationale" },
          { key: "transac", label: "Fiscalité transactionnelle" },
        ],
      },
      {
        title: "Spécialités",
        items: [
          { key: "patrimoine", label: "Gestion de patrimoine" },
          { key: "prixtr", label: "Prix de transfert" },
          { key: "contentieux", label: "Contentieux fiscal" },
          { key: "restructfiscal", label: "Restructurations fiscales" },
        ],
      },
    ],
  },
  "Immobilier": {
    sections: [
      {
        title: "Nature des opérations",
        items: [
          { key: "acqimmo", label: "Acquisitions immobilières" },
          { key: "bail", label: "Baux commerciaux" },
          { key: "promo", label: "Promotion immobilière" },
          { key: "vefa", label: "VEFA" },
          { key: "urba", label: "Urbanisme" },
        ],
      },
      {
        title: "Type d'actifs",
        items: [
          { key: "bureau", label: "Bureaux" },
          { key: "retail", label: "Retail / Commerce" },
          { key: "logi", label: "Logistique" },
          { key: "resid", label: "Résidentiel" },
        ],
      },
    ],
  },
  "Restructuring": {
    sections: [
      {
        title: "Nature du travail",
        items: [
          { key: "ca", label: "Conseil amiable" },
          { key: "cj", label: "Conseil judiciaire" },
          { key: "cont", label: "Contentieux des affaires" },
          { key: "pc", label: "Procédures collectives" },
        ],
      },
      {
        title: "Positionnement",
        items: [
          { key: "deb", label: "Côté débiteur" },
          { key: "cre", label: "Côté créancier" },
        ],
      },
      {
        title: "Opérations",
        items: [
          { key: "rf", label: "Restructuration financière" },
          { key: "rb", label: "Reprise à la barre" },
          { key: "dm", label: "Distressed M&A" },
        ],
      },
    ],
  },
  "Marchés de Capitaux": {
    sections: [
      {
        title: "Type d'opérations",
        items: [
          { key: "ipo", label: "Introductions en bourse (IPO)" },
          { key: "aug", label: "Augmentations de capital" },
          { key: "oblig", label: "Émissions obligataires" },
          { key: "derive", label: "Produits dérivés" },
        ],
      },
      {
        title: "Réglementaire",
        items: [
          { key: "regamf", label: "Réglementation AMF" },
          { key: "opa", label: "OPA / Offres publiques" },
          { key: "compliance", label: "Compliance boursière" },
        ],
      },
    ],
  },
  "Arbitrage / Contentieux": {
    sections: [
      {
        title: "Type de contentieux",
        items: [
          { key: "arb", label: "Arbitrage international" },
          { key: "arbdom", label: "Arbitrage domestique" },
          { key: "contcom", label: "Contentieux commercial" },
          { key: "penal", label: "Pénal des affaires" },
        ],
      },
      {
        title: "Spécialités",
        items: [
          { key: "invest", label: "Investissements internationaux" },
          { key: "construc", label: "Construction" },
          { key: "energie", label: "Énergie" },
          { key: "postma", label: "Contentieux post-M&A" },
        ],
      },
    ],
  },
  "Droit Public": {
    sections: [
      {
        title: "Domaines",
        items: [
          { key: "marches", label: "Marchés publics" },
          { key: "dsp", label: "DSP / Concessions" },
          { key: "enviro", label: "Environnement" },
          { key: "regpub", label: "Régulation" },
        ],
      },
      {
        title: "Contentieux",
        items: [
          { key: "contadm", label: "Contentieux administratif" },
          { key: "constit", label: "Droit constitutionnel" },
          { key: "europub", label: "Droit européen public" },
        ],
      },
    ],
  },
  "Concurrence": {
    sections: [
      {
        title: "Domaines",
        items: [
          { key: "fusion", label: "Contrôle des concentrations" },
          { key: "antitrust", label: "Pratiques anticoncurrentielles" },
          { key: "abus", label: "Abus de position dominante" },
          { key: "aidesetat", label: "Aides d'État" },
        ],
      },
      {
        title: "Contentieux",
        items: [
          { key: "contconc", label: "Contentieux concurrence" },
          { key: "dawn", label: "Dawn raids / Perquisitions" },
          { key: "distrib", label: "Distribution" },
        ],
      },
    ],
  },
  "IP / Tech": {
    sections: [
      {
        title: "Domaines",
        items: [
          { key: "brevets", label: "Brevets" },
          { key: "marques", label: "Marques" },
          { key: "da", label: "Droit d'auteur" },
          { key: "data", label: "Protection des données (RGPD)" },
        ],
      },
      {
        title: "Tech & Digital",
        items: [
          { key: "contrats", label: "Contrats IT" },
          { key: "ecom", label: "E-commerce" },
          { key: "ia", label: "Intelligence artificielle" },
          { key: "fintech", label: "Fintech / Blockchain" },
        ],
      },
    ],
  },
};

// Fallback activities for "Autre" or unmapped departments
export const ACTIVITES_DEFAULT = {
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

export const TIERS = ["Band 1", "Band 2", "Band 3", "Band 4"];

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
