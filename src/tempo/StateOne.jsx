import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Center, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useControls } from 'leva';
import './App.css';
import { createStructure, applyRepulsion } from './utils/treeStructure.jsx';

// Données taxonomiques avec descriptions et périodes
const taxonomyData = {
  "LUCA": {
    description: "Dernier ancêtre commun universel (Last Universal Common Ancestor), l'organisme hypothétique dont tous les êtres vivants actuels descendent.",
    period: 3700,
    group: "origin"
  },
  "Archaea": {
    description: "Micro-organismes unicellulaires procaryotes distincts des bactéries, souvent trouvés dans des environnements extrêmes.",
    period: 3500,
    group: "unicellular"
  },
  "Bacteria": {
    description: "Micro-organismes unicellulaires procaryotes formant l'un des trois grands domaines du vivant.",
    period: 3500,
    group: "bacteria"
  },
  "Cyanobacteria": {
    description: "Bactéries photosynthétiques productrices d'oxygène, à l'origine de l'atmosphère terrestre actuelle.",
    period: 2500,
    group: "bacteria"
  },
  "Proteobacteria": {
    description: "Groupe le plus diversifié de bactéries, incluant E. coli et de nombreux pathogènes.",
    period: 2000,
    group: "bacteria"
  },
  "Firmicutes": {
    description: "Bactéries à paroi cellulaire épaisse, incluant les lactobacilles et streptocoques.",
    period: 1800,
    group: "bacteria"
  },
  "Actinobacteria": {
    description: "Bactéries filamenteuses, incluant les mycobactéries et streptomyces.",
    period: 1600,
    group: "bacteria"
  },
  "Bacteroidetes": {
    description: "Bactéries anaérobies importantes dans la digestion, présentes dans l'intestin.",
    period: 1400,
    group: "bacteria"
  },
  "Spirochaetes": {
    description: "Bactéries spiralées mobiles, incluant les agents de la syphilis et de Lyme.",
    period: 1200,
    group: "bacteria"
  },
  "Escherichia": {
    description: "Genre incluant E. coli, bactérie modèle de la recherche et parfois pathogène.",
    period: 300,
    group: "bacteria"
  },
  "Streptococcus": {
    description: "Bactéries sphériques en chaînes, certaines pathogènes, d'autres utilisées en fermentation.",
    period: 250,
    group: "bacteria"
  },
  "Lactobacillus": {
    description: "Bactéries lactiques utilisées dans la fermentation du yaourt et de la choucroute.",
    period: 200,
    group: "bacteria"
  },
  "Mycobacterium": {
    description: "Bactéries à paroi cireuse, incluant les agents de la tuberculose et de la lèpre.",
    period: 150,
    group: "bacteria"
  },
  "Eukarya": {
    description: "Domaine regroupant tous les organismes dont les cellules possèdent un noyau et des organites.",
    period: 2100,
    group: "unicellular"
  },
  "Protozoa": {
    description: "Regroupement fonctionnel d'organismes unicellulaires eucaryotes. Les protozoaires ne forment pas un groupe monophylétique mais représentent divers lignages eucaryotes unicellulaires.",
    period: 1800,
    group: "protozoa"
  },
  "Amoebozoa": {
    description: "Protozoaires se déplaçant par pseudopodes, incluant les amibes et myxomycètes.",
    period: 1200,
    group: "protozoa"
  },
  "Excavata": {
    description: "Super-groupe eucaryote caractérisé par une excavation ventrale distinctive. Sa datation précise reste spéculative.",
    period: 1300,
    group: "protozoa"
  },
  "SAR": {
    description: "Super-groupe eucaryote incluant Stramenopiles, Alveolata et Rhizaria. Ce groupe est monophylétique mais sa datation précise reste spéculative.",
    period: 1400,
    group: "protozoa"
  },
  "Ciliophora": {
    description: "Protozoaires ciliés comme les paramécies, avec des cils pour la locomotion.",
    period: 800,
    group: "protozoa"
  },
  "Apicomplexa": {
    description: "Protozoaires parasites incluant Plasmodium (paludisme) et Toxoplasma.",
    period: 700,
    group: "protozoa"
  },
  "Dinoflagellata": {
    description: "Protozoaires flagellés marins, certains bioluminescents ou toxiques.",
    period: 600,
    group: "protozoa"
  },
  "Euglenozoa": {
    description: "Protozoaires flagellés incluant les euglènes et trypanosomes.",
    period: 900,
    group: "protozoa"
  },
  "Foraminifera": {
    description: "Protozoaires marins à coquille calcaire, importants dans les sédiments océaniques.",
    period: 500,
    group: "protozoa"
  },
  "Radiolaria": {
    description: "Protozoaires marins planctoniques avec squelette siliceux complexe.",
    period: 450,
    group: "protozoa"
  },
  "Paramecium": {
    description: "Genre de protozoaires ciliés en forme de pantoufle, modèle d'étude classique.",
    period: 200,
    group: "protozoa"
  },
  "Amoeba": {
    description: "Genre d'amibes libres se déplaçant par pseudopodes.",
    period: 300,
    group: "protozoa"
  },
  "Plasmodium": {
    description: "Genre de protozoaires parasites causant le paludisme chez l'humain.",
    period: 150,
    group: "protozoa"
  },
  "Trypanosoma": {
    description: "Genre de protozoaires flagellés causant la maladie du sommeil.",
    period: 180,
    group: "protozoa"
  },
  "Plantae": {
    description: "Organismes eucaryotes pluricellulaires qui réalisent la photosynthèse grâce à la chlorophylle.",
    period: 1200,
    group: "plants"
  },
  "Bryophyta": {
    description: "Mousses, plantes non-vasculaires formant des tapis verts dans les milieux humides.",
    period: 450,
    group: "plants"
  },
  "Marchantiophyta": {
    description: "Hépatiques, plantes non-vasculaires ressemblant à des feuilles plates.",
    period: 440,
    group: "plants"
  },
  "Anthocerotophyta": {
    description: "Anthocérotes, petites plantes non-vasculaires à thalle simple.",
    period: 430,
    group: "plants"
  },
  "Lycopodiophyta": {
    description: "Lycopodes, plantes vasculaires primitives avec des microphylles.",
    period: 400,
    group: "plants"
  },
  "Pteridophyta": {
    description: "Fougères, plantes vasculaires sans graines se reproduisant par spores.",
    period: 380,
    group: "plants"
  },
  "Gymnospermae": {
    description: "Plantes à graines nues, incluant les conifères et les cycas.",
    period: 300,
    group: "plants"
  },
  "Angiospermae": {
    description: "Plantes à fleurs, le groupe le plus diversifié de plantes terrestres.",
    period: 160,
    group: "plants"
  },
  "Pinophyta": {
    description: "Conifères, gymnospermes à feuilles en aiguilles ou en écailles.",
    period: 290,
    group: "plants"
  },
  "Cycadophyta": {
    description: "Cycas, gymnospermes à feuilles composées ressemblant à des palmiers.",
    period: 280,
    group: "plants"
  },
  "Ginkgophyta": {
    description: "Ginkgo, gymnosperme unique avec des feuilles en éventail.",
    period: 270,
    group: "plants"
  },
  "Gnetophyta": {
    description: "Gnetophytes, gymnospermes avec des caractéristiques proches des angiospermes.",
    period: 260,
    group: "plants"
  },
  "Magnoliophyta": {
    description: "Plantes à fleurs, divisées en monocotylédones et dicotylédones.",
    period: 160,
    group: "plants"
  },
  "Fungi": {
    description: "Organismes eucaryotes hétérotrophes avec des cellules à paroi chitineuse, comprenant les champignons.",
    period: 1000,
    group: "fungi"
  },
  "Ascomycota": {
    description: "Champignons à sacs (asques) contenant les spores, incluant les levures et truffes.",
    period: 400,
    group: "fungi"
  },
  "Basidiomycota": {
    description: "Champignons à basides, incluant la plupart des champignons comestibles et vénéneux.",
    period: 300,
    group: "fungi"
  },
  "Chytridiomycota": {
    description: "Champignons primitifs aquatiques avec des spores flagellées.",
    period: 600,
    group: "fungi"
  },
  "Zygomycota": {
    description: "Champignons formant des zygospores, comme les moisissures du pain.",
    period: 500,
    group: "fungi"
  },
  "Saccharomycetes": {
    description: "Classe des levures, incluant Saccharomyces cerevisiae (levure de boulanger).",
    period: 200,
    group: "fungi"
  },
  "Pezizomycetes": {
    description: "Champignons en forme de coupe, incluant les morilles et pézizes.",
    period: 300,
    group: "fungi"
  },
  "Sordariomycetes": {
    description: "Champignons à périthèces, incluant de nombreux parasites végétaux.",
    period: 250,
    group: "fungi"
  },
  "Agaricomycetes": {
    description: "Champignons à lames, incluant les champignons de Paris et amanites.",
    period: 150,
    group: "fungi"
  },
  "Tremellomycetes": {
    description: "Champignons gélatineux, souvent parasites d'autres champignons.",
    period: 200,
    group: "fungi"
  },
  "Ustilaginomycetes": {
    description: "Charbons des céréales, champignons parasites des plantes.",
    period: 180,
    group: "fungi"
  },
  "Agaricus": {
    description: "Genre incluant le champignon de Paris et autres champignons comestibles.",
    period: 50,
    group: "fungi"
  },
  "Amanita": {
    description: "Genre incluant des champignons très toxiques comme l'amanite phalloïde.",
    period: 60,
    group: "fungi"
  },
  "Boletus": {
    description: "Cèpes et bolets, champignons à tubes au lieu de lames.",
    period: 45,
    group: "fungi"
  },
  "Pleurotus": {
    description: "Pleurotes, champignons en forme d'éventail poussant sur le bois.",
    period: 40,
    group: "fungi"
  },
  "Shiitake": {
    description: "Lentinula edodes, champignon comestible très apprécié en Asie.",
    period: 35,
    group: "fungi"
  },
  "Animalia": {
    description: "Organismes eucaryotes pluricellulaires hétérotrophes qui se nourrissent d'autres organismes.",
    period: 600,
    group: "animals"
  },
  "Chordata": {
    description: "Phylum d'animaux caractérisés par la présence d'une notochorde, incluant tous les vertébrés.",
    period: 530,
    group: "animals"
  },
  "Vertebrata": {
    description: "Sous-phylum des chordés possédant une colonne vertébrale et un crâne.",
    period: 520,
    group: "animals"
  },
  "Arthropoda": {
    description: "Invertébrés à exosquelette chitineux et corps segmenté, le plus grand phylum animal.",
    period: 540,
    group: "arthropods"
  },
  "Mollusca": {
    description: "Invertébrés au corps mou, souvent protégé par une coquille, comme les escargots et les pieuvres.",
    period: 540,
    group: "other_invertebrates"
  },
  "Tetrapoda": {
    description: "Superclasse de vertébrés possédant quatre membres (tétrapodes).",
    period: 390,
    group: "animals"
  },
  "Fish": {
    description: "Ensemble des vertébrés aquatiques incluant les poissons sans mâchoires (agnathes) et les poissons à mâchoires (gnathostomes). Respirent par branchies et possèdent des nageoires.",
    period: 500,
    group: "animals"
  },
  "Amphibia": {
    description: "Vertébrés tétrapodes qui passent généralement une partie de leur vie dans l'eau et une partie sur terre.",
    period: 370,
    group: "animals"
  },
  "Reptilia": {
    description: "Vertébrés tétrapodes avec des écailles et des œufs amniotes, adaptés à la vie terrestre.",
    period: 320,
    group: "animals"
  },
  "Aves": {
    description: "Vertébrés tétrapodes à plumes, au métabolisme élevé et capables généralement de voler.",
    period: 150,
    group: "animals"
  },
  "Mammalia": {
    description: "Vertébrés tétrapodes qui possèdent des glandes mammaires et des poils ou fourrures.",
    period: 200,
    group: "animals"
  },
  "Primates": {
    description: "Mammifères caractérisés par un grand cerveau et une vision binoculaire, incluant les humains.",
    period: 65,
    group: "animals"
  },
  "Carnivora": {
    description: "Mammifères principalement carnivores avec des crocs développés, comme les lions et les chiens.",
    period: 60,
    group: "animals"
  },
  "Insecta": {
    description: "La classe d'arthropodes la plus diversifiée, avec trois paires de pattes et généralement des ailes.",
    period: 400,
    group: "arthropods"
  },
  "Arachnida": {
    description: "Arthropodes caractérisés par huit pattes et sans antennes ni ailes (araignées, scorpions).",
    period: 400,
    group: "arthropods"
  },
  "Crustacea": {
    description: "Arthropodes principalement aquatiques avec des appendices biramés, comme les crabes et les crevettes.",
    period: 500,
    group: "arthropods"
  },
  "Crenarchaeota": {
    description: "Phylum d'archées souvent thermophiles, incluant de nombreuses espèces hyperthermophiles.",
    period: 3400,
    group: "unicellular"
  },
  "Euryarchaeota": {
    description: "Phylum d'archées diversifié incluant les méthanogènes et les halophiles extrêmes.",
    period: 3400,
    group: "unicellular"
  },
  "Thaumarchaeota": {
    description: "Phylum d'archées impliquées dans l'oxydation de l'ammoniac, communes dans les sols et océans.",
    period: 3300,
    group: "unicellular"
  },
  "Korarchaeota": {
    description: "Phylum d'archées rare et profondément divergent, trouvé dans les sources hydrothermales.",
    period: 3300,
    group: "unicellular"
  },
  "Nanoarchaeota": {
    description: "Petites archées symbiotiques, comme Nanoarchaeum equitans.",
    period: 3200,
    group: "unicellular"
  },
  "Asgardarchaeota": {
    description: "Groupe d'archées récemment découvert, potentiellement proche parent des eucaryotes.",
    period: 2100,
    group: "unicellular"
  }
};



