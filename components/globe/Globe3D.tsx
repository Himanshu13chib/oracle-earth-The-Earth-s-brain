'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Html } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import GlobeLoader from './GlobeLoader';

interface ConflictData {
  id: number;
  country1: string;
  country2: string;
  probability: number;
  factors: string;
  lastUpdated: string;
  coordinates?: [number, number]; // [lat, lng]
}

interface EnvironmentData {
  id: number;
  region: string;
  type: 'deforestation' | 'co2' | 'glacier' | 'temperature';
  value: number;
  unit: string;
  coordinates: string; // "lat,lng"
  timestamp: string;
}

interface Globe3DProps {
  conflicts: ConflictData[];
  environmentData: EnvironmentData[];
  showCities?: boolean;
  showCountryLabels?: boolean;
}

// Convert lat/lng to 3D sphere coordinates
function latLngToVector3(lat: number, lng: number, radius: number = 2) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Comprehensive country coordinates mapping
const countryCoordinates: { [key: string]: [number, number] } = {
  'Russia': [61.5240, 105.3188],
  'Ukraine': [48.3794, 31.1656],
  'China': [35.8617, 104.1954],
  'Taiwan': [23.6978, 120.9605],
  'India': [20.5937, 78.9629],
  'Pakistan': [30.3753, 69.3451],
  'United States': [37.0902, -95.7129],
  'Afghanistan': [33.9391, 67.7100],
  'Syria': [34.8021, 38.9968],
  'Nigeria': [9.0820, 8.6753],
  'Somalia': [5.1521, 46.1996],
  'Iran': [32.4279, 53.6880],
  'Iraq': [33.2232, 43.6793],
  'Israel': [31.0461, 34.8516],
  'Palestine': [31.9522, 35.2332],
  'North Korea': [40.3399, 127.5101],
  'South Korea': [35.9078, 127.7669],
  'Japan': [36.2048, 138.2529],
  'Turkey': [38.9637, 35.2433],
  'Saudi Arabia': [23.8859, 45.0792],
  'Yemen': [15.5527, 48.5164],
  'Libya': [26.3351, 17.2283],
  'Egypt': [26.0975, 30.0444],
  'Ethiopia': [9.1450, 40.4897],
  'Sudan': [12.8628, 30.2176],
  'Mali': [17.5707, -3.9962],
  'Venezuela': [6.4238, -66.5897],
  'Colombia': [4.5709, -74.2973],
  'Brazil': [-14.2350, -51.9253],
  'Argentina': [-38.4161, -63.6167],
  'Mexico': [23.6345, -102.5528],
  'Canada': [56.1304, -106.3468],
  'United Kingdom': [55.3781, -3.4360],
  'France': [46.6034, 2.2137],
  'Germany': [51.1657, 10.4515],
  'Italy': [41.8719, 12.5674],
  'Spain': [40.4637, -3.7492],
  'Poland': [51.9194, 19.1451],
  'Australia': [-25.2744, 133.7751],
  'Indonesia': [-0.7893, 113.9213],
  'Thailand': [15.8700, 100.9925],
  'Vietnam': [14.0583, 108.2772],
  'Philippines': [12.8797, 121.7740],
  'Myanmar': [21.9162, 95.9560],
  'Bangladesh': [23.6850, 90.3563],
  'Sri Lanka': [7.8731, 80.7718],
  'Kazakhstan': [48.0196, 66.9237],
  'Uzbekistan': [41.3775, 64.5853],
  'Mongolia': [47.0105, 106.3468],
  'South Africa': [-30.5595, 22.9375],
  'Kenya': [-0.0236, 37.9062],
  'Morocco': [31.7917, -7.0926],
  'Algeria': [28.0339, 1.6596],
  'Tunisia': [33.8869, 9.5375],
  'Ghana': [7.9465, -1.0232],
  'Ivory Coast': [7.5400, -5.5471],
  'Senegal': [14.4974, -14.4524],
  'Democratic Republic of Congo': [-4.0383, 21.7587],
  'Angola': [-11.2027, 17.8739],
  'Zambia': [-13.1339, 27.8493],
  'Zimbabwe': [-19.0154, 29.1549],
  'Botswana': [-22.3285, 24.6849],
  'Namibia': [-22.9576, 18.4904],
  'Madagascar': [-18.7669, 46.8691],
  'Mozambique': [-18.6657, 35.5296],
  'Tanzania': [-6.3690, 34.8888],
  'Uganda': [1.3733, 32.2903],
  'Rwanda': [-1.9403, 29.8739],
  'Burundi': [-3.3731, 29.9189],
  'Malawi': [-13.2543, 34.3015],
  'Chile': [-35.6751, -71.5430],
  'Peru': [-9.1900, -75.0152],
  'Ecuador': [-1.8312, -78.1834],
  'Bolivia': [-16.2902, -63.5887],
  'Paraguay': [-23.4425, -58.4438],
  'Uruguay': [-32.5228, -55.7658],
  'Guyana': [4.8604, -58.9302],
  'Suriname': [3.9193, -56.0278],
  'French Guiana': [3.9339, -53.1258],
};

