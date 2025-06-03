// Classification phylogénétique moderne basée sur les dernières recherches (2024)
// Système à 3 domaines de Woese avec supergroups eucaryotes mis à jour

// Groupes taxonomiques avec couleurs distinctives
export const taxonomyGroups = {
  // Domaine Bacteria
  bacteria: "#FF6B6B",           // Rouge
  proteobacteria: "#FF8E8E",
  firmicutes: "#FF4444",
  actinobacteria: "#CC3333",
  cyanobacteria: "#00CED1",      // Bleu-vert (photosynthèse)

  // Domaine Archaea
  archaea: "#9B59B6",            // Violet
  euryarchaeota: "#8E44AD",
  thaumarchaeota: "#A569BD",
  crenarchaeota: "#7D3C98",

  // Domaine Eukarya - Supergroups modernes
  archaeplastida: "#2ECC71",     // Vert (plantes et algues vertes)
  sar_supergroup: "#3498DB",     // Bleu (SAR: Stramenopiles, Alveolates, Rhizaria)
  excavata: "#F39C12",           // Orange
  amoebozoa: "#E74C3C",          // Rouge-orange
  opisthokonta: "#E67E22",       // Orange foncé (animaux et champignons)

  // Sous-groupes d'Opisthokonta
  animals: "#D35400",            // Orange foncé
  fungi: "#A0522D",              // Brun

  // Sous-groupes d'Archaeplastida
  land_plants: "#27AE60",        // Vert foncé
  green_algae: "#52C673",        // Vert clair
  red_algae: "#E74C3C",          // Rouge

  // Sous-groupes de SAR
  stramenopiles: "#2980B9",      // Bleu foncé
  alveolates: "#5DADE2",         // Bleu clair
  rhizaria: "#85C1E9",           // Bleu très clair

  // Racine
  luca: "#FFD700"                // Or
};

