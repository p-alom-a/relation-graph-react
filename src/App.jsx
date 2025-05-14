import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Html } from '@react-three/drei';
import './App.css';

// Données taxonomiques avec descriptions
const taxonomyData = {
  "LUCA": {
    description: "Dernier ancêtre commun universel (Last Universal Common Ancestor), l'organisme hypothétique dont tous les êtres vivants actuels descendent.",
    period: "Il y a environ 3,5 à 3,8 milliards d'années"
  },
  "Protozoa": {
    description: "Organismes unicellulaires eucaryotes, souvent mobiles, qui se nourrissent par phagocytose.",
    period: "Apparus il y a environ 1,5 milliard d'années"
  },
  "Archaea": {
    description: "Micro-organismes unicellulaires procaryotes distincts des bactéries, souvent trouvés dans des environnements extrêmes.",
    period: "Apparus il y a environ 3,5 milliards d'années"
  },
  "Bacteria": {
    description: "Micro-organismes unicellulaires procaryotes formant l'un des trois grands domaines du vivant.",
    period: "Apparus il y a environ 3,5 milliards d'années"
  },
  "Plantae": {
    description: "Organismes eucaryotes pluricellulaires qui réalisent la photosynthèse grâce à la chlorophylle.",
    period: "Apparus il y a environ 1,2 milliard d'années"
  },
  "Fungi": {
    description: "Organismes eucaryotes hétérotrophes avec des cellules à paroi chitineuse, comprenant les champignons.",
    period: "Apparus il y a environ 1 milliard d'années"
  },
  "Animalia": {
    description: "Organismes eucaryotes pluricellulaires hétérotrophes qui se nourrissent d'autres organismes.",
    period: "Apparus il y a environ 600 millions d'années"
  },
  "Protista": {
    description: "Groupe de divers organismes eucaryotes qui ne sont pas des plantes, des animaux ou des champignons.",
    period: "Apparus il y a environ 1,7 milliard d'années"
  },
  "Chromista": {
    description: "Groupe d'eucaryotes comprenant les algues brunes, les diatomées et certains oomycètes.",
    period: "Apparus il y a environ 1,3 milliard d'années"
  },
  "Archaeplastida": {
    description: "Super-groupe d'eucaryotes comprenant les plantes vertes, les algues rouges et les glaucophytes.",
    period: "Apparus il y a environ 1,5 milliard d'années"
  },
  "Fish": {
    description: "Vertébrés aquatiques qui respirent à l'aide de branchies et se déplacent à l'aide de nageoires.",
    period: "Apparus il y a environ 500 millions d'années"
  },
  "Amphibia": {
    description: "Vertébrés tétrapodes qui passent généralement une partie de leur vie dans l'eau et une partie sur terre.",
    period: "Apparus il y a environ 370 millions d'années"
  },
  "Reptilia": {
    description: "Vertébrés tétrapodes avec des écailles et des œufs amniotes, adaptés à la vie terrestre.",
    period: "Apparus il y a environ 320 millions d'années"
  },
  "Aves": {
    description: "Vertébrés tétrapodes à plumes, au métabolisme élevé et capables généralement de voler.",
    period: "Apparus il y a environ 150 millions d'années"
  },
  "Mammalia": {
    description: "Vertébrés tétrapodes qui possèdent des glandes mammaires et des poils ou fourrures.",
    period: "Apparus il y a environ 200 millions d'années"
  },
  "Arthropoda": {
    description: "Invertébrés à exosquelette chitineux et corps segmenté, le plus grand phylum animal.",
    period: "Apparus il y a environ 540 millions d'années"
  },
  "Mollusca": {
    description: "Invertébrés au corps mou, souvent protégé par une coquille, comme les escargots et les pieuvres.",
    period: "Apparus il y a environ 540 millions d'années"
  },
  "Annelida": {
    description: "Invertébrés segmentés comme les vers de terre et les sangsues.",
    period: "Apparus il y a environ 520 millions d'années"
  },
  "Primates": {
    description: "Mammifères caractérisés par un grand cerveau et une vision binoculaire, incluant les humains.",
    period: "Apparus il y a environ 65 millions d'années"
  },
  "Carnivora": {
    description: "Mammifères principalement carnivores avec des crocs développés, comme les lions et les chiens.",
    period: "Apparus il y a environ 60 millions d'années"
  },
  "Rodentia": {
    description: "Le plus grand ordre de mammifères, caractérisés par des incisives à croissance continue.",
    period: "Apparus il y a environ 55 millions d'années"
  },
  "Chiroptera": {
    description: "Mammifères capables de vol actif, les seuls avec cette capacité (chauves-souris).",
    period: "Apparus il y a environ 50 millions d'années"
  },
  "Cetacea": {
    description: "Mammifères marins entièrement adaptés à la vie aquatique, comme les baleines et les dauphins.",
    period: "Apparus il y a environ 50 millions d'années"
  },
  "Insecta": {
    description: "La classe d'arthropodes la plus diversifiée, avec trois paires de pattes et généralement des ailes.",
    period: "Apparus il y a environ 400 millions d'années"
  },
  "Arachnida": {
    description: "Arthropodes caractérisés par huit pattes et sans antennes ni ailes (araignées, scorpions).",
    period: "Apparus il y a environ 400 millions d'années"
  },
  "Crustacea": {
    description: "Arthropodes principalement aquatiques avec des appendices biramés, comme les crabes et les crevettes.",
    period: "Apparus il y a environ 500 millions d'années"
  },
  "Squamata": {
    description: "Reptiles à écailles comprenant les serpents et les lézards.",
    period: "Apparus il y a environ 200 millions d'années"
  }
};

