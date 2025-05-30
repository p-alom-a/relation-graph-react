import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Center } from '@react-three/drei';
import * as THREE from 'three';

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
    group: "unicellular"
  },
  "Eukarya": {
    description: "Domaine regroupant tous les organismes dont les cellules possèdent un noyau et des organites.",
    period: 2100,
    group: "unicellular"
  },
  "Protozoa": {
    description: "Organismes unicellulaires eucaryotes, souvent mobiles, qui se nourrissent par phagocytose.",
    period: 1500,
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
  }
};

// Groupes taxonomiques avec leurs couleurs associées
const taxonomyGroups = {
  "origin": "#FFD700",
  "unicellular": "#9370DB",
  "plants": "#32CD32",
  "fungi": "#8B4513",
  "animals": "#FF6347",
  "arthropods": "#4682B4",
  "other_invertebrates": "#DDA0DD",
  "other_eukaryotes": "#6495ED"
};

// Relations phylogénétiques simplifiées
const phylogeneticRelations = {
  "LUCA": ["Archaea", "Bacteria", "Eukarya"],
  "Eukarya": ["Protozoa", "Plantae", "Fungi", "Animalia"],
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

// Composant pour un nœud de taxon
function TaxonNode({ position, name, scale = 1 }) {
  const ref = useRef();
  return (
    <mesh position={position} ref={ref}>
      <sphereGeometry args={[0.15 * scale, 16, 16]} />
      <meshStandardMaterial color={getTaxonColor(name)} />
      <Text
        position={[0, 0.3 * scale, 0]}
        fontSize={0.2 * scale}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </mesh>
  );
}

// Composant pour une branche entre deux taxons
function PhyloBranch({ start, end, color = 'white', thickness = 0.05 }) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[thickness, thickness, length, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Arbre phylogénétique basé sur une structure L-System
// Arbre phylogénétique basé sur une structure L-System
const PhylogeneticLSystemTree = () => {
  const { branches, nodes } = useMemo(() => {
    const branches = [];
    const nodes = [];
    const nodePositions = {};

    const createBranch = (species, position, angle = 0, radius = 2, depth = 0, maxDepth = 5) => {
      if (depth > maxDepth) return;
    
      nodes.push({
        name: species,
        position: position.clone(),
        depth: depth
      });
    
      nodePositions[species] = position.clone();
    
      const children = phylogeneticRelations[species];
      if (!children || children.length === 0) return;
    
      const angleStep = 360 / children.length;
    
      children.forEach((child, i) => {
        const childAngle = angle + i * angleStep;
        const rad = THREE.MathUtils.degToRad(childAngle);
    
        // Calculer la différence de période entre parent et enfant
        const periodParent = taxonomyData[species]?.period || 0;
        const periodChild = taxonomyData[child]?.period || 0;
        const branchLength = Math.max(1, (periodParent - periodChild) / 200); // ajuster facteur d'échelle
    
        // Position de l'enfant : on monte en Y selon la différence de période
        const childX = position.x + radius * Math.cos(rad);
        const childZ = position.z + radius * Math.sin(rad);
        const childY = position.y + branchLength;
    
        const childPos = new THREE.Vector3(childX, childY, childZ);
    
        branches.push({
          start: position.clone(),
          end: childPos.clone(),
          parentSpecies: species,
          childSpecies: child,
          color: getTaxonColor(species)
        });
    
        createBranch(child, childPos, childAngle, radius * 0.9, depth + 1, maxDepth);
      });
    };

    createBranch("LUCA", new THREE.Vector3(0, -8, 0), 0);

    return { branches, nodes };
  }, []);

  return (
    <Center>
      {branches.map((branch, index) => (
        <PhyloBranch
          key={index}
          start={branch.start}
          end={branch.end}
          color={branch.color}
          thickness={0.08}
        />
      ))}

      {nodes.map((node, index) => (
        <TaxonNode
          key={index}
          position={node.position}
          name={node.name}
          scale={1 + (4 - node.depth) * 0.1}
        />
      ))}
    </Center>
  );
};

export default function App() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [15, 5, 15], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e, #16213e)' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4477ff" />
        <pointLight position={[0, 10, 0]} intensity={0.8} color="#ffffff" />

        <PhylogeneticLSystemTree />

        {/* Rotation automatique - Center s'occupe du centrage automatiquement */}
        <OrbitControls 
          autoRotate 
          autoRotateSpeed={0.2} 
          enableZoom={true}
        />

        <fog attach="fog" args={['#0a0a2e', 30, 80]} />
      </Canvas>
    </div>
  );
}