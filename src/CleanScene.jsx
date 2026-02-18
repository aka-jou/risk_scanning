// src/CleanScene.jsx
import React from 'react';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

// --- DATOS DE LAS PARTES INTERACTIVAS (Hitboxes) ---
// Ajusta la posición, rotación y escala para que coincidan con TU modelo.
export const inspectionData = [
  {
    id: "aspa1", title: "Aspa 1 (Pala A)", status: "critical", anomalies: 3,
    description: "Múltiples fisuras detectadas en el borde de ataque. Alta probabilidad de deslaminación interna.",
    lastScan: "Hoy, 10:30 AM",
    hitbox: { position: [0, 8, 2.5], rotation: [0, 0, 0.5], scale: [1.5, 7, 1] }
  },
  {
    id: "aspa2", title: "Aspa 2 (Pala B)", status: "healthy", anomalies: 0,
    description: "Estructura íntegra. Desgaste superficial normal por erosión.",
    lastScan: "Hoy, 10:35 AM",
    hitbox: { position: [-6, 3, -2], rotation: [0, 0, -2.5], scale: [1.5, 7, 1] }
  },
  {
    id: "aspa3", title: "Aspa 3 (Pala C)", status: "warning", anomalies: 1,
    description: "Impacto menor detectado cerca de la punta. Requiere monitoreo.",
    lastScan: "Hoy, 10:40 AM",
    hitbox: { position: [6, 3, -2], rotation: [0, 0, 2.5], scale: [1.5, 7, 1] }
  },
  {
    id: "torre", title: "Torre / Góndola", status: "healthy", anomalies: 0,
    description: "Sin anomalías estructurales en la unión de bridas.",
    lastScan: "Hoy, 10:45 AM",
    hitbox: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [2, 10, 2] }
  }
];

// --- COMPONENTE: Hitbox Invisible ---
function InvisibleHitbox({ data, onClick }) {
  return (
    <mesh
      position={data.hitbox.position}
      rotation={data.hitbox.rotation}
      scale={data.hitbox.scale}
      onClick={(e) => { e.stopPropagation(); onClick(data); }} // Detiene la propagación para no clickear múltiples cosas
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'default'}
      visible={false} // ¡El truco mágico! Es invisible pero interactivo.
    >
      <capsuleGeometry args={[1, 1, 16, 32]} />
      <meshBasicMaterial color="red" transparent opacity={0.5} />
    </mesh>
  );
}

// --- COMPONENTE PRINCIPAL DE LA ESCENA ---
export function CleanScene({ onPartClick }) {
  // Carga el modelo STL. Asegúrate de que 'single_color.stl' esté en tu carpeta 'public'.
  const geometry = useLoader(STLLoader, "/single_color.stl");

  return (
    <group>
      {/* El Modelo STL Visual (Solo para ver, no interactúa) */}
      {/* Ajusta 'scale' si lo ves muy grande o muy pequeño */}
      <mesh geometry={geometry} scale={0.08} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Material cerámico blanco/gris limpio */}
        <meshPhysicalMaterial color="#f1f5f9" metalness={0.1} roughness={0.5} clearcoat={0.5} />
      </mesh>

      {/* Las Hitboxes Invisibles (Estas sí interactúan) */}
      {inspectionData.map(part => (
        <InvisibleHitbox key={part.id} data={part} onClick={onPartClick} />
      ))}
    </group>
  );
}