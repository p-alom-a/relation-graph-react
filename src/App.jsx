import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Html } from '@react-three/drei';
import './App.css';

// Taxonomic data with descriptions
const taxonomyData = {
  "LUCA": {
    description: "Last Universal Common Ancestor, the hypothetical organism from which all living organisms descend.",
    period: "Approximately 3.5 to 3.8 billion years ago"
  },
  "Protozoa": {
    description: "Unicellular eukaryotic organisms, often mobile, that feed by phagocytosis.",
    period: "Appeared about 1.5 billion years ago"
  },
  "Archaea": {
    description: "Unicellular prokaryotic microorganisms distinct from bacteria, often found in extreme environments.",
    period: "Appeared about 3.5 billion years ago"
  },
  "Bacteria": {
    description: "Unicellular prokaryotic microorganisms forming one of the three major domains of life.",
    period: "Appeared about 3.5 billion years ago"
  },
  "Plantae": {
    description: "Multicellular eukaryotic organisms that perform photosynthesis using chlorophyll.",
    period: "Appeared about 1.2 billion years ago"
  },
  "Fungi": {
    description: "Heterotrophic eukaryotic organisms with chitinous cell walls, including fungi.",
    period: "Appeared about 1 billion years ago"
  },
  "Animalia": {
    description: "Multicellular heterotrophic eukaryotic organisms that feed on other organisms.",
    period: "Appeared about 600 million years ago"
  },
  "Protista": {
    description: "Diverse group of eukaryotic organisms that are not plants, animals, or fungi.",
    period: "Appeared about 1.7 billion years ago"
  },
  "Chromista": {
    description: "Group of eukaryotes including brown algae, diatoms, and some oomycetes.",
    period: "Appeared about 1.3 billion years ago"
  },
  "Archaeplastida": {
    description: "Supergroup of eukaryotes including green plants, red algae, and glaucophytes.",
    period: "Appeared about 1.5 billion years ago"
  },
  "Fish": {
    description: "Aquatic vertebrates that breathe using gills and move using fins.",
    period: "Appeared about 500 million years ago"
  },
  "Amphibia": {
    description: "Tetrapod vertebrates that typically spend part of their life in water and part on land.",
    period: "Appeared about 370 million years ago"
  },
  "Reptilia": {
    description: "Tetrapod vertebrates with scales and amniotic eggs, adapted to terrestrial life.",
    period: "Appeared about 320 million years ago"
  },
  "Aves": {
    description: "Tetrapod vertebrates with feathers, high metabolism, and generally capable of flight.",
    period: "Appeared about 150 million years ago"
  },
  "Mammalia": {
    description: "Tetrapod vertebrates that possess mammary glands and hair or fur.",
    period: "Appeared about 200 million years ago"
  },
  "Arthropoda": {
    description: "Invertebrates with a chitinous exoskeleton and segmented body, the largest animal phylum.",
    period: "Appeared about 540 million years ago"
  },
  "Mollusca": {
    description: "Invertebrates with a soft body, often protected by a shell, such as snails and octopuses.",
    period: "Appeared about 540 million years ago"
  },
  "Annelida": {
    description: "Segmented invertebrates such as earthworms and leeches.",
    period: "Appeared about 520 million years ago"
  },
  "Primates": {
    description: "Mammals characterized by a large brain and binocular vision, including humans.",
    period: "Appeared about 65 million years ago"
  },
  "Carnivora": {
    description: "Primarily carnivorous mammals with developed canines, such as lions and dogs.",
    period: "Appeared about 60 million years ago"
  },
  "Rodentia": {
    description: "The largest order of mammals, characterized by continuously growing incisors.",
    period: "Appeared about 55 million years ago"
  },
  "Chiroptera": {
    description: "Mammals capable of active flight, the only ones with this ability (bats).",
    period: "Appeared about 50 million years ago"
  },
  "Cetacea": {
    description: "Marine mammals fully adapted to aquatic life, such as whales and dolphins.",
    period: "Appeared about 50 million years ago"
  },
  "Insecta": {
    description: "The most diverse class of arthropods, with three pairs of legs and usually wings.",
    period: "Appeared about 400 million years ago"
  },
  "Arachnida": {
    description: "Arthropods characterized by eight legs and without antennae or wings (spiders, scorpions).",
    period: "Appeared about 400 million years ago"
  },
  "Crustacea": {
    description: "Primarily aquatic arthropods with biramous appendages, such as crabs and shrimp.",
    period: "Appeared about 500 million years ago"
  },
  "Squamata": {
    description: "Reptiles with scales including snakes and lizards.",
    period: "Appeared about 200 million years ago"
  }
};

// Function to get a color based on the taxon
function getTaxonColor(name) {
  if (["LUCA"].includes(name)) {
    return "#FFD700"; // Gold for LUCA
  } else if (["Protozoa", "Archaea", "Bacteria"].includes(name)) {
    return "#9370DB"; // Purple for unicellular organisms
  } else if (["Plantae", "Archaeplastida"].includes(name)) {
    return "#32CD32"; // Green for plants
  } else if (["Fungi"].includes(name)) {
    return "#8B4513"; // Brown for fungi
  } else if (["Animalia", "Fish", "Amphibia", "Reptilia", "Aves", "Mammalia", "Primates", "Carnivora", "Rodentia", "Chiroptera", "Cetacea"].includes(name)) {
    return "#FF6347"; // Red for animals
  } else if (["Arthropoda", "Insecta", "Arachnida", "Crustacea"].includes(name)) {
    return "#4682B4"; // Steel blue for arthropods
  } else if (["Mollusca", "Annelida"].includes(name)) {
    return "#DDA0DD"; // Lavender for non-arthropod invertebrates
  } else {
    return "#6495ED"; // Sky blue for others
  }
}

