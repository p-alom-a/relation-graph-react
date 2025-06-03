import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { useMemo } from 'react';

export function getTaxonColor(name, taxonomyData, taxonomyGroups) {
  const group = taxonomyData[name]?.group || "luca";
  return taxonomyGroups[group] || "#6495ED";
}

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

export function buildPhylogeneticTree(taxonomyData, taxonomyGroups, phylogeneticRelations) {
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

          node1.position.add(repulsionVector);
          node2.position.sub(repulsionVector);
        }
      }
    }

    return nodesCopy;
  }

  function calculateNodePositions() {
    const nodePositions = {};
    const nodes = [];
    const branches = [];

    const maxDepth = 12;
    const curvature = 1.5;

    const createBranch = (species, depth = 0, angleOffset = 0, parentPos = new THREE.Vector3(0, 0, 0), parentSpecies = null) => {
        if (!taxonomyData[species] || depth > maxDepth) return;
      
        const children = phylogeneticRelations[species] || [];
        const baseAngleStep = (Math.PI * 2) / Math.max(children.length, 1);
        const compressedAngleStep = baseAngleStep * Math.exp(-depth * curvature);
      
        const radius = Math.log(depth + 1) * 1.5; // Ajustement du rayon pour réduire la distance entre les nœuds
        const angle = angleOffset;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const y = -(taxonomyData[species].period || 0) / 400;
      
        const position = new THREE.Vector3(x, y, z);
      
        nodePositions[species] = position;
        nodes.push({ name: species, position, depth });
      
        if (depth > 0 && parentSpecies) {
          branches.push({
            start: parentPos.clone(),
            end: position.clone(),
            parentSpecies,
            childSpecies: species,
            color: getTaxonColor(species, taxonomyData, taxonomyGroups),
          });
        }
      
        children.forEach((child, i) => {
          const childAngle = angleOffset + (i - (children.length - 1) / 2) * compressedAngleStep;
          createBranch(child, depth + 1, childAngle, position, species);
        });
      };
      

    createBranch("LUCA");

    const repulsedNodes = applyRepulsion(nodes, 0.2, 1.4);
    const nodeMap = Object.fromEntries(repulsedNodes.map(n => [n.name, n.position]));

    const updatedBranches = branches.map(branch => ({
      ...branch,
      start: nodeMap[branch.parentSpecies] || branch.start,
      end: nodeMap[branch.childSpecies] || branch.end
    })).filter(b => b.start && b.end);

    return { nodes: repulsedNodes, branches: updatedBranches };
  }

  return calculateNodePositions();
}

// ============================================================================
// Note Explicative : Logique du Code pour l'Arbre Phylogénétique Radial
// ============================================================================

// Ce code implémente un arbre phylogénétique en utilisant une approche radiale
// pour positionner les nœuds dans un espace 3D. Voici une explication détaillée
// de la logique du code.

// --------------------------------------------------------------------
// 1. Importations et Dépendances
// --------------------------------------------------------------------

// - `THREE` : Utilisé pour les calculs vectoriels et géométriques en 3D.
// - `Line` : Composant de `@react-three/drei` pour dessiner des lignes entre les nœuds.
// - `useMemo` : Hook React pour mémoriser les calculs et optimiser les performances.

// --------------------------------------------------------------------
// 2. Fonctions Principales
// --------------------------------------------------------------------

// --------------------------------------------------------------------
// 2.1. getTaxonColor
// --------------------------------------------------------------------

// - **Objectif** : Détermine la couleur d'un taxon en fonction de son groupe.
// - **Paramètres** :
//   - `name` : Nom du taxon.
//   - `simplifiedTaxonomyData` : Données de taxonomie contenant les groupes.
//   - `simplifiedTaxonomyGroups` : Mappage des groupes à des couleurs.
// - **Logique** : Récupère le groupe du taxon et retourne la couleur associée.

// --------------------------------------------------------------------
// 2.2. PhyloBranch
// --------------------------------------------------------------------

