import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Html } from '@react-three/drei';
import './App.css';

// Données taxonomiques avec descriptions et périodes
const taxonomyData = {
  "LUCA": {
    description: "Dernier ancêtre commun universel (Last Universal Common Ancestor), l'organisme hypothétique dont tous les êtres vivants actuels descendent.",
    period: 3700, // en millions d'années
    group: "origin"
  },
  "Protozoa": {
    description: "Organismes unicellulaires eucaryotes, souvent mobiles, qui se nourrissent par phagocytose.",
    period: 1500,
    group: "unicellular"
  },
  "Archaea": {
    description: "Micro-organismes unicellulaires procaryotes distincts des bactéries, souvent trouvés dans des environnements extrêmes.",
    period: 3500,
    group: "unicellular"
  },
  "Bacteria": {
    description: "Micro-organismes unicellulaires procaryotes formant l'un des trois grands domaines du vivant.",
    period: 3500,
    group: "unicellular"
  },
  "Plantae": {
    description: "Organismes eucaryotes pluricellulaires qui réalisent la photosynthèse grâce à la chlorophylle.",
    period: 1200,
    group: "plants"
  },
  "Fungi": {
    description: "Organismes eucaryotes hétérotrophes avec des cellules à paroi chitineuse, comprenant les champignons.",
    period: 1000,
    group: "fungi"
  },
  "Animalia": {
    description: "Organismes eucaryotes pluricellulaires hétérotrophes qui se nourrissent d'autres organismes.",
    period: 600,
    group: "animals"
  },
  "Protista": {
    description: "Groupe de divers organismes eucaryotes qui ne sont pas des plantes, des animaux ou des champignons.",
    period: 1700,
    group: "other_eukaryotes"
  },
  "Chromista": {
    description: "Groupe d'eucaryotes comprenant les algues brunes, les diatomées et certains oomycètes.",
    period: 1300,
    group: "other_eukaryotes"
  },
  "Archaeplastida": {
    description: "Super-groupe d'eucaryotes comprenant les plantes vertes, les algues rouges et les glaucophytes.",
    period: 1500,
    group: "plants"
  },
  "Fish": {
    description: "Vertébrés aquatiques qui respirent à l'aide de branchies et se déplacent à l'aide de nageoires.",
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
  "Annelida": {
    description: "Invertébrés segmentés comme les vers de terre et les sangsues.",
    period: 520,
    group: "other_invertebrates"
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
  "Rodentia": {
    description: "Le plus grand ordre de mammifères, caractérisés par des incisives à croissance continue.",
    period: 55,
    group: "animals"
  },
  "Chiroptera": {
    description: "Mammifères capables de vol actif, les seuls avec cette capacité (chauves-souris).",
    period: 50,
    group: "animals"
  },
  "Cetacea": {
    description: "Mammifères marins entièrement adaptés à la vie aquatique, comme les baleines et les dauphins.",
    period: 50,
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
  "Squamata": {
    description: "Reptiles à écailles comprenant les serpents et les lézards.",
    period: 200,
    group: "animals"
  },
  // Ajout de groupes intermédiaires pour rendre l'arbre plus complet
  "Eukarya": {
    description: "Domaine regroupant tous les organismes dont les cellules possèdent un noyau et des organites.",
    period: 2100,
    group: "unicellular"
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
  "Tetrapoda": {
    description: "Superclasse de vertébrés possédant quatre membres (tétrapodes).",
    period: 390,
    group: "animals"
  },
  "Bilateria": {
    description: "Groupe d'animaux à symétrie bilatérale, incluant la majorité des animaux actuels.",
    period: 580,
    group: "animals"
  },
  // Ajout de groupes pour Archaea
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
  // Ajout de groupes pour Bacteria
  "Proteobacteria": {
    description: "Grand phylum bactérien très diversifié, incluant de nombreuses espèces pathogènes.",
    period: 3300,
    group: "unicellular"
  },
  "Firmicutes": {
    description: "Phylum de bactéries à Gram positif, incluant de nombreuses espèces importantes pour l'humain.",
    period: 3200,
    group: "unicellular"
  },
  "Cyanobacteria": {
    description: "Phylum de bactéries photosynthétiques ayant joué un rôle clé dans l'oxygénation de l'atmosphère.",
    period: 3200,
    group: "unicellular"
  },
  "Actinobacteria": {
    description: "Phylum de bactéries à Gram positif, connu pour produire des antibiotiques et autres composés bioactifs.",
    period: 3100,
    group: "unicellular"
  }
};

// Groupes taxonomiques avec leurs couleurs associées
const taxonomyGroups = {
  "origin": "#FFD700",       // Or pour LUCA
  "unicellular": "#9370DB",  // Violet pour les organismes unicellulaires
  "plants": "#32CD32",       // Vert pour les plantes
  "fungi": "#8B4513",        // Brun pour les champignons
  "animals": "#FF6347",      // Rouge pour les animaux
  "arthropods": "#4682B4",   // Bleu acier pour les arthropodes
  "other_invertebrates": "#DDA0DD", // Lavande pour les invertébrés non-arthropodes
  "other_eukaryotes": "#6495ED" // Bleu ciel pour les autres eucaryotes
};

// Fonction pour obtenir une couleur basée sur le taxon
function getTaxonColor(name) {
  const group = taxonomyData[name]?.group || "other_eukaryotes";
  return taxonomyGroups[group];
}

// Composant pour créer une courbe de Bézier entre deux points
function BezierConnection({ start, end, intensity = 0.3, color = "#FFFFFF" }) {
  // Point de contrôle pour la courbe de Bézier
  const midY = (start[1] + end[1]) / 2;
  // Déterminer l'orientation de la courbe (vers l'intérieur ou l'extérieur)
  const startDist = Math.sqrt(start[0]*start[0] + start[2]*start[2]);
  const endDist = Math.sqrt(end[0]*end[0] + end[2]*end[2]);
  const controlIntensity = startDist < endDist ? -intensity : intensity;

  const controlPoint = [
    (start[0] + end[0]) / 2,
    midY + controlIntensity * Math.abs(start[1] - end[1]),
    (start[2] + end[2]) / 2
  ];

  // Créer les points de la courbe
  const points = [];
  const segments = 20;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    // Formule quadratique de Bézier
    const x = Math.pow(1-t, 2) * start[0] + 2 * (1-t) * t * controlPoint[0] + Math.pow(t, 2) * end[0];
    const y = Math.pow(1-t, 2) * start[1] + 2 * (1-t) * t * controlPoint[1] + Math.pow(t, 2) * end[1];
    const z = Math.pow(1-t, 2) * start[2] + 2 * (1-t) * t * controlPoint[2] + Math.pow(t, 2) * end[2];

    points.push([x, y, z]);
  }

  return <Line points={points} color={color} lineWidth={1.5} />;
}

// Composant pour le nœud sphérique animé représentant une espèce
function SpeciesNode({ position, radius, name, selected, onClick }) {
  const color = getTaxonColor(name);
  const meshRef = useRef();
  const textRef = useRef();

  // Animation de rotation pour les nœuds sélectionnés
  useFrame((state, delta) => {
    if (selected && meshRef.current) {
      meshRef.current.rotation.y += delta * 1.5;
    }
  });

  // Animation de scale lorsque sélectionné
  useEffect(() => {
    if (meshRef.current) {
      const targetScale = selected ? 1.3 : 1;
      meshRef.current.scale.set(targetScale, targetScale, targetScale);
    }
  }, [selected]);

  return (
    <group position={position} onClick={onClick}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={selected ? color : "black"}
          emissiveIntensity={selected ? 0.5 : 0}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      <Text
        ref={textRef}
        position={[0, radius + 0.8, 0]}
        color="white"
        fontSize={selected ? 1.5 : 1.2}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        {name}
      </Text>
    </group>
  );
}

// Panneau d'information HTML qui s'affiche lorsqu'un nœud est sélectionné
function InfoPanel({ selectedNode }) {
  if (!selectedNode) return null;

  const data = taxonomyData[selectedNode.name] || {
    description: "Information non disponible",
    period: "Période inconnue"
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '50px',
      width: '350px',
      padding: '15px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      borderRadius: '10px',
      fontFamily: 'Arial, sans-serif',
      zIndex: 100,
      boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
    }}>
      <h2 style={{ margin: '0 0 10px 0', color: getTaxonColor(selectedNode.name) }}>
        {selectedNode.name}
      </h2>
      <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Période :</strong> Il y a environ {data.period} millions d'années</p>
      <p style={{ margin: '10px 0', fontSize: '14px' }}>{data.description}</p>
    </div>
  );
}

// Composant légende
function Legend() {
  const legendItems = [
    { name: "Origine", color: taxonomyGroups.origin },
    { name: "Unicellulaires", color: taxonomyGroups.unicellular },
    { name: "Plantes", color: taxonomyGroups.plants },
    { name: "Champignons", color: taxonomyGroups.fungi },
    { name: "Animaux", color: taxonomyGroups.animals },
    { name: "Arthropodes", color: taxonomyGroups.arthropods },
    { name: "Autres invertébrés", color: taxonomyGroups.other_invertebrates },
    { name: "Autres eucaryotes", color: taxonomyGroups.other_eukaryotes }
  ];

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '10px',
      padding: '15px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      borderRadius: '10px',
      fontFamily: 'Arial, sans-serif',
      zIndex: 100,
      display:none
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Légende</h3>
      {legendItems.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{
            width: '15px',
            height: '15px',
            backgroundColor: item.color,
            marginRight: '10px',
            borderRadius: '50%'
          }}></div>
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}

// Composant pour faire tourner automatiquement la scène
function AutoRotate({ speed = 0.05 }) {
  const orbitRef = useRef();

  useFrame((state, delta) => {
    if (orbitRef.current) {
      orbitRef.current.autoRotate = true;
      orbitRef.current.autoRotateSpeed = speed;
    }
  });

  return <OrbitControls
    ref={orbitRef}
    enableDamping={true}
    dampingFactor={0.05}
    rotateSpeed={0.5}
    minDistance={20}
    maxDistance={200}
  />;
}

// Composant pour l'arbre phylogénétique amélioré
function PhylogeneticTree() {
  const [selectedNode, setSelectedNode] = useState(null);

  // Paramètres de l'arbre
  const layers = 6;  // Périodes évolutives (augmenté pour inclure Eukarya)
  const height = 100;  // Hauteur totale de l'arbre

  // Structure pour stocker les nœuds et les relations
  const nodes = [];
  const connections = [];

  // Définir les relations parent-enfant explicites pour éviter les croisements
  const parentChildRelations = {
    "LUCA": ["Archaea", "Bacteria", "Eukarya"],
    "Eukarya": ["Protozoa", "Protista", "Chromista", "Archaeplastida"],
    "Protozoa": [],
    "Archaea": ["Crenarchaeota", "Euryarchaeota", "Thaumarchaeota"],
    "Bacteria": ["Proteobacteria", "Firmicutes", "Cyanobacteria", "Actinobacteria"],
    "Protista": ["Fungi", "Bilateria"],
    "Chromista": [],
    "Archaeplastida": ["Plantae"],
    "Plantae": [],
    "Fungi": [],
    "Bilateria": ["Chordata", "Arthropoda", "Mollusca", "Annelida"],
    "Chordata": ["Vertebrata"],
    "Vertebrata": ["Fish", "Tetrapoda"],
    "Tetrapoda": ["Amphibia", "Reptilia"],
    "Fish": [],
    "Amphibia": [],
    "Reptilia": ["Aves", "Mammalia", "Squamata"],
    "Aves": [],
    "Mammalia": ["Primates", "Carnivora", "Rodentia", "Chiroptera", "Cetacea"],
    "Arthropoda": ["Insecta", "Arachnida", "Crustacea"],
    "Mollusca": [],
    "Annelida": [],
    "Primates": [],
    "Carnivora": [],
    "Rodentia": [],
    "Chiroptera": [],
    "Cetacea": [],
    "Insecta": [],
    "Arachnida": [],
    "Crustacea": [],
    "Squamata": []
  };

  // Définir les couches et les groupes taxonomiques pour l'organisation
  const speciesLayers = [
    ["LUCA"],
    ["Archaea", "Bacteria", "Eukarya"],
    ["Crenarchaeota", "Euryarchaeota", "Thaumarchaeota", "Proteobacteria", "Firmicutes", "Cyanobacteria", "Actinobacteria", "Protozoa", "Protista", "Chromista", "Archaeplastida"],
    ["Plantae", "Fungi", "Bilateria"],
    ["Chordata", "Arthropoda", "Mollusca", "Annelida"],
    ["Vertebrata", "Insecta", "Arachnida", "Crustacea"],
    ["Fish", "Tetrapoda"],
    ["Amphibia", "Reptilia"],
    ["Aves", "Mammalia", "Squamata"],
    ["Primates", "Carnivora", "Rodentia", "Chiroptera", "Cetacea"]
  ];

  // Organiser les nœuds par groupe taxonomique pour maintenir la cohérence des couleurs
  const speciesByGroup = {};

  // Remplir les groupes
  Object.keys(taxonomyData).forEach(speciesName => {
    const group = taxonomyData[speciesName].group;
    if (!speciesByGroup[group]) {
      speciesByGroup[group] = [];
    }
    speciesByGroup[group].push(speciesName);
  });

  // Créer un objet pour stocker les positions des nœuds
  const nodePositions = {};

  // Générer les nœuds pour chaque couche avec une distribution circulaire
  // On utilise seulement les 6 premières couches pour garder la visibilité
  const visibleLayers = speciesLayers.slice(0, layers);

  visibleLayers.forEach((speciesInLayer, layer) => {
    const y = -height/2 + (layer * (height / (layers - 1)));
    const totalSpeciesInLayer = speciesInLayer.length;

    // Calculer le rayon pour cette couche - ajusté pour une meilleure distribution
    const layerRadius = 15 + (layer * 10);

    // Calculer l'offset d'angle pour chaque couche pour éviter l'alignement
    const layerAngleOffset = (layer * Math.PI / 7);

    speciesInLayer.forEach((speciesName, i) => {
      // Calculer l'angle pour une distribution circulaire avec espacement optimisé
      const angleFraction = totalSpeciesInLayer === 1 ? 0 : i / totalSpeciesInLayer;
      const angle = angleFraction * Math.PI * 2 + layerAngleOffset;

      // Ajouter un petit décalage aléatoire pour éviter l'alignement trop parfait
      const randomOffset = (Math.random() * 0.03) - 0.015;
      const finalAngle = angle + randomOffset;

      // Calculer la position avec un petit décalage vertical aléatoire
      const heightVariation = Math.random() * 1.5 - 0.75;
      const x = Math.cos(finalAngle) * layerRadius;
      const z = Math.sin(finalAngle) * layerRadius;

      // Ajouter le nœud
      nodes.push({
        id: `node-${speciesName}`,
        name: speciesName,
        position: [x, y + heightVariation, z],
        layer: layer,
        group: taxonomyData[speciesName].group,
        period: taxonomyData[speciesName].period || 0
      });

      // Stocker la position pour les connexions
      nodePositions[speciesName] = [x, y + heightVariation, z];
    });
  });

  // Ajouter les connexions basées sur les relations parent-enfant définies
  Object.keys(parentChildRelations).forEach(parent => {
    const children = parentChildRelations[parent];

    children.forEach(child => {
      if (nodePositions[parent] && nodePositions[child]) {
        connections.push({
          id: `connection-${parent}-${child}`,
          start: nodePositions[parent],
          end: nodePositions[child],
          parentName: parent,
          childName: child
        });
      }
    });
  });

  // Gérer la sélection d'un nœud
  const handleNodeClick = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    setSelectedNode(selectedNode && selectedNode.id === nodeId ? null : node);
  };

  return (
    <>
      {/* Connexions courbes entre les nœuds avec couleur basée sur le parent */}
      {connections.map((connection) => {
        const parentColor = getTaxonColor(connection.parentName);
        return (
          <BezierConnection
            key={connection.id}
            start={connection.start}
            end={connection.end}
            intensity={0.4}
            color={parentColor}
          />
        );
      })}

      {/* Nœuds d'espèces */}
      {nodes.map((node) => (
        <SpeciesNode
          key={node.id}
          position={node.position}
          radius={1.8}  // Légèrement plus petit pour une meilleure visualisation
          name={node.name}
          selected={selectedNode && selectedNode.id === node.id}
          onClick={() => handleNodeClick(node.id)}
        />
      ))}

      {/* Panneau d'information HTML pour le nœud sélectionné */}
      <Html>
        <InfoPanel selectedNode={selectedNode} />
        <Legend />
      </Html>
    </>
  );
}

// Application principale
export default function App() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 120], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #000000, #1a1a2e)' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.6} color="#6666ff" />
        <PhylogeneticTree />
        <AutoRotate speed={0.1} />
        <fog attach="fog" args={['#070718', 150, 250]} />
      </Canvas>
    </div>
  );
}