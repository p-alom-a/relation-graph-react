import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Center, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useControls } from 'leva';

import { taxonomyData, taxonomyGroups, phylogeneticRelations } from './data/taxonomyData';
import { createStructure, applyRepulsion } from './utils/treeStructure.jsx';

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