// Données taxonomiques avec informations phylogénétiques modernes
export const taxonomyData = {
  // Racine universelle
  "LUCA": {
    period: 3800,
    group: "luca",
    description: "Dernier Ancêtre Commun Universel. Organisme hypothétique dont descendent tous les êtres vivants actuels."
  },

  // DOMAINE BACTERIA
  "Bacteria": {
    period: 3500,
    group: "bacteria",
    description: "Domaine des organismes procaryotes avec paroi cellulaire contenant du peptidoglycane."
  },
  "Proteobacteria": {
    period: 2500,
    group: "proteobacteria",
    description: "Plus grande classe de bactéries, incluant E. coli et de nombreuses bactéries pathogènes et symbiotiques."
  },
  "Cyanobacteria": {
    period: 2400,
    group: "cyanobacteria",
    description: "Bactéries photosynthétiques qui ont produit l'oxygène terrestre et donné naissance aux chloroplastes."
  },
  "Firmicutes": {
    period: 2200,
    group: "firmicutes",
    description: "Bactéries à Gram positif, incluant Bacillus et Clostridium."
  },
  "Actinobacteria": {
    period: 2000,
    group: "actinobacteria",
    description: "Bactéries filamenteuses, importantes pour la production d'antibiotiques."
  },

  // DOMAINE ARCHAEA
  "Archaea": {
    period: 3400,
    group: "archaea",
    description: "Domaine des organismes procaryotes avec biochimie distincte, souvent dans des environnements extrêmes."
  },
  "Euryarchaeota": {
    period: 2800,
    group: "euryarchaeota",
    description: "Archées diverses incluant les méthanogènes et les halophiles extrêmes."
  },
  "Thaumarchaeota": {
    period: 2600,
    group: "thaumarchaeota",
    description: "Archées chimio-autotrophes, importantes dans les cycles biogéochimiques."
  },
  "Crenarchaeota": {
    period: 2400,
    group: "crenarchaeota",
    description: "Archées thermophiles et hyperthermophiles, souvent dans les sources chaudes."
  },

  // DOMAINE EUKARYA - Organisation moderne en supergroups
  "Eukarya": {
    period: 2100,
    group: "archaeplastida",
    description: "Domaine des organismes avec noyau et organites membranaires."
  },

  // SUPERGROUP ARCHAEPLASTIDA (Plantes et algues apparentées)
  "Archaeplastida": {
    period: 1600,
    group: "archaeplastida",
    description: "Supergroupe incluant les plantes terrestres et les algues vertes et rouges, avec chloroplastes primaires."
  },
  "Plantae": {
    period: 470,
    group: "land_plants",
    description: "Plantes terrestres avec alternance de générations et adaptations à la vie terrestre."
  },
  "Charophytes": {
    period: 500,
    group: "green_algae",
    description: "Algues vertes sœurs des plantes terrestres, vivant en eau douce."
  },
  "Rhodophyta": {
    period: 1200,
    group: "red_algae",
    description: "Algues rouges avec pigments phycoérythrine, souvent marines."
  },

  // SUPERGROUP SAR (Stramenopiles, Alveolates, Rhizaria)
  "SAR": {
    period: 1800,
    group: "sar_supergroup",
    description: "Supergroupe très diversifié comprenant de nombreux protistes marins et terrestres."
  },
  "Stramenopiles": {
    period: 1400,
    group: "stramenopiles",
    description: "Organismes avec flagelles à poils (mastigonèmes), incluant diatomées et algues brunes."
  },
  "Alveolates": {
    period: 1500,
    group: "alveolates",
    description: "Organismes avec alvéoles sous-membranaires, incluant ciliés, dinoflagellés et apicomplexa."
  },
  "Rhizaria": {
    period: 1300,
    group: "rhizaria",
    description: "Organismes amiboïdes avec pseudopodes fins, souvent avec tests élaborés."
  },

  // SUPERGROUP EXCAVATA
  "Excavata": {
    period: 1700,
    group: "excavata",
    description: "Supergroupe caractérisé par une rainure de nourrissage excavée."
  },
  "Euglenozoa": {
    period: 1000,
    group: "excavata",
    description: "Incluant les euglènes photosynthétiques et les trypanosomes parasites."
  },
  "Metamonada": {
    period: 1200,
    group: "excavata",
    description: "Protistes souvent anaérobies, incluant Giardia et les trichomonades."
  },

  // SUPERGROUP AMOEBOZOA
  "Amoebozoa": {
    period: 1600,
    group: "amoebozoa",
    description: "Supergroupe des amibes lobées et des myxomycètes."
  },
  "Tubulinea": {
    period: 800,
    group: "amoebozoa",
    description: "Amibes avec pseudopodes tubulaires, incluant Amoeba proteus."
  },

  // SUPERGROUP OPISTHOKONTA (Animaux + Champignons)
  "Opisthokonta": {
    period: 1500,
    group: "opisthokonta",
    description: "Supergroupe incluant animaux et champignons, caractérisé par un flagelle postérieur unique."
  },

  // Sous-groupe Animals (Metazoa)
  "Metazoa": {
    period: 800,
    group: "animals",
    description: "Animaux multicellulaires avec différenciation cellulaire et tissus."
  },
  "Porifera": {
    period: 600,
    group: "animals",
    description: "Éponges, animaux les plus basaux avec organisation cellulaire simple."
  },
  "Cnidaria": {
    period: 580,
    group: "animals",
    description: "Cnidaires avec cnidocytes, incluant méduses, coraux et anémones."
  },
  "Bilateria": {
    period: 550,
    group: "animals",
    description: "Animaux à symétrie bilatérale avec trois feuillets embryonnaires."
  },
  "Deuterostomia": {
    period: 520,
    group: "animals",
    description: "Deutérostomiens incluant échinodermes et chordés."
  },
  "Chordata": {
    period: 500,
    group: "animals",
    description: "Chordés avec notochorde, incluant vertébrés et céphalochordés."
  },
  "Vertebrata": {
    period: 480,
    group: "animals",
    description: "Vertébrés avec colonne vertébrale et crâne."
  },
  "Mammalia": {
    period: 200,
    group: "animals",
    description: "Mammifères avec poils et glandes mammaires."
  },
  "Primates": {
    period: 65,
    group: "animals",
    description: "Primates avec vision binoculaire et mains préhensiles."
  },
  "Homo": {
    period: 3,
    group: "animals",
    description: "Genre Homo incluant l'espèce humaine actuelle."
  },

  // Sous-groupe Fungi
  "Fungi": {
    period: 1000,
    group: "fungi",
    description: "Champignons hétérotrophes avec paroi cellulaire chitineuse."
  },
  "Chytridiomycota": {
    period: 700,
    group: "fungi",
    description: "Champignons aquatiques primitifs avec flagelles."
  },
  "Ascomycota": {
    period: 400,
    group: "fungi",
    description: "Champignons à asques, incluant levures et truffes."
  },
  "Basidiomycota": {
    period: 300,
    group: "fungi",
    description: "Champignons à basides, incluant les champignons à chapeaux."
  }
};

