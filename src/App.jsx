import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import './App.css';
import { taxonomyGroups, taxonomyData, phylogeneticRelations } from './data/taxonomyData.js';
import { buildPhylogeneticTree, PhyloBranch, TaxonNode } from './utils/PhylogeneticTreeBuilder.jsx';
import { InfoTooltip, ColorLegend, TaxonomyNotes } from './utils/InfoComponents.jsx';

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
      <TaxonomyNotes />

      <InfoTooltip
        info={hoveredInfo}
        position={mousePosition}
      />
    </div>
  );
}
