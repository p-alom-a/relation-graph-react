import { useState, useEffect, useRef, useCallback } from 'react';
import { getTaxonColor } from './PhylogeneticTreeBuilder.jsx';
import { taxonomyGroups, taxonomyData } from '../data/taxonomyData.js';

// Hook personnalisé pour gérer la position de la souris et les info-bulles
export function useInfoTooltip() {
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
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return {
    hoveredInfo,
    mousePosition,
    handleNodeHover,
    handleNodeUnhover,
  };
}

// Info-bulle flottante
export function InfoTooltip({ info, position }) {
  if (!info) return null;

  return (
    <div className="info-tooltip" style={{
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
      border: `2px solid ${getTaxonColor(info.name, taxonomyData, taxonomyGroups)}`
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
        {info.name || 'Taxon'}
      </div>
      <div style={{ marginBottom: '5px' }}>
        Période: {info.period} Ma
      </div>
      <div>{info.description}</div>
    </div>
  );
}

// Légende des couleurs
export function ColorLegend() {
  const legendItems = [
    { group: 'luca', label: 'LUCA', color: taxonomyGroups.luca },
    { group: 'bacteria', label: 'Bacteria', color: taxonomyGroups.bacteria },
    { group: 'archaea', label: 'Archaea', color: taxonomyGroups.archaea },
    { group: 'archaeplastida', label: 'Archaeplastida', color: taxonomyGroups.archaeplastida },
    { group: 'sar_supergroup', label: 'SAR', color: taxonomyGroups.sar_supergroup },
    { group: 'excavata', label: 'Excavata', color: taxonomyGroups.excavata },
    { group: 'amoebozoa', label: 'Amoebozoa', color: taxonomyGroups.amoebozoa },
    { group: 'opisthokonta', label: 'Opisthokonta', color: taxonomyGroups.opisthokonta },
    { group: 'animals', label: 'Animaux', color: taxonomyGroups.animals },
    { group: 'fungi', label: 'Champignons', color: taxonomyGroups.fungi }
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

// Notes taxonomiques
export function TaxonomyNotes() {
  return (
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
  );
}
