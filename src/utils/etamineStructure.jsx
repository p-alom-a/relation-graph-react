export const createEtamineStructure = (rootName, rootPosition, depth, maxDepth, angle, taxonomyData, phylogeneticRelations, getTaxonColor) => {
  const nodes = [];
  const branches = [];
  const visited = new Set();

  const createEtamineNode = (name, centerPosition, depth, clusterId) => {
    if (visited.has(name) || !taxonomyData[name]) return;
    visited.add(name);

    const data = taxonomyData[name];
    const { period } = data;

    const clusterRadius = 0.8 + depth * 0.3;
    const randomAngle = Math.random() * 2 * Math.PI;
    const randomRadius = Math.random() * clusterRadius;

    const position = new THREE.Vector3(
      centerPosition.x + randomRadius * Math.cos(randomAngle),
      centerPosition.y + (Math.random() - 0.5) * 0.5,
      centerPosition.z + randomRadius * Math.sin(randomAngle)
    );

    nodes.push({
      name,
      position: position.clone(),
      depth,
      period,
      clusterId
    });

    const children = phylogeneticRelations[name] || [];
    children.forEach(child => {
      createEtamineNode(child, centerPosition, depth + 1, clusterId);
    });
  };

  const rootData = taxonomyData[rootName];
  const rootPositionVector = new THREE.Vector3(rootPosition.x, rootPosition.y, rootPosition.z);

  nodes.push({
    name: rootName,
    position: rootPositionVector.clone(),
    depth: 0,
    period: rootData.period,
    clusterId: 0
  });

  const children = phylogeneticRelations[rootName] || [];
  children.forEach((child, index) => {
    const clusterAngle = (index * 2 * Math.PI) / children.length;
    const clusterDistance = 2.5;

    const clusterCenter = new THREE.Vector3(
      rootPositionVector.x + clusterDistance * Math.cos(clusterAngle),
      rootPositionVector.y,
      rootPositionVector.z + clusterDistance * Math.sin(clusterAngle)
    );

    createEtamineNode(child, clusterCenter, 1, index + 1);
  });

  return { nodes, branches };
};
