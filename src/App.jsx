// src/App.jsx
import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Center, Html } from "@react-three/drei";
import { FiHome, FiActivity, FiFileText, FiSettings, FiUser, FiSearch } from "react-icons/fi";
// 👇 IMPORTANTE: Importamos tu nueva escena 3D
import { CleanScene } from './CleanScene';

// --- Componente Reutilizable: Botón del Menú Lateral ---
const SidebarItem = ({ icon, text, active }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${active ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
    {icon}
    <span className="font-semibold text-sm">{text}</span>
  </div>
);

export default function App() {
  const [selectedPart, setSelectedPart] = useState(null);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#F3F5F9] font-sans text-slate-800 overflow-hidden">
      
      {/* ==========================================
          1. BARRA LATERAL (Menú)
      ========================================== */}
      <div className="w-full md:w-[240px] p-4 md:p-8 flex md:flex-col items-center md:items-start justify-between md:justify-start bg-white border-b md:border-b-0 md:border-r border-slate-100 z-10 shrink-0">
         <div className="flex items-center gap-3 md:mb-12">
            <div className="w-8 h-8 bg-[#FF5722] rounded-lg shadow-sm shadow-orange-200"></div>
            <h2 className="text-xl font-extrabold m-0 text-slate-800">SkyGuardians</h2>
         </div>

         <nav className="hidden md:flex flex-col gap-2 w-full flex-1">
            <SidebarItem icon={<FiHome size={20} />} text="Dashboard" active />
            <SidebarItem icon={<FiActivity size={20} />} text="Inspecciones" />
            <SidebarItem icon={<FiFileText size={20} />} text="Reportes" />
            <SidebarItem icon={<FiSettings size={20} />} text="Configuración" />
         </nav>

         <div className="flex items-center gap-3 p-2 md:p-3 bg-slate-50 rounded-xl border border-slate-100 w-auto md:w-full">
            <FiUser size={20} className="text-slate-400" />
            <div className="hidden md:block">
               <p className="m-0 font-bold text-sm text-slate-700">Ing. Pedro</p>
               <p className="m-0 text-xs text-slate-400">Supervisor</p>
            </div>
         </div>
      </div>


      {/* ==========================================
          2. CONTENIDO PRINCIPAL (Dashboard)
      ========================================== */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col">
         
         <header className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4 md:gap-0">
            <div>
               <h1 className="text-2xl md:text-3xl font-extrabold m-0 tracking-tight">WTG-04</h1>
               <p className="text-sm text-slate-500 m-0 mt-1">Parque Eólico La Ventosa, Oaxaca</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
               <div className="bg-white px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm border border-slate-100">
                  <FiSearch className="text-slate-400" />
                  <input type="text" placeholder="Buscar aerogenerador..." className="border-none outline-none text-sm bg-transparent placeholder-slate-400" />
               </div>
            </div>
         </header>

         {/* --- Cuadrícula de Tarjetas --- */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 flex-1 min-h-0">
            
            {/* TARJETA IZQUIERDA: Visor 3D */}
            <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden min-h-[400px] md:min-h-0">
               <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                  <h3 className="font-bold text-base m-0">Gemelo Digital 3D</h3>
                  <span className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold text-slate-500">Interactivo</span>
               </div>
               
               <div className="flex-1 relative w-full h-full bg-slate-50/50">
                  {/* AQUÍ VA EL CANVAS DE THREE.JS */}
                  <Canvas camera={{ position: [0, 5, 25], fov: 50 }}>
                     <ambientLight intensity={0.5} />
                     <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
                     {/* Entorno de estudio fotográfico */}
                     <Environment preset="city" />
                     
                     <Suspense fallback={<Html center><span className="text-slate-500 font-semibold">Cargando Modelo...</span></Html>}>
                        {/* 👇 Center mantiene el modelo centrado */}
                        <Center>
                           {/* 👇 Aquí usamos tu nuevo componente */}
                           <CleanScene onPartClick={setSelectedPart} />
                        </Center>
                     </Suspense>

                     {/* 👇 Controles para Zoom, Rotar y Panear */}
                     <OrbitControls makeDefault minDistance={5} maxDistance={50} />
                     {/* Sombra de contacto en el suelo */}
                     <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={40} blur={2} far={4.5} />
                  </Canvas>

                  {!selectedPart && (
                     <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-lg pointer-events-none border border-slate-100">
                        <span className="text-xs font-bold text-slate-500">Toca una pieza del modelo para ver detalles</span>
                     </div>
                  )}
               </div>
            </div>

            {/* TARJETA DERECHA: Panel de Información */}
            <div className="col-span-1 flex flex-col gap-5">
               <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-base mb-4">Estado General</h3>
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-sm font-semibold text-slate-700">Operativo</span>
                  </div>
                  <p className="text-xs text-slate-400">Sincronizado hace 2 min</p>
               </div>

               {/* Tarjeta Dinámica: Detalles de la Pieza */}
               {selectedPart ? (
                  <div className="bg-slate-800 p-6 rounded-2xl shadow-xl text-white transition-all duration-300 flex-1 flex flex-col">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <small className="text-slate-400 uppercase tracking-wider font-bold text-xs">Pieza Seleccionada</small>
                           <h3 className="font-bold text-xl text-orange-400 m-0">{selectedPart.title}</h3>
                        </div>
                        {/* Badge de Estado */}
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${selectedPart.status === 'critical' ? 'bg-red-500/20 text-red-400' : selectedPart.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                           {selectedPart.status === 'critical' ? 'Crítico' : selectedPart.status === 'warning' ? 'Alerta' : 'Óptimo'}
                        </div>
                     </div>
                     
                     <p className="text-sm text-slate-300 mb-6 leading-relaxed flex-1">{selectedPart.description}</p>
                     
                     <div className="space-y-3 mt-auto">
                        <div className="bg-slate-700/50 p-3 rounded-xl flex justify-between items-center">
                           <span className="text-xs text-slate-300">Anomalías Detectadas</span>
                           <span className="text-sm font-bold">{selectedPart.anomalies}</span>
                        </div>
                        <div className="bg-slate-700/50 p-3 rounded-xl flex justify-between items-center border-l-4 border-orange-500">
                           <span className="text-xs text-slate-300">Último Escaneo</span>
                           <span className="text-sm font-bold text-orange-300">{selectedPart.lastScan}</span>
                        </div>
                     </div>
                     
                     <button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-bold py-3 rounded-xl shadow-lg shadow-orange-500/30 cursor-pointer">
                        Ver Evidencia en Video
                     </button>
                  </div>
               ) : (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-2xl flex flex-col items-center justify-center text-center text-slate-400 flex-1 min-h-[250px] transition-all duration-300 hover:bg-slate-100">
                     <FiActivity size={32} className="mb-4 opacity-40" />
                     <p className="text-sm font-medium">Selecciona una pieza en el modelo 3D para ver su reporte detallado.</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}