// Component to create a Bézier curve between two points
function BezierConnection({ start, end, intensity = 0.3 }) {
  // Control point for the Bézier curve
  const midY = (start[1] + end[1]) / 2;
  const controlPoint = [
    (start[0] + end[0]) / 2,
    midY + intensity * Math.abs(start[1] - end[1]),
    (start[2] + end[2]) / 2
  ];

  // Create the points of the curve
  const points = [];
  const segments = 20;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    // Quadratic Bézier formula
    const x = Math.pow(1-t, 2) * start[0] + 2 * (1-t) * t * controlPoint[0] + Math.pow(t, 2) * end[0];
    const y = Math.pow(1-t, 2) * start[1] + 2 * (1-t) * t * controlPoint[1] + Math.pow(t, 2) * end[1];
    const z = Math.pow(1-t, 2) * start[2] + 2 * (1-t) * t * controlPoint[2] + Math.pow(t, 2) * end[2];

    points.push([x, y, z]);
  }

  return <Line points={points} color="#FFFFFF" lineWidth={1} />;
}

// Component for the animated spherical node representing a species
function SpeciesNode({ position, radius, name, selected, onClick }) {
  const color = getTaxonColor(name);
  const meshRef = useRef();
  const textRef = useRef();

  // Rotation animation for selected nodes
  useFrame((state, delta) => {
    if (selected && meshRef.current) {
      meshRef.current.rotation.y += delta * 1.5;
    }
  });

  // Scale animation when selected
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

// HTML information panel that appears when a node is selected
function InfoPanel({ selectedNode }) {
  if (!selectedNode) return null;

  const data = taxonomyData[selectedNode.name] || {
    description: "Information not available",
    period: "Unknown period"
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
      <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Period:</strong> {data.period}</p>
      <p style={{ margin: '10px 0', fontSize: '14px' }}>{data.description}</p>
    </div>
  );
}

// Legend component
function Legend() {
  const legendItems = [
    { name: "Origin", color: "#FFD700" },
    { name: "Unicellulars", color: "#9370DB" },
    { name: "Plants", color: "#32CD32" },
    { name: "Fungi", color: "#8B4513" },
    { name: "Animals", color: "#FF6347" },
    { name: "Arthropods", color: "#4682B4" },
    { name: "Other invertebrates", color: "#DDA0DD" },
    { name: "Other eukaryotes", color: "#6495ED" }
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
      <h3 style={{ margin: '0 0 10px 0' }}>Legend</h3>
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

// Component to automatically rotate the scene
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

// Component for the improved phylogenetic tree
function PhylogeneticTree() {
  const [selectedNode, setSelectedNode] = useState(null);

  // Tree parameters
  const layers = 5;  // Evolutionary periods
  const height = 80;  // Total height of the tree

  // Structure to store nodes
  const nodes = [];
  const connections = [];

  // Generate nodes for each layer
  const speciesPerLayer = [1, 3, 6, 8, 10];
  const speciesNames = [
    ["LUCA"],
    ["Protozoa", "Archaea", "Bacteria"],
    ["Plantae", "Fungi", "Animalia", "Protista", "Chromista", "Archaeplastida"],
    ["Fish", "Amphibia", "Reptilia", "Aves", "Mammalia", "Arthropoda", "Mollusca", "Annelida"],
    ["Primates", "Carnivora", "Rodentia", "Chiroptera", "Cetacea", "Insecta", "Arachnida", "Crustacea", "Aves", "Squamata"]
  ];

  // Create nodes for each layer with improved positioning
  for (let layer = 0; layer < layers; layer++) {
    const y = -height/2 + (layer * (height / (layers - 1)));
    const speciesCount = speciesPerLayer[layer];
    const names = speciesNames[layer];

    // Calculate the radius for this layer (exponential distribution)
    const layerRadius = 20 + (layer * layer * 3);

    for (let i = 0; i < speciesCount; i++) {
      // Calculate the angle with a random offset to avoid perfect alignment
      const angleOffset = (Math.random() * 0.2) - 0.1;
      const angle = ((i / speciesCount) * Math.PI * 2) + angleOffset;

      // Calculate the position with a small random vertical offset
      const heightVariation = Math.random() * 4 - 2;
      const x = Math.cos(angle) * layerRadius;
      const z = Math.sin(angle) * layerRadius;

      // Add the node
      nodes.push({
        id: `node-${layer}-${i}`,
        name: names[i] || `Species ${layer}-${i}`,
        position: [x, y + heightVariation, z],
        layer: layer
      });

      // Add connections between layers
      if (layer > 0) {
        // Find the appropriate parent node in the previous layer
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

  // Handle node selection
  const handleNodeClick = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    setSelectedNode(selectedNode && selectedNode.id === nodeId ? null : node);
  };

  return (
    <>
      {/* Curved connections between nodes */}
      {connections.map((connection) => (
        <BezierConnection
          key={connection.id}
          start={connection.start}
          end={connection.end}
          intensity={0.4}
        />
      ))}

      {/* Species nodes */}
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

      {/* HTML information panel for the selected node */}
      <Html>
        <InfoPanel selectedNode={selectedNode} />
        <Legend />
      </Html>
    </>
  );
}

// Main application
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
