import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Center, Line } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';
import { taxonomyData, taxonomyGroups, phylogeneticRelations } from './data/taxonomyData';

function getTaxonColor(name) {
  const group = taxonomyData[name]?.group || "luca";
  return taxonomyGroups[group] || "#6495ED";
}

// Fonction encapsulée pour toute la structuration de l'arbre
function buildPhylogeneticTree(taxonomyData, taxonomyGroups, phylogeneticRelations) {
  // Fonction de répulsion optimisée
  function applyRepulsion(nodes, repulsionStrength = 0.5, minDistance = 1.5) {
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

  // Fonction pour calculer les positions 3D basées sur la période
  function calculateNodePositions() {
    const nodePositions = {};
    const nodes = [];
    const branches = [];

    // Fonction pour compter récursivement tous les descendants d'un nœud
    const countAllDescendants = (species) => {
      const children = phylogeneticRelations[species];
      if (!children || children.length === 0) return 1;

      return children.reduce((total, child) => {
        return total + countAllDescendants(child);
      }, 0);
    };

    const createBranch = (species, position, angle = 0, baseRadius = 3, depth = 0, maxDepth = 8, horizontalAngle = 0) => {
      if (depth > maxDepth || !taxonomyData[species]) return;
    
      const { period } = taxonomyData[species];
    
      // Position Y basée sur la période
      let yPosition = position.y + (period / 400);
    
      // Augmenter l'écartement vertical pour les 3 premiers niveaux selon le nombre d'enfants
      const children = phylogeneticRelations[species];
      if (children && depth <= 2) {
        const verticalSpacing = children.length * 0.5;
        yPosition += verticalSpacing;
      }
    
      const finalPosition = new THREE.Vector3(position.x, yPosition, position.z);
    
      nodes.push({
        name: species,
        position: finalPosition.clone(),
        depth: depth,
        period: period
      });
    
      nodePositions[species] = finalPosition.clone();
      if (!children || children.length === 0) return;
    
      let radius, angleStep;
    
      // Traitement spécial pour le premier niveau (enfants de LUCA)
      if (depth === 0) {
        // Augmenter le rayon pour les enfants directs de LUCA
        radius = baseRadius * 3; // Augmentez ce facteur pour une structure plus ouverte
    
        children.forEach((child, i) => {
          if (!taxonomyData[child]) return;
    
          const childAngle = (i * 120) + horizontalAngle; // 120 degrés de séparation pour 3 enfants
          const rad = THREE.MathUtils.degToRad(childAngle);
    
          const { period: periodChild } = taxonomyData[child];
          const timeDiff = Math.abs(period - periodChild);
    
          // Position sur le cercle
          const childX = position.x + radius * Math.cos(rad);
          const childZ = position.z + radius * Math.sin(rad);
          const childY = finalPosition.y + (timeDiff / 400);
    
          const childPos = new THREE.Vector3(childX, childY, childZ);
    
          branches.push({
            start: finalPosition.clone(),
            end: childPos.clone(),
            parentSpecies: species,
            childSpecies: child,
            color: getTaxonColor(species)
          });
    
          createBranch(child, childPos, childAngle, baseRadius, depth + 1, maxDepth, horizontalAngle);
        });
      } else {
        // Logique originale pour les autres niveaux
        radius = baseRadius * Math.pow(0.85, depth) * Math.sqrt(children.length);
        angleStep = 360 / children.length;
    
        children.forEach((child, i) => {
          if (!taxonomyData[child]) return;
    
          const childAngle = angle + (i - (children.length - 1) / 2) * angleStep;
          const rad = THREE.MathUtils.degToRad(childAngle);
    
          const { period: periodChild } = taxonomyData[child];
          const timeDiff = Math.abs(period - periodChild);
    
          // Position spiralée pour éviter les chevauchements
          const spiralFactor = depth * 0.2;
          const childX = position.x + radius * Math.cos(rad + spiralFactor);
          const childZ = position.z + radius * Math.sin(rad + spiralFactor);
          const childY = finalPosition.y + (timeDiff / 400);
    
          const childPos = new THREE.Vector3(childX, childY, childZ);
    
          branches.push({
            start: finalPosition.clone(),
            end: childPos.clone(),
            parentSpecies: species,
            childSpecies: child,
            color: getTaxonColor(species)
          });
    
          createBranch(child, childPos, childAngle, baseRadius, depth + 1, maxDepth, horizontalAngle);
        });
      }
    };
    

    // Commencer par LUCA en bas
    createBranch("LUCA", new THREE.Vector3(0, -10, 0), 0);

    return { nodes, branches };
  }

  // Fonction principale qui retourne la structure finale de l'arbre
  function generateTreeStructure() {
    const { nodes: initialNodes, branches: initialBranches } = calculateNodePositions();

    // Appliquer la répulsion avec des paramètres ajustés
    const repulsedNodes = applyRepulsion(initialNodes, 0.15, 2.0);

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
  }

  return generateTreeStructure();
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
        {name}
      </Text>
    </mesh>
  );
}