// Relations phylogénétiques modernes basées sur la phylogénomique
export const phylogeneticRelations = {
  "LUCA": ["Bacteria", "Archaea", "Eukarya"],

  // Domaine Bacteria
  "Bacteria": ["Proteobacteria", "Cyanobacteria", "Firmicutes", "Actinobacteria"],
  "Proteobacteria": [],
  "Cyanobacteria": [],
  "Firmicutes": [],
  "Actinobacteria": [],

  // Domaine Archaea
  "Archaea": ["Euryarchaeota", "Thaumarchaeota", "Crenarchaeota"],
  "Euryarchaeota": [],
  "Thaumarchaeota": [],
  "Crenarchaeota": [],

  // Domaine Eukarya - Structure moderne
  "Eukarya": ["Archaeplastida", "SAR", "Excavata", "Amoebozoa", "Opisthokonta"],

  // Supergroup Archaeplastida
  "Archaeplastida": ["Rhodophyta", "Charophytes", "Plantae"],
  "Rhodophyta": [],
  "Charophytes": [],
  "Plantae": [],

  // Supergroup SAR
  "SAR": ["Stramenopiles", "Alveolates", "Rhizaria"],
  "Stramenopiles": [],
  "Alveolates": [],
  "Rhizaria": [],

  // Supergroup Excavata
  "Excavata": ["Euglenozoa", "Metamonada"],
  "Euglenozoa": [],
  "Metamonada": [],

  // Supergroup Amoebozoa
  "Amoebozoa": ["Tubulinea"],
  "Tubulinea": [],

  // Supergroup Opisthokonta
  "Opisthokonta": ["Metazoa", "Fungi"],

  // Métazoaires
  "Metazoa": ["Porifera", "Cnidaria", "Bilateria"],
  "Porifera": [],
  "Cnidaria": [],
"Bilateria": ["Protostomia", "Deuterostomia"],
"Protostomia": ["Ecdysozoa", "Spiralia"],
"Ecdysozoa": ["Arthropoda", "Nematoda"],
"Spiralia": ["Mollusca", "Annelida"],
"Deuterostomia": ["Echinodermata", "Chordata"],
"Chordata": ["Cephalochordata", "Vertebrata"],
"Vertebrata": ["Mammalia"],
"Mammalia": ["Primates"],
"Primates": ["Homo"],
"Homo": [],


  // Champignons
  "Fungi": ["Chytridiomycota", "Ascomycota", "Basidiomycota"],
  "Chytridiomycota": [],
  "Ascomycota": [],
  "Basidiomycota": []
};

// Informations supplémentaires sur les caractères dérivés partagés
export const synapomorphies = {
  "Eukarya": ["Noyau membranaire", "Organites membranaires", "Cytosquelette d'actine"],
  "Archaeplastida": ["Chloroplastes primaires", "Amidon stocké dans les chloroplastes"],
  "SAR": ["Souvent avec chloroplastes secondaires", "Diversité morphologique extrême"],
  "Opisthokonta": ["Flagelle postérieur unique", "Gène de la chitin synthase"],
  "Metazoa": ["Multicellularité avec différenciation", "Collagène", "Gènes Hox"],
  "Fungi": ["Paroi cellulaire chitineuse", "Nutrition par absorption"],
  "Vertebrata": ["Colonne vertébrale", "Crâne", "Système nerveux centralisé"]
};

export default {
  taxonomyData,
  taxonomyGroups,
  phylogeneticRelations,
  synapomorphies
};
