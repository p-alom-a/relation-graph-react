import * as THREE from 'three';

// Structure arborescente classique
export function createTreeStructure(rootName, rootPosition, depth, maxDepth, angle, taxonomyData, phylogeneticRelations, getTaxonColor) {
  const nodes = [];
  const branches = [];
  const nodePositions = {};

  const createBranch = (species, position, angle = 0, baseRadius = 3, depth = 0) => {
    if (depth > maxDepth || !taxonomyData[species]) return;

    const { period } = taxonomyData[species];
    let yPosition = position.y + (period / 400);
    
    const children = phylogeneticRelations[species];
    if (children && depth <= 2) {
      const verticalSpacing = children.length * 0.7;
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

    const angleStep = 360 / children.length;
    
    children.forEach((child, i) => {
      if (!taxonomyData[child]) return;
      
      const baseRadius = 3 * Math.pow(0.85, depth) * Math.sqrt(children.length);
      const descendantCount = countDescendants(child, phylogeneticRelations);
      const adaptiveSpacing = Math.log(1 + descendantCount) * 0.3 / (depth + 1);
      const adjustedRadius = baseRadius + adaptiveSpacing;
      
      const childAngle = angle + (i - (children.length - 1) / 2) * angleStep;
      const rad = THREE.MathUtils.degToRad(childAngle);

      const { period: periodChild } = taxonomyData[child];
      const timeDiff = Math.abs(period - periodChild);

      const spiralFactor = depth * 0.2;
      const childX = position.x + adjustedRadius * Math.cos(rad + spiralFactor);
      const childZ = position.z + adjustedRadius * Math.sin(rad + spiralFactor);
      const childY = finalPosition.y + (timeDiff / 400);

      const childPos = new THREE.Vector3(childX, childY, childZ);

      branches.push({
        start: finalPosition.clone(),
        end: childPos.clone(),
        parentSpecies: species,
        childSpecies: child,
        color: getTaxonColor(species)
      });

      createBranch(child, childPos, childAngle, baseRadius, depth + 1);
    });
  };

  createBranch(rootName, new THREE.Vector3(rootPosition.x, rootPosition.y, rootPosition.z), angle, 3, depth);
  return { nodes, branches };
}

// Structure en forme d'étamine (comme une fleur)
export function createEtamineStructure(rootName, rootPosition, depth, maxDepth, angle, taxonomyData, phylogeneticRelations, getTaxonColor) {
  const nodes = [];
  const branches = [];
  const visited = new Set();

  const createEtamineNode = (name, parentPosition, depth, angle, index, total) => {
    if (visited.has(name) || !taxonomyData[name]) return;

    visited.add(name);
    const data = taxonomyData[name];
    const { period } = data;
    
    // Ajuster le rayon pour une meilleure visibilité
    const baseRadius = 5 * Math.pow(0.9, depth);
    const radius = baseRadius + (maxDepth - depth) * 2.0;
    
    // Calculer l'angle et la position
    const angleStep = (2 * Math.PI) / total;
    const currentAngle = angle + (index * angleStep);
    
    // Position Y basée sur la période avec un espacement plus grand
    const yPosition = parentPosition.y + (period / 300);
    
    const position = new THREE.Vector3(
      parentPosition.x + radius * Math.cos(currentAngle),
      yPosition,
      parentPosition.z + radius * Math.sin(currentAngle)
    );

    nodes.push({
      name,
      position: position.clone(),
      color: getTaxonColor(data.group),
      data,
      depth,
      period
    });

    if (parentPosition) {
      branches.push({
        parentSpecies: Object.keys(phylogeneticRelations).find(key => 
          phylogeneticRelations[key].includes(name)
        ),
        childSpecies: name,
        start: parentPosition.clone(),
        end: position.clone(),
        color: getTaxonColor(data.group)
      });
    }

    const children = phylogeneticRelations[name] || [];
    const childAngle = currentAngle;
    const childTotal = children.length;

    children.forEach((child, childIndex) => {
      createEtamineNode(
        child,
        position,
        depth + 1,
        childAngle,
        childIndex,
        childTotal
      );
    });
  };

  // Commencer avec le nœud racine
  const rootData = taxonomyData[rootName];
  const rootPositionVector = new THREE.Vector3(rootPosition.x, rootPosition.y, rootPosition.z);
  
  nodes.push({
    name: rootName,
    position: rootPositionVector.clone(),
    color: getTaxonColor(rootData.group),
    data: rootData,
    depth: 0,
    period: rootData.period
  });

  // Créer les nœuds enfants en forme d'étamine
  const children = phylogeneticRelations[rootName] || [];
  children.forEach((child, index) => {
    createEtamineNode(
      child,
      rootPositionVector,
      depth + 1,
      angle,
      index,
      children.length
    );
  });

  return { nodes, branches };
}

// Fonction utilitaire pour compter les descendants
function countDescendants(taxon, relations) {
  const children = relations[taxon] || [];
  let count = children.length;

  children.forEach(child => {
    count += countDescendants(child, relations);
  });

  return count;
}