// Fonction pour obtenir une couleur basée sur le taxon
function getTaxonColor(name) {
  if (["LUCA"].includes(name)) {
    return "#FFD700"; // Or pour LUCA
  } else if (["Protozoa", "Archaea", "Bacteria"].includes(name)) {
    return "#9370DB"; // Violet pour les organismes unicellulaires
  } else if (["Plantae", "Archaeplastida"].includes(name)) {
    return "#32CD32"; // Vert pour les plantes
  } else if (["Fungi"].includes(name)) {
    return "#8B4513"; // Brun pour les champignons
  } else if (["Animalia", "Fish", "Amphibia", "Reptilia", "Aves", "Mammalia", "Primates", "Carnivora", "Rodentia", "Chiroptera", "Cetacea"].includes(name)) {
    return "#FF6347"; // Rouge pour les animaux
  } else if (["Arthropoda", "Insecta", "Arachnida", "Crustacea"].includes(name)) {
    return "#4682B4"; // Bleu acier pour les arthropodes
  } else if (["Mollusca", "Annelida"].includes(name)) {
    return "#DDA0DD"; // Lavande pour les invertébrés non-arthropodes
  } else {
    return "#6495ED"; // Bleu ciel pour les autres
  }
}

// Composant pour créer une courbe de Bézier entre deux points
function BezierConnection({ start, end, intensity = 0.3 }) {
  // Point de contrôle pour la courbe de Bézier
  const midY = (start[1] + end[1]) / 2;
  const controlPoint = [
    (start[0] + end[0]) / 2, 
    midY + intensity * Math.abs(start[1] - end[1]), 
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
  
  return <Line points={points} color="#FFFFFF" lineWidth={1} />;
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
      right: '20px',
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
      <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Période :</strong> {data.period}</p>
      <p style={{ margin: '10px 0', fontSize: '14px' }}>{data.description}</p>
    </div>
  );
}

