export const simplifiedTaxonomyGroups = {
    bacteria: "#FF6B6B",
    archaea: "#9B59B6",
    eukarya: "#2ECC71",
    proteobacteria: "#FF8E8E",
    firmicutes: "#FF4444",
    actinobacteria: "#CC3333",
    cyanobacteria: "#00CED1",
    euryarchaeota: "#8E44AD",
    thaumarchaeota: "#A569BD",
    crenarchaeota: "#7D3C98",
    archaeplastida: "#2ECC71",
    sar_supergroup: "#3498DB",
    excavata: "#F39C12",
    amoebozoa: "#E74C3C",
    opisthokonta: "#E67E22",
    luca: "#FFD700"
  };
  
  export const simplifiedTaxonomyData = {
    "LUCA": {
      period: 3800,
      group: "luca",
      description: "Dernier Ancêtre Commun Universel.",
      structureType: "tree"
    },
    "Bacteria": {
      period: 3500,
      group: "bacteria",
      description: "Domaine des organismes procaryotes avec paroi cellulaire contenant du peptidoglycane.",
      structureType: "tree"
    },
    "Archaea": {
      period: 3400,
      group: "archaea",
      description: "Domaine des organismes procaryotes avec biochimie distincte, souvent dans des environnements extrêmes.",
      structureType: "tree"
    },
    "Eukarya": {
      period: 2100,
      group: "eukarya",
      description: "Domaine des organismes avec noyau et organites membranaires.",
      structureType: "tree"
    },
    "Proteobacteria": {
      period: 2500,
      group: "proteobacteria",
      description: "Plus grande classe de bactéries, incluant E. coli et de nombreuses bactéries pathogènes et symbiotiques.",
      structureType: "fleur"
    },
    "Firmicutes": {
      period: 2200,
      group: "firmicutes",
      description: "Bactéries à Gram positif, incluant Bacillus et Clostridium.",
      structureType: "fleur"
    },
    "Actinobacteria": {
      period: 2000,
      group: "actinobacteria",
      description: "Bactéries filamenteuses, importantes pour la production d'antibiotiques.",
      structureType: "fleur"
    },
    "Cyanobacteria": {
      period: 2400,
      group: "cyanobacteria",
      description: "Bactéries photosynthétiques qui ont produit l'oxygène terrestre.",
      structureType: "fleur"
    },
    "Euryarchaeota": {
      period: 2800,
      group: "euryarchaeota",
      description: "Archées diverses incluant les méthanogènes et les halophiles extrêmes.",
      structureType: "fleur"
    },
    "Thaumarchaeota": {
      period: 2600,
      group: "thaumarchaeota",
      description: "Archées chimio-autotrophes, importantes dans les cycles biogéochimiques.",
      structureType: "fleur"
    },
    "Crenarchaeota": {
      period: 2400,
      group: "crenarchaeota",
      description: "Archées thermophiles et hyperthermophiles, souvent dans les sources chaudes.",
      structureType: "fleur"
    },
    "Archaeplastida": {
      period: 1600,
      group: "archaeplastida",
      description: "Supergroupe incluant les plantes terrestres et les algues vertes et rouges.",
      structureType: "fleur"
    },
    "SAR": {
      period: 1800,
      group: "sar_supergroup",
      description: "Supergroupe très diversifié comprenant de nombreux protistes marins et terrestres.",
      structureType: "fleur"
    },
    "Excavata": {
      period: 1700,
      group: "excavata",
      description: "Supergroupe caractérisé par une rainure de nourrissage excavée.",
      structureType: "fleur"
    },
    "Amoebozoa": {
      period: 1600,
      group: "amoebozoa",
      description: "Supergroupe des amibes lobées et des myxomycètes.",
      structureType: "fleur"
    },
    "Opisthokonta": {
      period: 1500,
      group: "opisthokonta",
      description: "Supergroupe incluant animaux et champignons.",
      structureType: "fleur"
    }
  };
  
  export const simplifiedPhylogeneticRelations = {
    "LUCA": ["Bacteria", "Archaea", "Eukarya"],
    "Bacteria": ["Proteobacteria", "Firmicutes", "Actinobacteria", "Cyanobacteria"],
    "Archaea": ["Euryarchaeota", "Thaumarchaeota", "Crenarchaeota"],
    "Eukarya": ["Archaeplastida", "SAR", "Excavata", "Amoebozoa", "Opisthokonta"],
    "Proteobacteria": [],
    "Firmicutes": [],
    "Actinobacteria": [],
    "Cyanobacteria": [],
    "Euryarchaeota": [],
    "Thaumarchaeota": [],
    "Crenarchaeota": [],
    "Archaeplastida": [],
    "SAR": [],
    "Excavata": [],
    "Amoebozoa": [],
    "Opisthokonta": []
  };
  