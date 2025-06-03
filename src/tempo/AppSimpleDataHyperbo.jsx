import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Center } from '@react-three/drei';
import './App.css';
import { simplifiedTaxonomyGroups, simplifiedTaxonomyData, simplifiedPhylogeneticRelations } from './data/simpleData.js';
import { buildPhylogeneticTree, PhyloBranch, getTaxonColor } from './utils/TreeBuilderHyperbolique';

// Composant pour un nœud de taxon avec info-bulle
function TaxonNode({ position, name, scale = 1, onHover, onUnhover }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    onHover && onHover({ ...simplifiedTaxonomyData[name], name });
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
        color={getTaxonColor(name, simplifiedTaxonomyData, simplifiedTaxonomyGroups)}
        emissive={hovered ? getTaxonColor(name, simplifiedTaxonomyData, simplifiedTaxonomyGroups) : "#000000"}
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

// Info-bulle flottante
function InfoTooltip({ info, position }) {
  if (!info) return null;

  return (
    <div className="info-tooltip" style={{
      top: position.y,
      left: position.x,
      border: `2px solid ${getTaxonColor(info.name, simplifiedTaxonomyData, simplifiedTaxonomyGroups)}`
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
    return buildPhylogeneticTree(simplifiedTaxonomyData, simplifiedTaxonomyGroups, simplifiedPhylogeneticRelations);
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
    { group: 'luca', label: 'LUCA', color: simplifiedTaxonomyGroups.luca },
    { group: 'bacteria', label: 'Bacteria', color: simplifiedTaxonomyGroups.bacteria },
    { group: 'archaea', label: 'Archaea', color: simplifiedTaxonomyGroups.archaea },
    { group: 'archaeplastida', label: 'Archaeplastida', color: simplifiedTaxonomyGroups.archaeplastida },
    { group: 'sar_supergroup', label: 'SAR', color: simplifiedTaxonomyGroups.sar_supergroup },
    { group: 'excavata', label: 'Excavata', color: simplifiedTaxonomyGroups.excavata },
    { group: 'amoebozoa', label: 'Amoebozoa', color: simplifiedTaxonomyGroups.amoebozoa },
    { group: 'opisthokonta', label: 'Opisthokonta', color: simplifiedTaxonomyGroups.opisthokonta },
    { group: 'animals', label: 'Animaux', color: simplifiedTaxonomyGroups.animals },
    { group: 'fungi', label: 'Champignons', color: simplifiedTaxonomyGroups.fungi }
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