// - **Objectif** : Composant React pour dessiner une branche entre deux nœuds.
// - **Paramètres** :
//   - `start` et `end` : Vecteurs de position pour le début et la fin de la branche.
//   - `color` : Couleur de la branche.
//   - `thickness` : Épaisseur de la branche.
// - **Logique** : Utilise `useMemo` pour mémoriser les points de la ligne et dessine une ligne entre les points de début et de fin.

// --------------------------------------------------------------------
// 2.3. buildPhylogeneticTree
// --------------------------------------------------------------------

// - **Objectif** : Construit la structure de l'arbre phylogénétique.
// - **Paramètres** :
//   - `simplifiedTaxonomyData` : Données de taxonomie simplifiées.
//   - `simplifiedTaxonomyGroups` : Groupes de taxonomie simplifiés.
//   - `simplifiedPhylogeneticRelations` : Relations phylogénétiques simplifiées.
// - **Logique** : Calcule les positions des nœuds et génère les branches de l'arbre.

// --------------------------------------------------------------------
// 3. Fonctions Auxiliaires
// --------------------------------------------------------------------

// --------------------------------------------------------------------
// 3.1. applyRepulsion
// --------------------------------------------------------------------

// - **Objectif** : Applique une force de répulsion entre les nœuds pour éviter les chevauchements.
// - **Paramètres** :
//   - `nodes` : Liste des nœuds avec leurs positions.
//   - `repulsionStrength` : Force de la répulsion.
//   - `minDistance` : Distance minimale entre les nœuds.
// - **Logique** : Calcule les vecteurs de répulsion et ajuste les positions des nœuds pour éviter les chevauchements.

// --------------------------------------------------------------------
// 3.2. calculateNodePositions
// --------------------------------------------------------------------

// - **Objectif** : Calcule les positions des nœuds dans l'espace 3D.
// - **Logique** : Utilise une approche récursive pour créer les branches et positionner les nœuds radialement.

// --------------------------------------------------------------------
// 3.3. countAllDescendants
// --------------------------------------------------------------------

// - **Objectif** : Compte le nombre total de descendants d'un taxon.
// - **Paramètres** :
//   - `species` : Nom du taxon.
// - **Logique** : Récursivement compte le nombre de descendants.

// --------------------------------------------------------------------
// 3.4. createBranch
// --------------------------------------------------------------------

// - **Objectif** : Crée une branche de l'arbre phylogénétique.
// - **Paramètres** :
//   - `species` : Nom du taxon.
//   - `depth` : Profondeur actuelle dans l'arbre.
//   - `angleOffset` : Angle de départ pour positionner les nœuds enfants.
//   - `parentPos` : Position du nœud parent.
//   - `parentSpecies` : Nom du taxon parent.
// - **Logique** : Positionne les nœuds enfants radialement autour du parent et crée les branches.

// --------------------------------------------------------------------
// 4. Gestion de la Temporalité
// --------------------------------------------------------------------

// - **Objectif** : Positionne les nœuds le long de l'axe Y en fonction de leur période temporelle.
// - **Logique** :
//   - Utilise la période du taxon pour calculer la position Y.
//   - Ajuste la position verticale en fonction de la période du taxon.

// --------------------------------------------------------------------
// 5. Génération de la Structure de l'Arbre
// --------------------------------------------------------------------

// - **Objectif** : Génère la structure finale de l'arbre avec les positions des nœuds et les branches.
// - **Logique** :
//   - Calcule les positions initiales des nœuds.
//   - Applique la répulsion pour éviter les chevauchements.
//   - Met à jour les positions des branches en fonction des positions ajustées des nœuds.

// ============================================================================
// Conclusion
// ============================================================================

// Ce code utilise une approche radiale pour visualiser un arbre phylogénétique
// en 3D, en prenant en compte les périodes temporelles pour positionner les nœuds
// le long de l'axe Y. La fonction de répulsion aide à éviter les chevauchements
// et améliore la lisibilité de l'arbre.