// Groupes taxonomiques avec leurs couleurs associées
const taxonomyGroups = {
  "origin": "#FFD700",
  "unicellular": "#9370DB",
  "bacteria": "#00CED1",
  "protozoa": "#FF69B4",
  "plants": "#32CD32",
  "fungi": "#8B4513",
  "animals": "#FF6347",
  "arthropods": "#4682B4",
  "other_invertebrates": "#DDA0DD",
  "other_eukaryotes": "#6495ED"
};

// Relations phylogénétiques corrigées
const phylogeneticRelations = {
  "LUCA": ["Archaea", "Bacteria", "Eukarya"],
  "Archaea": ["Crenarchaeota", "Euryarchaeota", "Thaumarchaeota", "Korarchaeota", "Nanoarchaeota", "Asgardarchaeota"],
  "Eukarya": ["Protozoa", "Plantae", "Fungi", "Animalia"],
  "Plantae": ["Bryophyta", "Marchantiophyta", "Anthocerotophyta", "Lycopodiophyta", "Pteridophyta", "Gymnospermae", "Angiospermae"],
  "Gymnospermae": ["Pinophyta", "Cycadophyta", "Ginkgophyta", "Gnetophyta"],
  "Angiospermae": ["Magnoliophyta"],
  "Protozoa": ["SAR", "Excavata", "Amoebozoa"],
  "Amoebozoa": ["Amoeba"],
  "Excavata": ["Euglenozoa"],
  "SAR": ["Ciliophora", "Apicomplexa", "Dinoflagellata", "Foraminifera", "Radiolaria"],
  "Euglenozoa": ["Trypanosoma"],
  "Ciliophora": ["Paramecium"],
  "Apicomplexa": ["Plasmodium"],
  "Bacteria": ["Cyanobacteria", "Proteobacteria", "Firmicutes", "Actinobacteria", "Bacteroidetes", "Spirochaetes"],
  "Proteobacteria": ["Escherichia"],
  "Firmicutes": ["Streptococcus", "Lactobacillus"],
  "Actinobacteria": ["Mycobacterium"],
  "Fungi": ["Ascomycota", "Basidiomycota", "Chytridiomycota", "Zygomycota"],
  "Ascomycota": ["Saccharomycetes", "Pezizomycetes", "Sordariomycetes"],
  "Basidiomycota": ["Agaricomycetes", "Tremellomycetes", "Ustilaginomycetes"],
  "Agaricomycetes": ["Agaricus", "Amanita", "Boletus", "Pleurotus", "Shiitake"],
  "Animalia": ["Chordata", "Arthropoda", "Mollusca"],
  "Chordata": ["Vertebrata"],
  "Vertebrata": ["Fish", "Tetrapoda"],
  "Tetrapoda": ["Amphibia", "Reptilia"],
  "Reptilia": ["Aves", "Mammalia"],
  "Mammalia": ["Primates", "Carnivora"],
  "Arthropoda": ["Insecta", "Arachnida", "Crustacea"]
};

