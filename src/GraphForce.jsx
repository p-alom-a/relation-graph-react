import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import R3fForceGraph from 'r3f-forcegraph';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

// Taxonomic data with descriptions and time periods in billions or millions of years
const taxonomyData = {
  "LUCA": {
    description: "Last Universal Common Ancestor, the hypothetical organism from which all living organisms descend.",
    period: "Approximately 3.5 to 3.8 billion years ago",
    time: 3.8 // billions of years ago
  },
  "Protozoa": { 
    description: "Unicellular eukaryotic organisms, often mobile, that feed by phagocytosis.", 
    period: "Appeared about 1.5 billion years ago",
    time: 1.5
  },
  "Archaea": { 
    description: "Unicellular prokaryotic microorganisms distinct from bacteria.", 
    period: "Appeared about 3.5 billion years ago",
    time: 3.5
  },
  "Bacteria": { 
    description: "Unicellular prokaryotic microorganisms.", 
    period: "Appeared about 3.5 billion years ago",
    time: 3.5
  },
  "Plantae": { 
    description: "Multicellular eukaryotic organisms that perform photosynthesis.", 
    period: "Appeared about 1.2 billion years ago",
    time: 1.2
  },
  "Fungi": { 
    description: "Heterotrophic eukaryotic organisms.", 
    period: "Appeared about 1 billion years ago",
    time: 1.0
  },
  "Animalia": { 
    description: "Multicellular heterotrophic eukaryotes.", 
    period: "Appeared about 600 million years ago",
    time: 0.6
  },
  "Protista": { 
    description: "Diverse group of eukaryotic organisms.", 
    period: "Appeared about 1.7 billion years ago",
    time: 1.7
  },
  "Chromista": { 
    description: "Eukaryotes including brown algae, diatoms.", 
    period: "Appeared about 1.3 billion years ago",
    time: 1.3
  },
  "Archaeplastida": { 
    description: "Group including green plants, red algae.", 
    period: "Appeared about 1.5 billion years ago",
    time: 1.5
  },
  "Fish": { 
    description: "Aquatic vertebrates with gills and fins.", 
    period: "Appeared about 500 million years ago",
    time: 0.5
  },
  "Amphibia": { 
    description: "Vertebrates living on land and water.", 
    period: "Appeared about 370 million years ago",
    time: 0.37
  },
  "Reptilia": { 
    description: "Scaled vertebrates with amniotic eggs.", 
    period: "Appeared about 320 million years ago",
    time: 0.32
  },
  "Aves": { 
    description: "Feathered vertebrates capable of flight.", 
    period: "Appeared about 150 million years ago",
    time: 0.15
  },
  "Mammalia": { 
    description: "Mammals with hair and mammary glands.", 
    period: "Appeared about 200 million years ago",
    time: 0.2
  },
  "Arthropoda": { 
    description: "Invertebrates with segmented bodies.", 
    period: "Appeared about 540 million years ago",
    time: 0.54
  },
  "Mollusca": { 
    description: "Soft-bodied invertebrates, often shelled.", 
    period: "Appeared about 540 million years ago",
    time: 0.54
  },
  "Annelida": { 
    description: "Segmented worms like earthworms.", 
    period: "Appeared about 520 million years ago",
    time: 0.52
  },
  "Primates": { 
    description: "Mammals with binocular vision.", 
    period: "Appeared about 65 million years ago",
    time: 0.065
  },
  "Carnivora": { 
    description: "Meat-eating mammals with canines.", 
    period: "Appeared about 60 million years ago",
    time: 0.06
  },
  "Rodentia": { 
    description: "Mammals with growing incisors.", 
    period: "Appeared about 55 million years ago",
    time: 0.055
  },
  "Chiroptera": { 
    description: "Flying mammals (bats).", 
    period: "Appeared about 50 million years ago",
    time: 0.05
  },
  "Cetacea": { 
    description: "Aquatic mammals like whales.", 
    period: "Appeared about 50 million years ago",
    time: 0.05
  },
  "Insecta": { 
    description: "Arthropods with six legs and wings.", 
    period: "Appeared about 400 million years ago",
    time: 0.4
  },
  "Arachnida": { 
    description: "Eight-legged arthropods.", 
    period: "Appeared about 400 million years ago",
    time: 0.4
  },
  "Crustacea": { 
    description: "Aquatic arthropods like crabs.", 
    period: "Appeared about 500 million years ago",
    time: 0.5
  },
  "Squamata": { 
    description: "Scaled reptiles like snakes.", 
    period: "Appeared about 200 million years ago",
    time: 0.2
  },
  "Cyanobacteria": { 
    description: "Photosynthetic bacteria.", 
    period: "Appeared about 2.5 billion years ago",
    time: 2.5
  },
  "Proteobacteria": { 
    description: "Diverse group of bacteria.", 
    period: "Appeared about 2 billion years ago",
    time: 2.0
  },
  "Euryarchaeota": { 
    description: "Group of archaea including methanogens.", 
    period: "Appeared about 3 billion years ago",
    time: 3.0
  },
  "Crenarchaeota": { 
    description: "Group of archaea often found in extreme environments.", 
    period: "Appeared about 3 billion years ago",
    time: 3.0
  }
};

