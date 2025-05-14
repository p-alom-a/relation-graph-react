import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import R3fForceGraph from 'r3f-forcegraph';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

/**
 * Fonction qui crée un objet 3D personnalisé (cube) pour représenter un nœud
 */
const customNodeObject = (node) => {
  const geometry = new THREE.BoxGeometry(8, 8, 8);
  const material = new THREE.MeshStandardMaterial({ color: node.color || 'orange' });
  return new THREE.Mesh(geometry, material);
};

/**
 * Composant qui gère la visualisation du graphe
 */
function GraphViz() {
  const fgRef = useRef();
  
  // Animation du graphe
  useFrame(() => {
    if (fgRef.current) fgRef.current.tickFrame();
  });

  // Données du graphe
  const data = useMemo(() => ({
    nodes: [
      { id: "1", name: "Nœud 1", color: 'red', val: 2 },
      { id: "2", name: "Nœud 2", color: 'blue', val: 1 },
      { id: "3", name: "Nœud 3", color: 'green', val: 1.5 }
    ],
    links: [
      { source: "1", target: "2", distance: 10 },
      { source: "1", target: "3", distance: 50 }
    ]
  }), []);

  // Configuration des forces du graphe après rendu initial
  useEffect(() => {
    const fg = fgRef.current;
    fg.d3Force('link').distance(link => link.distance || 50);
  }, []);

  return (
    <R3fForceGraph
      ref={fgRef}
      graphData={data}
      nodeLabel="name"
      nodeRelSize={8}
      nodeColor={node => node.color}
      nodeVal={node => node.val}
      linkColor={() => 'white'}
      nodeThreeObject={customNodeObject}
    />
  );
}

/**
 * Composant principal de l'application
 */
export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 100] }}>
      <ambientLight intensity={1} />
      <GraphViz />
      <OrbitControls />
    </Canvas>
  );
}