function getTaxonColor(name) {
  const group = taxonomyData[name]?.group || "other_eukaryotes";
  return taxonomyGroups[group];
}

// Composant pour un nœud de taxon avec info-bulle
function TaxonNode({ position, name, scale = 1, onHover, onUnhover }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    onHover && onHover({ ...taxonomyData[name], name });
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    onUnhover && onUnhover();
  };

  // Gérer les noms de regroupement spéciaux
  const displayName = name === "Protozoa_grouping" ? "Protozoaires" : 
                     name === "Agnathes_Gnathostomes" ? "Poissons" : name;

  return (
    <mesh 
      position={position} 
      ref={ref}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[0.15 * scale * (hovered ? 1.2 : 1), 16, 16]} />
      <meshStandardMaterial 
        color={getTaxonColor(name)} 
        emissive={hovered ? getTaxonColor(name) : "#000000"}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
      <Text
        position={[0, 0.3 * scale, 0]}
        fontSize={0.12 * scale * (hovered ? 1.1 : 1)}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineColor="black"
        outlineWidth={0.02}
      >
        {displayName}
      </Text>
    </mesh>
  );
}

// Composant amélioré pour une branche entre deux taxons
function PhyloBranch({ start, end, color = 'white', thickness = 0.05 }) {
  const points = useMemo(() => [start, end], [start, end]);
  
  return (
    <Line
      points={points}
      color={color}
      lineWidth={thickness * 10}
      transparent
      opacity={0.8}
    />
  );
}