// Composant pour une branche entre deux taxons
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

// Info-bulle flottante
function InfoTooltip({ info, position }) {
  if (!info) return null;

  return (
    <div className="info-tooltip" style={{
      top: position.y,
      left: position.x,
      border: `2px solid ${getTaxonColor(info.name)}`
    }}>
      <div className="info-tooltip-title">
        {info.name}
      </div>
      <div className="info-tooltip-period">
        Période: {info.period} Ma
      </div>
      <div className="info-tooltip-description">{info.description}</div>
    </div>
  );
}

// Arbre phylogénétique
const PhylogeneticTree = ({ onNodeHover, onNodeUnhover }) => {
  const { branches, nodes } = useMemo(() => {
    return buildPhylogeneticTree(taxonomyData, taxonomyGroups, phylogeneticRelations);
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
          scale={Math.max(0.8, 1 + (8 - node.depth) * 0.1)}
          onHover={onNodeHover}
          onUnhover={onNodeUnhover}
        />
      ))}
    </Center>
  );
};

// Légende des couleurs
function ColorLegend() {
  const legendItems = [
    { group: 'luca', label: 'LUCA', color: taxonomyGroups.luca },
    { group: 'bacteria', label: 'Bacteria', color: taxonomyGroups.bacteria },
    { group: 'archaea', label: 'Archaea', color: taxonomyGroups.archaea },
    { group: 'archaeplastida', label: 'Archaeplastida', color: taxonomyGroups.archaeplastida },
    { group: 'sar_supergroup', label: 'SAR', color: taxonomyGroups.sar_supergroup },
    { group: 'excavata', label: 'Excavata', color: taxonomyGroups.excavata },
    { group: 'amoebozoa', label: 'Amoebozoa', color: taxonomyGroups.amoebozoa },
    { group: 'opisthokonta', label: 'Opisthokonta', color: taxonomyGroups.opisthokonta },
    { group: 'animals', label: 'Animaux', color: taxonomyGroups.animals },
    { group: 'fungi', label: 'Champignons', color: taxonomyGroups.fungi }
  ];

  return (
    <div className="color-legend">
      <div className="color-legend-title">
        Classification phylogénétique
      </div>
      {legendItems.map((item, index) => (
        <div key={index} className="color-legend-item">
          <div className="color-legend-dot" style={{ backgroundColor: item.color }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const mousePositionRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    mousePositionRef.current = { x: e.clientX + 10, y: e.clientY + 10 };
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

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

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

      <ColorLegend />

      <InfoTooltip
        info={hoveredInfo}
        position={mousePosition}
      />

      <div className="taxonomy-notes">
        <div className="taxonomy-notes-title">
          Arbre phylogénétique moderne
        </div>
        <div className="taxonomy-notes-content">
          • Classification basée sur les 3 domaines de Woese<br/>
          • Supergroups eucaryotes selon la phylogénomique récente<br/>
          • Axe temporel : LUCA (3.8 Ga) → Présent<br/>
          • Couleurs par groupes taxonomiques majeurs
        </div>
      </div>
    </div>
  );
}