function getTaxonColor(name) {
  if (["LUCA"].includes(name)) return "#FFD700";
  if (["Protozoa", "Archaea", "Bacteria"].includes(name)) return "#9370DB";
  if (["Plantae", "Archaeplastida"].includes(name)) return "#32CD32";
  if (["Fungi"].includes(name)) return "#8B4513";
  if (["Animalia", "Fish", "Amphibia", "Reptilia", "Aves", "Mammalia", "Primates", "Carnivora", "Rodentia", "Chiroptera", "Cetacea"].includes(name)) return "#FF6347";
  if (["Arthropoda", "Insecta", "Arachnida", "Crustacea"].includes(name)) return "#4682B4";
  if (["Mollusca", "Annelida"].includes(name)) return "#DDA0DD";
  return "#6495ED";
}

function getNodeSize(name) {
  // Root node is larger
  if (name === "LUCA") return 8;
  
  // Domain level nodes are medium-sized
  if (["Archaea", "Bacteria", "Protozoa"].includes(name)) return 6;
  
  // Kingdom level nodes
  if (["Plantae", "Fungi", "Animalia", "Protista", "Chromista"].includes(name)) return 5;
  
  // Other nodes are smaller
  return 4;
}

// Function to convert time (billions of years ago) to Y position
function timeToYPosition(time) {
  // Scale factor - higher values will spread out the timeline more
  const scaleFactor = 200;
  // Invert the scale so that older (higher time values) are lower on the Y axis
  return (4.0 - time) * scaleFactor;
}

function GraphScene() {
  const fgRef = useRef();
  const [data, setData] = useState({ nodes: [], links: [] });
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  useEffect(() => {
    const hierarchy = {
      LUCA: ["Archaea", "Bacteria", "Protozoa"],
      Protozoa: ["Archaeplastida", "Plantae", "Fungi", "Animalia", "Chromista", "Protista"],
      Archaeplastida: ["Plantae"],
      Animalia: ["Fish", "Amphibia", "Reptilia", "Mammalia", "Arthropoda", "Mollusca", "Annelida"],
      Mammalia: ["Primates", "Carnivora", "Rodentia", "Chiroptera", "Cetacea"],
      Arthropoda: ["Insecta", "Arachnida", "Crustacea"],
      Reptilia: ["Squamata", "Aves"],
      Bacteria: ["Cyanobacteria", "Proteobacteria"],
      Archaea: ["Euryarchaeota", "Crenarchaeota"]
    };

    const nodes = [];
    const links = [];
    const visited = new Set();

    const radiusStep = 150;

    function placeNode(id, level, angleStart, angleEnd, parentPos = { x: 0, z: 0 }) {
      if (visited.has(id)) return;
      visited.add(id);

      const angle = (angleStart + angleEnd) / 2;
      const radius = level * radiusStep;
      const x = parentPos.x + radius * Math.cos(angle);
      const z = parentPos.z + radius * Math.sin(angle);
      
      // Use time data to set Y position
      const y = timeToYPosition(taxonomyData[id]?.time || 0);

      nodes.push({
        id,
        name: `${id}`,
        val: getNodeSize(id),
        color: getTaxonColor(id),
        fx: x,
        fy: y,
        fz: z
      });

      const children = hierarchy[id] || [];
      const anglePerChild = (angleEnd - angleStart) / Math.max(children.length, 1);

      children.forEach((child, i) => {
        const childAngleStart = angleStart + i * anglePerChild;
        const childAngleEnd = angleStart + (i + 1) * anglePerChild;
        links.push({ source: id, target: child });
        placeNode(child, level + 1, childAngleStart, childAngleEnd, { x, z });
      });
    }

    placeNode("LUCA", 0, 0, 2 * Math.PI);

    setData({ nodes, links });
  }, []);

  useFrame(() => {
    if (fgRef.current) {
      fgRef.current.tickFrame();
    }
  });

  return (
    <>
      <R3fForceGraph
        ref={fgRef}
        graphData={data}
        nodeLabel={(node) => `${node.name}`}
        nodeAutoColorBy="color"
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        onNodeClick={(node) => {
          setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
        }}
        nodeThreeObject={(node) => {
          const group = new THREE.Group();
          const sphereGeometry = new THREE.SphereGeometry(node.val, 32, 32);
          const sphereMaterial = new THREE.MeshBasicMaterial({ color: node.color });
          const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
          group.add(sphere);

          // Add label as sprite
          const canvas = document.createElement('canvas');
          canvas.width = 256;
          canvas.height = 64;
          const context = canvas.getContext('2d');
          context.fillStyle = 'white';
          context.font = '24px Arial';
          context.fillText(node.name, 10, 40);

          const texture = new THREE.CanvasTexture(canvas);
          const material = new THREE.SpriteMaterial({ map: texture });
          const sprite = new THREE.Sprite(material);
          sprite.scale.set(30, 7.5, 1);
          sprite.position.set(0, 10, 0);
          group.add(sprite);

          return group;
        }}
      />
    </>
  );
}

function App() {
  return (
    <div className="app-container">
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 400, 800], fov: 50, near: 0.1, far: 10000 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <GraphScene />
          <OrbitControls enableDamping dampingFactor={0.05} />
        </Canvas>
      </div>
      <style jsx>{`
        .app-container {
          display: flex;
          width: 100%;
          height: 100vh;
        }
        .canvas-container {
          flex: 1;
          height: 100%;
        }
      `}</style>
    </div>
  );
}

export default App;