// Remplacer la fonction calculateNodePositions par l'utilisation de createStructure
const { nodes: initialNodes, branches: initialBranches } = createStructure(
  "LUCA",
  { x: 0, y: -10, z: 0 },
  0,
  3,
  0,
  taxonomyData,
  phylogeneticRelations,
  getTaxonColor
);

// Info-bulle flottante améliorée
function InfoTooltip({ info, position }) {
  if (!info) return null;
  
  // Gérer les informations spéciales pour les regroupements
  let displayInfo = { ...info };
  if (info.name === "Protozoa_grouping") {
    displayInfo = {
      name: "Protozoaires (regroupement fonctionnel)",
      period: 1800,
      description: "Regroupement fonctionnel d'organismes unicellulaires eucaryotes. Les protozoaires ne forment pas un groupe monophylétique mais représentent divers lignages eucaryotes unicellulaires."
    };
  } else if (info.name === "Agnathes_Gnathostomes") {
    displayInfo = {
      name: "Poissons (Agnathes + Gnathostomes)",
      period: 500,
      description: "Ensemble des vertébrés aquatiques incluant les poissons sans mâchoires (agnathes) et les poissons à mâchoires (gnathostomes). Respirent par branchies et possèdent des nageoires."
    };
  }
  
  return (
    <div style={{
      position: 'absolute',
      top: position.y,
      left: position.x,
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      maxWidth: '350px',
      fontSize: '12px',
      zIndex: 1000,
      pointerEvents: 'none',
      border: `2px solid ${getTaxonColor(info.name || 'other_eukaryotes')}`
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
        {displayInfo.name || 'Taxon'}
      </div>
      <div style={{ marginBottom: '5px' }}>
        Période: {displayInfo.period} Ma
      </div>
      <div>{displayInfo.description}</div>
    </div>
  );
}

// Arbre phylogénétique amélioré
const PhylogeneticTree = ({ onNodeHover, onNodeUnhover }) => {
  const { branches, nodes } = useMemo(() => {
    const { nodes: initialNodes, branches: initialBranches } = createStructure(
      "LUCA",
      { x: 0, y: -10, z: 0 },
      0,
      3,
      0,
      taxonomyData,
      phylogeneticRelations,
      getTaxonColor
    );
    
    // Appliquer la répulsion une seule fois pour optimiser
    const repulsedNodes = applyRepulsion(initialNodes, 0.2, 1.8);

    // Mettre à jour les positions des branches après répulsion
    const nodePositionMap = {};
    repulsedNodes.forEach(node => {
      nodePositionMap[node.name] = node.position;
    });

    const updatedBranches = initialBranches.map(branch => {
      const startPos = nodePositionMap[branch.parentSpecies];
      const endPos = nodePositionMap[branch.childSpecies];
      
      return {
        ...branch,
        start: startPos || branch.start,
        end: endPos || branch.end
      };
    }).filter(branch => branch.start && branch.end);

    return { branches: updatedBranches, nodes: repulsedNodes };
  }, []);

  return (
    <Center>
      {branches.map((branch, index) => (
        <PhyloBranch
          key={`branch-${index}`}
          start={branch.start}
          end={branch.end}
          color={branch.color}
          thickness={0.06}
        />
      ))}
      {nodes.map((node, index) => (
        <TaxonNode
          key={`node-${index}`}
          position={node.position}
          name={node.name}
          scale={Math.max(0.8, 1 + (6 - node.depth) * 0.1)}
          onHover={onNodeHover}
          onUnhover={onNodeUnhover}
        />
      ))}
    </Center>
  );
};

export default function App() {
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Optimisation React Fiber - utilisation de useRef pour éviter les re-renders
  const mousePositionRef = useRef({ x: 0, y: 0 });
  
  const handleMouseMove = useCallback((e) => {
    mousePositionRef.current = { x: e.clientX + 10, y: e.clientY + 10 };
    // Mise à jour du state seulement si info-bulle visible
    if (hoveredInfo) {
      setMousePosition({ x: e.clientX + 10, y: e.clientY + 10 });
    }
  }, [hoveredInfo]);

  const handleNodeHover = useCallback((info) => {
    setHoveredInfo(info);
    setMousePosition(mousePositionRef.current);
  }, []);

  const handleNodeUnhover = useCallback(() => {
    setHoveredInfo(null);
  }, []);

  return (
    <div className="app-container">
      <Canvas
        camera={{ position: [15, 5, 15], fov: 60 }}
        className="canvas-container"
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4477ff" />
        <pointLight position={[0, 10, 0]} intensity={0.8} color="#ffffff" />

        <PhylogeneticTree 
          onNodeHover={handleNodeHover}
          onNodeUnhover={handleNodeUnhover}
        />

        <OrbitControls 
          autoRotate 
          autoRotateSpeed={0.2} 
          enableZoom={true}
        />

        <fog attach="fog" args={['#0a0a2e', 30, 80]} />
      </Canvas>
      
      <InfoTooltip 
        info={hoveredInfo} 
        position={mousePosition}
      />
      
      <div className="taxonomy-notes">
        <div className="taxonomy-notes-title">Notes taxonomiques</div>
        <div className="taxonomy-notes-item">• Protozoaires : regroupement fonctionnel, non monophylétique</div>
        <div className="taxonomy-notes-item">• SAR et Excavata : supergroupes monophylétiques (datation spéculative)</div>
        <div className="taxonomy-notes-item">• Poissons : inclut agnathes et gnathostomes</div>
        <div className="taxonomy-notes-item">• Arbre incluant différents niveaux taxonomiques (domaines → genres)</div>
        <div className="taxonomy-notes-italic">
          * Protozoaires : regroupement fonctionnel, non monophylétique
        </div>
      </div>
    </div>
  );
}