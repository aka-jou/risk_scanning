import React, { useState, Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Center, Html } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiActivity, FiFileText, FiSettings, FiSearch, FiBell, FiUser, FiAlertTriangle, FiCheckCircle } from "react-icons/fi"; // Necesitas instalar react-icons

// ==========================================
// DATOS SIMULADOS DE INSPECCIÓN
// ==========================================
const inspectionData = [
  { 
    id: "aspa1", 
    title: "Aspa 1 (Pala A)", 
    status: "critical", 
    anomalies: 3,
    description: "Múltiples fisuras detectadas en el borde de ataque. Alta probabilidad de deslaminación interna.",
    lastScan: "Hoy, 10:30 AM",
    // HITBOX: Ajusta posición/rotación/escala para que cubra esta parte de TU modelo
    hitbox: { position: [0, 8, 2.5], rotation: [0, 0, 0.5], scale: [1.5, 7, 1] } 
  },
  { 
    id: "aspa2", 
    title: "Aspa 2 (Pala B)", 
    status: "healthy", 
    anomalies: 0,
    description: "Estructura íntegra. Desgaste superficial normal por erosión.",
    lastScan: "Hoy, 10:35 AM",
    hitbox: { position: [-6, 3, -2], rotation: [0, 0, -2.5], scale: [1.5, 7, 1] } 
  },
  { 
    id: "aspa3", 
    title: "Aspa 3 (Pala C)", 
    status: "warning", 
    anomalies: 1,
    description: "Impacto menor detectado cerca de la punta. Requiere monitoreo.",
    lastScan: "Hoy, 10:40 AM",
    hitbox: { position: [6, 3, -2], rotation: [0, 0, 2.5], scale: [1.5, 7, 1] } 
  },
   { 
    id: "torre", 
    title: "Torre / Góndola", 
    status: "healthy", 
    anomalies: 0,
    description: "Sin anomalías estructurales en la unión de bridas.",
    lastScan: "Hoy, 10:45 AM",
    hitbox: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [2, 10, 2] } 
  },
];

// ==========================================
// COMPONENTE: Hitbox Invisible
// ==========================================
// Esto es lo que el usuario realmente clickea, aunque no lo vea.
function InvisibleHitbox({ data, onClick }) {
    return (
      <mesh 
        position={data.hitbox.position} 
        rotation={data.hitbox.rotation} 
        scale={data.hitbox.scale}
        onClick={() => onClick(data)}
        onPointerOver={() => document.body.style.cursor = 'pointer'} 
        onPointerOut={() => document.body.style.cursor = 'default'}
        visible={false} // ¡El truco mágico! Es invisible pero interactivo.
      >
        {/* Usamos una cápsula como forma genérica para aspas/torres */}
        <capsuleGeometry args={[1, 1, 16, 32]} />
        <meshBasicMaterial color="red" transparent opacity={0.5} />
      </mesh>
    );
}

// ==========================================
// COMPONENTE: Escena 3D Limpia
// ==========================================
function CleanScene({ onPartClick }) {
  const geometry = useLoader(STLLoader, "/single_color.stl"); 

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow />
      {/* Entorno de estudio fotográfico luminoso */}
      <Environment preset="studio" /> 
      
      <Suspense fallback={<Html center><span style={{color:'#64748b'}}>Cargando Modelo...</span></Html>}>
        <Center>
            <group>
                {/* El Modelo STL Visual (Solo para ver, no interactúa) */}
                <mesh geometry={geometry} scale={0.05} rotation={[-Math.PI / 2, 0, 0]}>
                    {/* Material cerámico blanco/gris limpio */}
                    <meshPhysicalMaterial color="#f1f5f9" metalness={0.1} roughness={0.5} clearcoat={0.5} />
                </mesh>
                
                {/* Las Hitboxes Invisibles (Estas sí interactúan) */}
                {inspectionData.map(part => (
                    <InvisibleHitbox key={part.id} data={part} onClick={onPartClick} />
                ))}
            </group>
        </Center>
      </Suspense>
      
      <OrbitControls makeDefault minDistance={5} maxDistance={40} />
      <ContactShadows position={[0, -6, 0]} opacity={0.4} scale={40} blur={2.5} color="#cbd5e1"/>
    </>
  );
}