// Region coordinates for environmental data
const regionCoordinates: { [key: string]: [number, number] } = {
  'Amazon Basin': [-3.4653, -62.2159],
  'Arctic': [71.0, -8.0],
  'Global': [0, 0],
};

// Simple, clean 3D Earth globe
function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      {/* Simple Earth sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#4A90E2"
          transparent
          opacity={0.9}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Simple wireframe overlay for grid */}
      <mesh>
        <sphereGeometry args={[2.01, 32, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}

function ConflictMarker({ 
  position, 
  conflict, 
  onClick 
}: { 
  position: THREE.Vector3; 
  conflict: ConflictData;
  onClick: (conflict: ConflictData) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
      const scale = hovered ? 1.8 : 1.2;
      meshRef.current.scale.setScalar(scale);
    }
    
    if (pulseRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 1;
      pulseRef.current.scale.setScalar(pulse);
      const material = pulseRef.current.material as THREE.MeshBasicMaterial;
      if (material && 'opacity' in material) {
        material.opacity = (2 - pulse) * 0.3;
      }
    }
  });

  const getConflictColor = (probability: number) => {
    if (probability > 70) return '#ff1a1a'; // Bright red
    if (probability > 40) return '#ff8c1a'; // Orange
    return '#1aff1a'; // Green
  };

  const color = getConflictColor(conflict.probability);

  return (
    <group position={position}>
      {/* Pulsing ring effect */}
      <mesh
        ref={pulseRef}
        onClick={() => onClick(conflict)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <ringGeometry args={[0.08, 0.12, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Main conflict marker */}
      <mesh
        ref={meshRef}
        onClick={() => onClick(conflict)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <octahedronGeometry args={[0.06, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      
      {/* Danger beam for high-risk conflicts */}
      {conflict.probability > 70 && (
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.002, 0.002, 1, 8]} />
          <meshBasicMaterial
            color="#ff0000"
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
      
      {hovered && (
        <Html 
          position={[0, 0.3, 0]} 
          center
          distanceFactor={8}
          occlude={false}
          transform={false}
          sprite={true}
        >
          <div className="bg-black/95 text-white p-3 rounded-lg text-sm max-w-xs border border-red-500/50 shadow-lg backdrop-blur-sm">
            <div className="font-bold text-red-400 flex items-center gap-1">
              ⚔️ {conflict.country1} vs {conflict.country2}
            </div>
            <div className="text-yellow-300 font-semibold">Risk: {conflict.probability}%</div>
            <div className="text-gray-300 text-xs mt-1">
              {conflict.factors.split(',').slice(0, 2).join(', ')}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Updated: {new Date(conflict.lastUpdated).toLocaleDateString()}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function EnvironmentMarker({ 
  position, 
  data, 
  onClick 
}: { 
  position: THREE.Vector3; 
  data: EnvironmentData;
  onClick: (data: EnvironmentData) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const effectRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.3;
      const scale = hovered ? 1.8 : 1.2;
      meshRef.current.scale.setScalar(scale);
    }
    
    if (effectRef.current) {
      effectRef.current.rotation.y = -state.clock.elapsedTime * 0.5;
      const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      effectRef.current.scale.setScalar(breathe);
    }
  });

  const getEnvironmentData = (type: string) => {
    switch (type) {
      case 'deforestation':
        return {
          color: '#8B4513',
          emissive: '#654321',
          geometry: 'box',
          icon: '🌳',
          severity: data.value > 10 ? 'critical' : data.value > 5 ? 'high' : 'medium'
        };
      case 'co2':
        return {
          color: '#666666',
          emissive: '#444444',
          geometry: 'sphere',
          icon: '💨',
          severity: data.value > 400 ? 'critical' : data.value > 350 ? 'high' : 'medium'
        };
      case 'glacier':
        return {
          color: '#87CEEB',
          emissive: '#4682B4',
          geometry: 'cone',
          icon: '🧊',
          severity: data.value < -5 ? 'critical' : data.value < -2 ? 'high' : 'medium'
        };
      case 'temperature':
        return {
          color: '#FF6347',
          emissive: '#FF4500',
          geometry: 'tetrahedron',
          icon: '🌡️',
          severity: data.value > 1.5 ? 'critical' : data.value > 1 ? 'high' : 'medium'
        };
      default:
        return {
          color: '#00ff00',
          emissive: '#008800',
          geometry: 'sphere',
          icon: '🌍',
          severity: 'medium'
        };
    }
  };

  const envData = getEnvironmentData(data.type);
  const isCritical = envData.severity === 'critical';

  return (
    <group position={position}>
      {/* Warning effect for critical environmental issues */}
      {isCritical && (
        <mesh ref={effectRef}>
          <ringGeometry args={[0.1, 0.15, 16]} />
          <meshBasicMaterial
            color="#ff4444"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Main environmental marker */}
      <mesh
        ref={meshRef}
        onClick={() => onClick(data)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {data.type === 'deforestation' && <boxGeometry args={[0.08, 0.08, 0.08]} />}
        {data.type === 'co2' && <sphereGeometry args={[0.06, 12, 12]} />}
        {data.type === 'glacier' && <coneGeometry args={[0.06, 0.12, 8]} />}
        {data.type === 'temperature' && <tetrahedronGeometry args={[0.07, 0]} />}
        <meshStandardMaterial
          color={envData.color}
          emissive={envData.emissive}
          emissiveIntensity={isCritical ? 0.4 : 0.2}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>
      
      {/* Critical warning beam */}
      {isCritical && (
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.8, 8]} />
          <meshBasicMaterial
            color="#ff6600"
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
      
      {hovered && (
        <Html 
          position={[0, 0.35, 0]} 
          center
          distanceFactor={8}
          occlude={false}
          transform={false}
          sprite={true}
        >
          <div className="bg-black/95 text-white p-3 rounded-lg text-sm max-w-xs border border-green-500/50 shadow-lg backdrop-blur-sm">
            <div className="font-bold text-green-400 flex items-center gap-2">
              <span>{envData.icon}</span>
              {data.region}
            </div>
            <div className="text-blue-300 capitalize font-semibold">{data.type}</div>
            <div className="text-yellow-300 font-semibold">
              Value: {data.value}{data.unit}
            </div>
            <div className={`text-xs mt-1 font-semibold ${
              isCritical ? 'text-red-400' : 
              envData.severity === 'high' ? 'text-orange-400' : 'text-green-400'
            }`}>
              Severity: {envData.severity.toUpperCase()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Updated: {new Date(data.timestamp).toLocaleDateString()}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Major cities for reference points
const majorCities = [
  { name: 'New York', coords: [40.7128, -74.0060], population: '8.3M' },
  { name: 'London', coords: [51.5074, -0.1278], population: '9M' },
  { name: 'Tokyo', coords: [35.6762, 139.6503], population: '14M' },
  { name: 'Beijing', coords: [39.9042, 116.4074], population: '21M' },
  { name: 'Moscow', coords: [55.7558, 37.6173], population: '12M' },
  { name: 'Mumbai', coords: [19.0760, 72.8777], population: '20M' },
  { name: 'São Paulo', coords: [-23.5505, -46.6333], population: '12M' },
  { name: 'Cairo', coords: [30.0444, 31.2357], population: '10M' },
  { name: 'Lagos', coords: [6.5244, 3.3792], population: '15M' },
  { name: 'Sydney', coords: [-33.8688, 151.2093], population: '5M' },
];

function CityMarker({ name, position, population }: { name: string; position: THREE.Vector3; population: string }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial
          color="#ffff00"
          transparent
          opacity={0.8}
        />
      </mesh>
      {hovered && (
        <Html 
          position={[0, 0.1, 0]} 
          center
          distanceFactor={6}
          occlude={false}
          transform={false}
          sprite={true}
        >
          <div className="bg-yellow-900/95 text-white p-2 rounded text-xs border border-yellow-500/50 shadow-lg backdrop-blur-sm">
            <div className="font-bold text-yellow-200">🏙️ {name}</div>
            <div className="text-yellow-300">Population: {population}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function CountryLabel({ name, position }: { name: string; position: THREE.Vector3 }) {
  const textRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ camera }) => {
    if (textRef.current) {
      // Make text always face the camera (billboard effect)
      textRef.current.lookAt(camera.position);
    }
  });
  
  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.04}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.003}
      outlineColor="#000000"
      fillOpacity={0.9}
    >
      {name}
    </Text>
  );
}

function GlobeScene({ conflicts, environmentData, showCities = true, showCountryLabels = false }: Globe3DProps) {
  const [selectedItem, setSelectedItem] = useState<ConflictData | EnvironmentData | null>(null);

  // Process conflicts with coordinates
  const conflictsWithCoords = conflicts.map(conflict => {
    const coords1 = countryCoordinates[conflict.country1];
    const coords2 = countryCoordinates[conflict.country2];
    
    if (coords1 && coords2) {
      // Use midpoint between countries
      const midLat = (coords1[0] + coords2[0]) / 2;
      const midLng = (coords1[1] + coords2[1]) / 2;
      return { ...conflict, coordinates: [midLat, midLng] as [number, number] };
    }
    
    return { ...conflict, coordinates: coords1 || [0, 0] as [number, number] };
  });

  // Process environment data with coordinates
  const environmentWithCoords = environmentData.map(env => {
    const coords = env.coordinates.split(',').map(Number);
    if (coords.length === 2) {
      return { ...env, parsedCoordinates: coords as [number, number] };
    }
    
    const regionCoords = regionCoordinates[env.region];
    return { ...env, parsedCoordinates: regionCoords || [0, 0] as [number, number] };
  });

  return (
    <>
      {/* Simple lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Simple starfield */}
      <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade />
      
      <Earth />
      
      {/* Render conflict markers */}
      {conflictsWithCoords.map((conflict) => {
        const position = latLngToVector3(conflict.coordinates[0], conflict.coordinates[1]);
        return (
          <ConflictMarker
            key={conflict.id}
            position={position}
            conflict={conflict}
            onClick={setSelectedItem}
          />
        );
      })}
      
      {/* Render environment markers */}
      {environmentWithCoords.map((env) => {
        const position = latLngToVector3(env.parsedCoordinates[0], env.parsedCoordinates[1]);
        return (
          <EnvironmentMarker
            key={env.id}
            position={position}
            data={env}
            onClick={setSelectedItem}
          />
        );
      })}
      
      {/* Render major cities */}
      {showCities && majorCities.map((city, index) => {
        const position = latLngToVector3(city.coords[0], city.coords[1], 2.05);
        return (
          <CityMarker
            key={index}
            name={city.name}
            position={position}
            population={city.population}
          />
        );
      })}
      
      {/* Render country labels for major countries */}
      {showCountryLabels && Object.entries(countryCoordinates).slice(0, 20).map(([country, coords]) => {
        const position = latLngToVector3(coords[0], coords[1], 2.15);
        return (
          <CountryLabel
            key={country}
            name={country}
            position={position}
          />
        );
      })}
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        zoomSpeed={0.6}
        panSpeed={0.5}
        rotateSpeed={0.4}
        minDistance={3}
        maxDistance={10}
      />
    </>
  );
}

export default function Globe3D({ conflicts, environmentData }: Globe3DProps) {
  const [showCities, setShowCities] = useState(true);
  const [showCountryLabels, setShowCountryLabels] = useState(false);

  return (
    <div className="w-full h-[600px] bg-black rounded-lg overflow-hidden relative">
      <Suspense fallback={<GlobeLoader />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
        >
          <GlobeScene 
            conflicts={conflicts} 
            environmentData={environmentData}
            showCities={showCities}
            showCountryLabels={showCountryLabels}
          />
          

        </Canvas>
      </Suspense>
      
      {/* Controls */}
      <div className="absolute top-4 right-4 bg-black/90 text-white p-4 rounded-lg text-sm backdrop-blur-sm border border-gray-700">
        <h3 className="font-bold mb-3 text-blue-400">🎮 Controls</h3>
        <div className="space-y-2 text-xs">
          <div><strong>Rotate:</strong> Click + Drag</div>
          <div><strong>Zoom:</strong> Scroll Wheel</div>
          <div><strong>Pan:</strong> Right Click + Drag</div>
          <div><strong>Info:</strong> Hover Markers</div>
        </div>
        
        <div className="mt-4 space-y-2">
          <button 
            onClick={() => setShowCities(!showCities)}
            className={`w-full text-xs px-2 py-1 rounded ${showCities ? 'bg-yellow-600' : 'bg-gray-600'}`}
          >
            {showCities ? '🏙️ Hide Cities' : '🏙️ Show Cities'}
          </button>
          <button 
            onClick={() => setShowCountryLabels(!showCountryLabels)}
            className={`w-full text-xs px-2 py-1 rounded ${showCountryLabels ? 'bg-blue-600' : 'bg-gray-600'}`}
          >
            {showCountryLabels ? '🏷️ Hide Labels' : '🏷️ Show Labels'}
          </button>
        </div>
      </div>
      
      {/* Enhanced Legend */}
      <div className="absolute top-4 left-4 bg-black/90 text-white p-4 rounded-lg text-sm backdrop-blur-sm border border-gray-700">
        <h3 className="font-bold mb-3 text-blue-400">🌍 Oracle Earth Legend</h3>
        
        <div className="space-y-2 mb-4">
          <h4 className="font-semibold text-red-400">⚔️ Conflicts</h4>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-3 h-3 bg-red-500 rounded animate-pulse"></div>
            <span>Critical Risk (70%+)</span>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>High Risk (40-70%)</span>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Low Risk (&lt;40%)</span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <h4 className="font-semibold text-green-400">🌱 Environment</h4>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-3 h-3 bg-amber-600 rounded"></div>
            <span>🌳 Deforestation</span>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span>💨 CO2 Levels</span>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span>🧊 Glacier Data</span>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>🌡️ Temperature</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-yellow-400">🏙️ Reference</h4>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span>Major Cities</span>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute top-4 right-4 bg-black/90 text-white p-4 rounded-lg text-sm backdrop-blur-sm border border-gray-700">
        <h3 className="font-bold mb-3 text-blue-400">🎮 Controls</h3>
        <div className="space-y-2 text-xs">
          <div><strong>Rotate:</strong> Click + Drag</div>
          <div><strong>Zoom:</strong> Scroll Wheel</div>
          <div><strong>Pan:</strong> Right Click + Drag</div>
          <div><strong>Info:</strong> Hover Markers</div>
        </div>
        
      </div>
    </div>
  );
}