// Composant légende
function Legend() {
  const legendItems = [
    { name: "Origine", color: "#FFD700" },
    { name: "Unicellulaires", color: "#9370DB" },
    { name: "Plantes", color: "#32CD32" },
    { name: "Champignons", color: "#8B4513" },
    { name: "Animaux", color: "#FF6347" },
    { name: "Arthropodes", color: "#4682B4" },
    { name: "Autres invertébrés", color: "#DDA0DD" },
    { name: "Autres eucaryotes", color: "#6495ED" }
  ];

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      padding: '15px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      borderRadius: '10px',
      fontFamily: 'Arial, sans-serif',
      zIndex: 100
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Légende</h3>
      {legendItems.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ 
            width: '15px', 
            height: '15px', 
            backgroundColor: item.color, 
            marginRight: '10px' 
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
  const layers = 5;  // Périodes évolutives
  const height = 80;  // Hauteur totale de l'arbre

  // Structure pour stocker les nœuds
  const nodes = [];
  const connections = [];

  // Générer les nœuds pour chaque couche
  const speciesPerLayer = [1, 3, 6, 8, 10];
  const speciesNames = [
    ["LUCA"],
    ["Protozoa", "Archaea", "Bacteria"],
    ["Plantae", "Fungi", "Animalia", "Protista", "Chromista", "Archaeplastida"],
    ["Fish", "Amphibia", "Reptilia", "Aves", "Mammalia", "Arthropoda", "Mollusca", "Annelida"],
    ["Primates", "Carnivora", "Rodentia", "Chiroptera", "Cetacea", "Insecta", "Arachnida", "Crustacea", "Aves", "Squamata"]
  ];

  // Créer les nœuds pour chaque couche avec un positionnement amélioré
  for (let layer = 0; layer < layers; layer++) {
    const y = -height/2 + (layer * (height / (layers - 1)));
    const speciesCount = speciesPerLayer[layer];
    const names = speciesNames[layer];

    // Calculer le rayon pour cette couche (distribution exponentielle)
    const layerRadius = 20 + (layer * layer * 3);

    for (let i = 0; i < speciesCount; i++) {
      // Calculer l'angle avec un décalage aléatoire pour éviter l'alignement parfait
      const angleOffset = (Math.random() * 0.2) - 0.1;
      const angle = ((i / speciesCount) * Math.PI * 2) + angleOffset;
      
      // Calculer la position avec un petit décalage vertical aléatoire
      const heightVariation = Math.random() * 4 - 2;
      const x = Math.cos(angle) * layerRadius;
      const z = Math.sin(angle) * layerRadius;
      
      // Ajouter le nœud
      nodes.push({
        id: `node-${layer}-${i}`,
        name: names[i] || `Species ${layer}-${i}`,
        position: [x, y + heightVariation, z],
        layer: layer
      });

      // Ajouter les connexions entre les couches
      if (layer > 0) {
        // Trouver le nœud parent approprié dans la couche précédente
        const parentLayer = layer - 1;
        const parentIndex = Math.min(i % speciesPerLayer[parentLayer], speciesPerLayer[parentLayer] - 1);
        const parentNode = nodes.find(n => n.id === `node-${parentLayer}-${parentIndex}`);
        
        if (parentNode) {
          connections.push({
            id: `connection-${layer}-${i}`,
            start: parentNode.position,
            end: [x, y + heightVariation, z]
          });
        }
      }
    }
  }

  // Gérer la sélection d'un nœud
  const handleNodeClick = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    setSelectedNode(selectedNode && selectedNode.id === nodeId ? null : node);
  };

  return (
    <>
      {/* Connexions courbes entre les nœuds */}
      {connections.map((connection) => (
        <BezierConnection 
          key={connection.id} 
          start={connection.start} 
          end={connection.end} 
          intensity={0.4}
        />
      ))}

      {/* Nœuds d'espèces */}
      {nodes.map((node) => (
        <SpeciesNode
          key={node.id}
          position={node.position}
          radius={2}
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
        camera={{ position: [0, 0, 100], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #000000, #1a1a2e)' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#6666ff" />
        <PhylogeneticTree />
        <AutoRotate speed={0.2} />
        <fog attach="fog" args={['#070718', 100, 200]} />
      </Canvas>
    </div>
  );
}