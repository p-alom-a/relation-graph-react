// Classification phylogénétique moderne basée sur les dernières recherches (2024)
// Système à 3 domaines de Woese avec supergroups eucaryotes mis à jour

export const STRUCTURE_TYPES = {
  TREE: 'TREE',
  LINEAR: 'LINEAR',
  RADIAL: 'RADIAL',
  ETAMINE: 'ETAMINE'
};

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
  
  // Domaine Eukarya
  eukarya: "#2ECC71",            // Vert
  archaeplastida: "#27AE60",     // Vert foncé
  sar_supergroup: "#3498DB",     // Bleu (SAR: Stramenopiles, Alveolates, Rhizaria)
  excavata: "#F39C12",           // Orange
  amoebozoa: "#E74C3C",          // Rouge-orange
  opisthokonta: "#E67E22",       // Orange foncé (animaux et champignons)
  
  // Sous-groupes d'Opisthokonta
  animals: "#D35400",            // Orange foncé
  fungi: "#A0522D",              // Brun
  
  // Sous-groupes d'Archaeplastida
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
    description: "Dernier Ancêtre Commun Universel. Organisme hypothétique dont descendent tous les êtres vivants actuels.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 10
  },

  // DOMAINE BACTERIA
  "Bacteria": {
    period: 3500,
    group: "bacteria",
    description: "Domaine des organismes procaryotes avec paroi cellulaire contenant du peptidoglycane.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 9
  },
  "Proteobacteria": {
    period: 2500,
    group: "proteobacteria", 
    description: "Plus grande classe de bactéries, incluant E. coli et de nombreuses bactéries pathogènes et symbiotiques.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 8
  },
  "Cyanobacteria": {
    period: 2400,
    group: "cyanobacteria",
    description: "Bactéries photosynthétiques qui ont produit l'oxygène terrestre et donné naissance aux chloroplastes.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 8
  },
  "Firmicutes": {
    period: 2200,
    group: "firmicutes",
    description: "Bactéries à Gram positif, incluant Bacillus et Clostridium.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 7
  },
  "Actinobacteria": {
    period: 2000,
    group: "actinobacteria",
    description: "Bactéries filamenteuses, importantes pour la production d'antibiotiques.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 7
  },

  // DOMAINE ARCHAEA
  "Archaea": {
    period: 3400,
    group: "archaea",
    description: "Domaine des organismes procaryotes avec biochimie distincte, souvent dans des environnements extrêmes.",
    structureType: STRUCTURE_TYPES.ETAMINE,
    importance: 9
  },
  "Euryarchaeota": {
    period: 2800,
    group: "euryarchaeota",
    description: "Archées diverses incluant les méthanogènes et les halophiles extrêmes.",
    structureType: STRUCTURE_TYPES.ETAMINE,
    importance: 8
  },
  "Thaumarchaeota": {
    period: 2600,
    group: "thaumarchaeota", 
    description: "Archées chimio-autotrophes, importantes dans les cycles biogéochimiques.",
    structureType: STRUCTURE_TYPES.ETAMINE,
    importance: 7
  },
  "Crenarchaeota": {
    period: 2400,
    group: "crenarchaeota",
    description: "Archées thermophiles et hyperthermophiles, souvent dans les sources chaudes.",
    structureType: STRUCTURE_TYPES.ETAMINE,
    importance: 7
  },

  // DOMAINE EUKARYA - Organisation moderne en supergroups
  "Eukarya": {
    period: 2100,
    group: "eukarya",
    description: "Domaine des organismes avec noyau et organites membranaires.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 8
  },

  // SUPERGROUP ARCHAEPLASTIDA (Plantes et algues apparentées)
  "Archaeplastida": {
    period: 1600,
    group: "archaeplastida",
    description: "Supergroupe incluant les plantes terrestres et les algues vertes et rouges, avec chloroplastes primaires.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 7
  },
  "Plantae": {
    period: 470,
    group: "land_plants",
    description: "Plantes terrestres avec alternance de générations et adaptations à la vie terrestre.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 6
  },
  "Charophytes": {
    period: 500,
    group: "green_algae",
    description: "Algues vertes sœurs des plantes terrestres, vivant en eau douce.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 5
  }, 
  "Rhodophyta": {
    period: 1200,
    group: "red_algae",
    description: "Algues rouges avec pigments phycoérythrine, souvent marines.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 5
  },

  // SUPERGROUP SAR (Stramenopiles, Alveolates, Rhizaria)
  "SAR": {
    period: 1800,
    group: "sar_supergroup",
    description: "Supergroupe très diversifié comprenant de nombreux protistes marins et terrestres.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 7
  },
  "Stramenopiles": {
    period: 1400,
    group: "stramenopiles",
    description: "Organismes avec flagelles à poils (mastigonèmes), incluant diatomées et algues brunes.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 6
  },
  "Alveolates": {
    period: 1500,
    group: "alveolates", 
    description: "Organismes avec alvéoles sous-membranaires, incluant ciliés, dinoflagellés et apicomplexa.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 6
  },
  "Rhizaria": {
    period: 1300,
    group: "rhizaria",
    description: "Organismes amiboïdes avec pseudopodes fins, souvent avec tests élaborés.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 6
  },

  // SUPERGROUP EXCAVATA
  "Excavata": {
    period: 1700,
    group: "excavata",
    description: "Supergroupe caractérisé par une rainure de nourrissage excavée.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 7
  },
  "Euglenozoa": {
    period: 1000,
    group: "excavata",
    description: "Incluant les euglènes photosynthétiques et les trypanosomes parasites.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 6
  },
  "Metamonada": {
    period: 1200,
    group: "excavata", 
    description: "Protistes souvent anaérobies, incluant Giardia et les trichomonades.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 6
  },

  // SUPERGROUP AMOEBOZOA
  "Amoebozoa": {
    period: 1600,
    group: "amoebozoa",
    description: "Supergroupe des amibes lobées et des myxomycètes.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 7
  },
  "Tubulinea": {
    period: 800,
    group: "amoebozoa",
    description: "Amibes avec pseudopodes tubulaires, incluant Amoeba proteus.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 6
  },

  // SUPERGROUP OPISTHOKONTA (Animaux + Champignons)
  "Opisthokonta": {
    period: 1500,
    group: "opisthokonta",
    description: "Supergroupe incluant animaux et champignons, caractérisé par un flagelle postérieur unique.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 7
  },
  
  // Sous-groupe Animals (Metazoa)
  "Metazoa": {
    period: 800,
    group: "animals",
    description: "Animaux multicellulaires avec différenciation cellulaire et tissus.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 6
  },
  "Porifera": {
    period: 600,
    group: "animals",
    description: "Éponges, animaux les plus basaux avec organisation cellulaire simple.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 5
  },
  "Cnidaria": {
    period: 580,
    group: "animals",
    description: "Cnidaires avec cnidocytes, incluant méduses, coraux et anémones.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 5
  },
  "Bilateria": {
    period: 550,
    group: "animals",
    description: "Animaux à symétrie bilatérale avec trois feuillets embryonnaires.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 5
  },
  "Deuterostomia": {
    period: 520,
    group: "animals",
    description: "Deutérostomiens incluant échinodermes et chordés.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 4
  },
  "Chordata": {
    period: 500,
    group: "animals",
    description: "Chordés avec notochorde, incluant vertébrés et céphalochordés.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 3
  },
  "Vertebrata": {
    period: 480,
    group: "animals",
    description: "Vertébrés avec colonne vertébrale et crâne.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 2
  },
  "Mammalia": {
    period: 200,
    group: "animals",
    description: "Mammifères avec poils et glandes mammaires.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 1
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
    description: "Champignons hétérotrophes avec paroi cellulaire chitineuse.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 5
  },
  "Chytridiomycota": {
    period: 700,
    group: "fungi",
    description: "Champignons aquatiques primitifs avec flagelles."
  },
  "Ascomycota": {
    period: 400,
    group: "fungi",
    description: "Champignons à asques, incluant levures et truffes.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 3
  },
  "Basidiomycota": {
    period: 300,
    group: "fungi",
    description: "Champignons à basides, incluant les champignons à chapeaux.",
    structureType: STRUCTURE_TYPES.TREE,
    importance: 3
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
  "Bilateria": ["Deuterostomia"],
  "Deuterostomia": ["Chordata"],
  "Chordata": ["Vertebrata"],
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

export const PERIODS = {
  ARCHEAN_LATE: 3500,
  PROTEROZOIC_EARLY: 2500,
  PROTEROZOIC_MIDDLE: 1600,
  PROTEROZOIC_LATE: 1000,
  CAMBRIAN: 541,
  ORDOVICIAN: 485,
  SILURIAN: 443,
  DEVONIAN: 419,
  CARBONIFEROUS: 359,
  PERMIAN: 299,
  TRIASSIC: 252,
  JURASSIC: 201,
  CRETACEOUS: 145,
  PALEOGENE: 66,
  NEOGENE: 23,
  QUATERNARY: 2.6
};

export default {
  taxonomyData,
  taxonomyGroups, 
  phylogeneticRelations,
  synapomorphies,
  PERIODS,
  STRUCTURE_TYPES
};