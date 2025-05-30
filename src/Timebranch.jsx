import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Center, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useControls } from 'leva';
import './App.css';
import { taxonomyData, taxonomyGroups, phylogeneticRelations } from './data/taxonomyData';

function getTaxonColor(name) {
  const group = taxonomyData[name]?.group || "other_eukaryotes";
  return taxonomyGroups[group];
}

// Fonction de répulsion optimisée (appelée une seule fois)
function applyRepulsion(nodes, repulsionStrength = 1, minDistance = 1.8) {
  const nodesCopy = [...nodes];
  
  for (let i = 0; i < nodesCopy.length; i++) {
    for (let j = i + 1; j < nodesCopy.length; j++) {
      const node1 = nodesCopy[i];
      const node2 = nodesCopy[j];
      
      const distance = node1.position.distanceTo(node2.position);
      
      if (distance < minDistance && distance > 0) {
        const repulsionVector = new THREE.Vector3()
          .subVectors(node1.position, node2.position)
          .normalize()
          .multiplyScalar((minDistance - distance) * repulsionStrength);
        
        // Appliquer la répulsion seulement sur les axes X et Z pour maintenir la hiérarchie temporelle en Y
        node1.position.x += repulsionVector.x;
        node1.position.z += repulsionVector.z;
        node2.position.x -= repulsionVector.x;
        node2.position.z -= repulsionVector.z;
      }
    }
  }
  
  return nodesCopy;
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

// Fonction pour calculer les positions 3D basées sur la période avec longueurs temporelles
function calculateNodePositions() {
  const nodePositions = {};
  const nodes = [];
  const branches = [];
  
  // Coefficient de lissage pour la conversion temps -> distance
  const timeToDistanceCoeff = 0.008; // Ajustable selon les besoins visuels
  const minBranchLength = 0.5; // Longueur minimale pour éviter les branches trop courtes
  const maxBranchLength = 8; // Longueur maximale pour éviter les branches trop longues

  const createBranch = (species, parentPosition, parentPeriod, angle = 0, baseRadius = 2.5, depth = 0, maxDepth = 6) => {
    if (depth > maxDepth) return;

    // Gérer les noms spéciaux qui n'ont pas de données taxonomiques
    let period, group;
    if (species === "Protozoa_grouping") {
      period = 1800;
      group = "protozoa";
    } else if (species === "Agnathes_Gnathostomes") {
      period = 500;
      group = "animals";
    } else if (!taxonomyData[species]) {
      return;
    } else {
      period = taxonomyData[species].period;
      group = taxonomyData[species].group;
    }

    // CORRECTION: Vérifier la cohérence temporelle (enfant doit être plus récent que parent)
    if (period >= parentPeriod) {
      console.warn(`Incohérence temporelle détectée: ${species} (${period} Ma) n'est pas plus récent que son parent (${parentPeriod} Ma)`);
      // Correction automatique: forcer l'enfant à être plus récent
      period = parentPeriod - 10;
    }

    // CORRECTION: Calculer la différence temporelle correctement (SANS valeur absolue)
    const timeDifference = parentPeriod - period;
    
    // Vérification de sécurité
    if (timeDifference <= 0) {
      console.warn(`Différence temporelle invalide pour ${species}: ${timeDifference} Ma`);
      return;
    }

    let branchLength = timeDifference * timeToDistanceCoeff;
    
    // Appliquer les limites min/max avec lissage
    branchLength = Math.max(minBranchLength, Math.min(maxBranchLength, branchLength));
    
    // Lissage logarithmique pour les très grandes différences temporelles
    if (timeDifference > 1000) {
      branchLength = minBranchLength + Math.log(timeDifference / 1000) * 1.5;
    }

    // Calculer la position du nœud enfant
    const rad = THREE.MathUtils.degToRad(angle);
    const spiralFactor = depth * 0.15;
    
    const childX = parentPosition.x + (baseRadius * Math.cos(rad + spiralFactor));
    const childZ = parentPosition.z + (baseRadius * Math.sin(rad + spiralFactor));
    
    // Position Y basée sur la longueur temporelle de la branche
    // CORRECTION: La direction est déjà correcte (+ vers le futur)
    const childY = parentPosition.y + branchLength;

    const childPosition = new THREE.Vector3(childX, childY, childZ);
    
    nodes.push({
      name: species,
      position: childPosition.clone(),
      depth: depth,
      period: period,
      parentPeriod: parentPeriod,
      timeDifference: timeDifference
    });

    nodePositions[species] = childPosition.clone();
    
    // Créer la branche entre parent et enfant
    branches.push({
      start: parentPosition.clone(),
      end: childPosition.clone(),
      parentSpecies: "parent", // On pourrait passer le nom du parent
      childSpecies: species,
      color: getTaxonColor(species),
      length: branchLength,
      timeDifference: timeDifference,
      parentPeriod: parentPeriod,
      childPeriod: period
    });

    const children = phylogeneticRelations[species];
    if (!children || children.length === 0) return;

    // Rayon adaptatif basé sur la profondeur et le nombre d'enfants
    const childRadius = baseRadius * Math.pow(0.8, depth) * Math.sqrt(children.length);
    const angleStep = 360 / children.length;
    
    children.forEach((child, i) => {
      const childAngle = angle + (i - (children.length - 1) / 2) * angleStep;
      createBranch(child, childPosition, period, childAngle, childRadius, depth + 1, maxDepth);
    });
  };

  // Commencer par LUCA à l'origine
  const lucaPosition = new THREE.Vector3(0, -12, 0);
  const lucaPeriod = taxonomyData["LUCA"].period;
  
  nodes.push({
    name: "LUCA",
    position: lucaPosition.clone(),
    depth: 0,
    period: lucaPeriod
  });
  
  nodePositions["LUCA"] = lucaPosition.clone();

  // Créer les branches pour les enfants de LUCA
  const lucaChildren = phylogeneticRelations["LUCA"];
  const angleStep = 120; // 360/3 pour les 3 domaines principaux
  
  lucaChildren.forEach((child, i) => {
    const childAngle = i * angleStep;
    createBranch(child, lucaPosition, lucaPeriod, childAngle, 3, 1);
  });

  return { nodes, branches };
}

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
    const { nodes: initialNodes, branches: initialBranches } = calculateNodePositions();
    
    // Appliquer la répulsion une seule fois pour optimiser
    const repulsedNodes = applyRepulsion(initialNodes, 0.4, 2.0);

    // Mettre à jour les positions des branches après répulsion
    const nodePositionMap = {};
    repulsedNodes.forEach(node => {
      nodePositionMap[node.name] = node.position;
    });

    const updatedBranches = initialBranches.map(branch => {
      const endPos = nodePositionMap[branch.childSpecies];
      
      return {
        ...branch,
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
        camera={{ position: [20, 8, 20], fov: 60 }}
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

        <fog attach="fog" args={['#0a0a2e', 40, 100]} />
      </Canvas>
      
      <InfoTooltip 
        info={hoveredInfo} 
        position={mousePosition}
      />
    </div>
  );
}