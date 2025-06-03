import * as THREE from 'three';
import { Line, Text } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import { taxonomyGroups, taxonomyData } from '../data/taxonomyData.js';

// Fonction pour obtenir la couleur d'un taxon
export function getTaxonColor(name, simplifiedTaxonomyData, simplifiedTaxonomyGroups) {
  const group = simplifiedTaxonomyData[name]?.group || "luca";
  return simplifiedTaxonomyGroups[group] || "#6495ED";
}

// Composant pour une branche entre deux taxons
export function PhyloBranch({ start, end, color = 'white', thickness = 0.05 }) {
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

// Composant pour un nœud de taxon
export function TaxonNode({ position, name, scale = 1, onHover, onUnhover }) {
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
        color={getTaxonColor(name, taxonomyData, taxonomyGroups)}
        emissive={hovered ? getTaxonColor(name, taxonomyData, taxonomyGroups) : "#000000"}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
    </mesh>
  );
}

// Arbre phylogénétique
export const PhylogeneticTree = ({ onNodeHover, onNodeUnhover }) => {
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

// Fonction pour construire l'arbre phylogénétique
export function buildPhylogeneticTree(simplifiedTaxonomyData, simplifiedTaxonomyGroups, simplifiedPhylogeneticRelations) {
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

          node1.position.x += repulsionVector.x;
          node1.position.z += repulsionVector.z;
          node2.position.x -= repulsionVector.x;
          node2.position.z -= repulsionVector.z;
        }
      }
    }

    return nodesCopy;
  }

  function calculateNodePositions() {
    const nodePositions = {};
    const nodes = [];
    const branches = [];

    const createBranch = (species, position, angle = 0, baseRadius = 3, depth = 0, maxDepth = 8, horizontalAngle = 0) => {
      if (depth > maxDepth || !simplifiedTaxonomyData[species]) return;

      const { period } = simplifiedTaxonomyData[species];
      let yPosition = position.y + (period / 400);

      const children = simplifiedPhylogeneticRelations[species];
      if (children && depth <= 2) {
        const verticalSpacing = children.length * 0.5;
        yPosition += verticalSpacing;
      }

      const finalPosition = new THREE.Vector3(position.x, yPosition, position.z);

      nodes.push({
        name: species,
        position: finalPosition.clone(),
        depth,
        period
      });

      nodePositions[species] = finalPosition.clone();
      if (!children || children.length === 0) return;

      let radius, angleStep;

      if (depth === 0) {
        radius = baseRadius * 3;

        children.forEach((child, i) => {
          if (!simplifiedTaxonomyData[child]) return;

          const childAngle = (i * 120) + horizontalAngle;
          const rad = THREE.MathUtils.degToRad(childAngle);

          const { period: periodChild } = simplifiedTaxonomyData[child];
          const timeDiff = Math.abs(period - periodChild);

          const childX = position.x + radius * Math.cos(rad);
          const childZ = position.z + radius * Math.sin(rad);
          const childY = finalPosition.y + (timeDiff / 400);

          const childPos = new THREE.Vector3(childX, childY, childZ);

          branches.push({
            start: finalPosition.clone(),
            end: childPos.clone(),
            parentSpecies: species,
            childSpecies: child,
            color: getTaxonColor(species, simplifiedTaxonomyData, simplifiedTaxonomyGroups)
          });

          createBranch(child, childPos, childAngle, baseRadius, depth + 1, maxDepth, horizontalAngle);
        });
      } else {
        radius = baseRadius * Math.pow(0.85, depth) * Math.sqrt(children.length);
        angleStep = 360 / children.length;

        children.forEach((child, i) => {
          if (!simplifiedTaxonomyData[child]) return;

          const childAngle = angle + (i - (children.length - 1) / 2) * angleStep;
          const rad = THREE.MathUtils.degToRad(childAngle);

          const { period: periodChild } = simplifiedTaxonomyData[child];
          const timeDiff = Math.abs(period - periodChild);

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
            color: getTaxonColor(species, simplifiedTaxonomyData, simplifiedTaxonomyGroups)
          });

          createBranch(child, childPos, childAngle, baseRadius, depth + 1, maxDepth, horizontalAngle);
        });
      }
    };

    createBranch("LUCA", new THREE.Vector3(0, -10, 0), 0);

    const repulsedNodes = applyRepulsion(nodes, 0.15, 2.0);

    const nodePositionMap = {};
    repulsedNodes.forEach(node => {
      nodePositionMap[node.name] = node.position;
    });

    const updatedBranches = branches.map(branch => {
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

  return calculateNodePositions();
}