// ==========================================
// LAYOUT PRINCIPAL (Estilo Dashboard Luminoso)
// ==========================================
export default function App() {
  const [selectedPart, setSelectedPart] = useState(null);

  // Estilos comunes para las "tarjetas" del dashboard
  const cardStyle = {
      background: '#FFFFFF',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0px 10px 30px rgba(0,0,0,0.05)', // Sombra suave estilo Apple
      border: '1px solid #F1F5F9'
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F3F5F9', fontFamily: "'DM Sans', sans-serif", color: '#1e293b' }}>
      
      {/* --- SIDEBAR IZQUIERDA --- */}
      <div style={{ width: '240px', padding: '30px', display: 'flex', flexDirection: 'column', background: '#FFFFFF', borderRight: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '50px' }}>
            <div style={{ width: '36px', height: '36px', background: '#FF5722', borderRadius: '10px' }}></div> {/* Placeholder logo */}
            <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800 }}>SkyGuardians</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <SidebarItem icon={<FiHome />} text="Dashboard" active />
            <SidebarItem icon={<FiActivity />} text="Inspecciones" />
            <SidebarItem icon={<FiFileText />} text="Reportes" />
            <SidebarItem icon={<FiSettings />} text="Configuración" />
        </nav>

        <div style={{ ...cardStyle, padding: '16px', background: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiUser size={20} color="#64748b"/>
            <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>Ing. Pedro</p>
                <small style={{ color: '#94a3b8' }}>Supervisor</small>
            </div>
        </div>
      </div>


      {/* --- CONTENIDO PRINCIPAL (DERECHA) --- */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        
        {/* HEADER SUPERIOR */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
                <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Inspección Activa: WTG-04</h1>
                <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>Parque Eólico La Ventosa, Oaxaca</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: '#FFFFFF', padding: '10px 15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0px 5px 15px rgba(0,0,0,0.03)' }}>
                    <FiSearch color="#94a3b8" />
                    <input type="text" placeholder="Buscar número de serie..." style={{ border: 'none', outline: 'none', color: '#1e293b' }} />
                </div>
                <button style={{ background: '#FFFFFF', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer', boxShadow: '0px 5px 15px rgba(0,0,0,0.03)' }}><FiBell color="#64748b" size={20}/></button>
            </div>
        </header>

        {/* GRID DEL DASHBOARD */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', flex: 1, minHeight: 0 }}>
            
            {/* Tarjeta Principal: VISOR 3D */}
            <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0 }}>Gemelo Digital 3D</h3>
                    <span style={{ background: '#F1F5F9', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#64748b' }}>Interactivo</span>
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Canvas camera={{ position: [0, 5, 25], fov: 45 }}>
                        <CleanScene onPartClick={setSelectedPart} />
                    </Canvas>
                    
                    {!selectedPart && (
                         <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.9)', padding: '10px 20px', borderRadius: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', pointerEvents: 'none' }}>
                            <small style={{ color: '#64748b', fontWeight: 600 }}>Haz clic en una parte del aerogenerador para ver detalles</small>
                        </div>
                    )}
                </div>
            </div>

            {/* Columna Derecha: RESULTADOS DINÁMICOS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* Tarjeta de Resumen General */}
                <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 20px 0' }}>Estado General</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiAlertTriangle size={28} color="#EF4444" />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#EF4444' }}>3 Críticas</h2>
                            <p style={{ margin: 0, color: '#64748b' }}>Anomalías detectadas hoy</p>
                        </div>
                    </div>
                    <button style={{ width: '100%', padding: '15px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Ver Informe Completo</button>
                </div>

                {/* Tarjeta de Detalle de Pieza (Animada) */}
                <AnimatePresence mode="wait">
                    {selectedPart ? (
                        <motion.div 
                            key={selectedPart.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            style={{ ...cardStyle, flex: 1, display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                                <div>
                                    <small style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Pieza Seleccionada</small>
                                    <h3 style={{ margin: '5px 0 0 0', fontSize: '1.5rem' }}>{selectedPart.title}</h3>
                                </div>
                                <StatusBadge status={selectedPart.status} />
                            </div>
                            
                            <p style={{ lineHeight: '1.6', color: '#475569', flex: 1 }}>{selectedPart.description}</p>
                            
                            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.9rem' }}>
                                    <span style={{ color: '#94a3b8' }}>Último escaneo:</span>
                                    <span style={{ fontWeight: 600 }}>{selectedPart.lastScan}</span>
                                </div>
                                <button style={{ width: '100%', padding: '12px', background: '#F1F5F9', color: '#1e293b', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    Ver Evidencia (Video/Foto)
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        // Estado vacío si no hay nada seleccionado
                        <motion.div 
                             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                             style={{ ...cardStyle, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', color: '#94a3b8' }}>
                            <FiSearch size={40} style={{ marginBottom: '15px', opacity: 0.5 }}/>
                            <p>Selecciona una parte en el modelo 3D para ver sus detalles.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>

      </div>
    </div>
  );
}

// --- Componentes Auxiliares para el UI ---

function SidebarItem({ icon, text, active }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', background: active ? '#FF5722' : 'transparent', color: active ? 'white' : '#64748b', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }}>
            {icon}
            <span>{text}</span>
        </div>
    )
}

function StatusBadge({ status }) {
    const config = {
        critical: { color: '#EF4444', bg: '#FEF2F2', text: 'Crítico', icon: <FiAlertTriangle /> },
        warning: { color: '#F59E0B', bg: '#FFFBEB', text: 'Alerta', icon: <FiAlertTriangle /> },
        healthy: { color: '#10B981', bg: '#ECFDF5', text: 'Óptimo', icon: <FiCheckCircle /> },
    };
    const current = config[status];
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: current.bg, color: current.color, fontWeight: 700, fontSize: '0.85rem' }}>
            {current.icon}
            {current.text}
        </div>
    )
}