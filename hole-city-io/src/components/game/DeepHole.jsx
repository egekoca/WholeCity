import { memo } from 'react';
import * as THREE from 'three';
import { MeshWobbleMaterial, MeshDistortMaterial } from '@react-three/drei';
import { HOLE_DEPTH } from '../../utils/constants';

// --- 3D DÜZ SİLİNDİR DELİK ---
const DeepHole = memo(function DeepHole({ scale, color, isPlayer, skinId }) {
  const depth = HOLE_DEPTH;
  const radius = scale;
  const segments = 10;

  const isLegendary = skinId === 'legendary';
  const isElectro = skinId === 'electro';
  
  // Eğer oyuncuysa skin rengini kullan, yoksa bot rengi
  const ringColor = isLegendary ? '#00ffff' : (isElectro ? '#2962ff' : (color || "#3498db"));

  return (
    <group>
      {/* --- MASKE (Zemin ve Yolların görünmemesi için) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]} renderOrder={-999}>
        <circleGeometry args={[radius * 0.99, 64]} />
        <meshBasicMaterial
          colorWrite={false}
          depthWrite={false}
          stencilWrite={true}
          stencilRef={1}
          stencilFunc={THREE.AlwaysStencilFunc}
          stencilZPass={THREE.ReplaceStencilOp}
        />
      </mesh>

      {/* --- ÜST HALKA (SKIN BURADA) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[radius * 0.92, radius * 1.1, 48]} />
        
        {isLegendary ? (
           <MeshWobbleMaterial 
              attach="material"
              color="#00ffff" 
              emissive="#00ffff"
              emissiveIntensity={2}
              factor={0.2} 
              speed={3} 
           />
        ) : isElectro ? (
           <meshStandardMaterial 
             color="#000" 
             roughness={0.1}
             metalness={0.9}
           />
        ) : (
           <meshStandardMaterial 
             color={ringColor} 
             roughness={0.3}
             metalness={0.5}
           />
        )}
      </mesh>

      {/* --- ZEUS EFEKTİ --- */}
      {isLegendary && (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
                <ringGeometry args={[radius * 1.15, radius * 1.3, 32]} />
                <MeshWobbleMaterial 
                  attach="material"
                  color="#e040fb" 
                  emissive="#e040fb"
                  emissiveIntensity={2}
                  factor={0.4} 
                  speed={4}
                  transparent 
                  opacity={0.4} 
                  side={THREE.DoubleSide}
                />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
                <ringGeometry args={[radius * 1.05, radius * 1.4, 6]} />
                <MeshWobbleMaterial 
                  attach="material"
                  color="#00ffff" 
                  emissive="#00ffff"
                  emissiveIntensity={4}
                  factor={1.5} 
                  speed={12}
                  transparent 
                  opacity={0.6} 
                  side={THREE.DoubleSide}
                  wireframe={true} 
                />
            </mesh>
        </group>
      )}

      {/* --- ELECTRO EFEKTİ (DÜZELTİLMİŞ) --- */}
      {isElectro && (
        <group>
            {/* 1. Keskin Dikenli Elektrik (Icosahedron - Basık) */}
            {/* Boyut radius'a tam oturtuldu */}
            <group scale={[1, 0.05, 1]} position={[0, 0.08, 0]}>
                <mesh>
                    <icosahedronGeometry args={[radius * 1.05, 1]} />
                    <MeshWobbleMaterial
                        attach="material"
                        color="#40c4ff"
                        emissive="#00b0ff"
                        emissiveIntensity={3}
                        factor={0.5} 
                        speed={12} 
                        wireframe={true}
                        transparent
                        opacity={0.9}
                    />
                </mesh>
            </group>

            {/* 2. İç Enerji Plazması */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <ringGeometry args={[radius * 0.95, radius * 1.05, 32]} />
                <MeshDistortMaterial
                    attach="material"
                    color="#ffffff"
                    emissive="#00b0ff"
                    emissiveIntensity={2}
                    distort={0.3}
                    speed={5}
                    transparent
                    opacity={0.5}
                />
            </mesh>
        </group>
      )}

      {/* --- DELİK GÖVDESİ --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[radius * 0.92, 48]} />
        <meshBasicMaterial color="#050505" />
      </mesh>

      <mesh position={[0, -depth / 2, 0]}>
        <cylinderGeometry args={[radius, radius, depth, 48, 1, true]} />
        <meshStandardMaterial color="#0a0a0a" side={THREE.BackSide} roughness={0.95} metalness={0.05} />
      </mesh>

      <mesh position={[0, -depth / 2, 0]}>
        <cylinderGeometry args={[radius * 1.01, radius * 1.01, depth, 48, 1, true]} />
        <meshStandardMaterial color="#151515" side={THREE.FrontSide} roughness={0.9} />
      </mesh>

      {Array.from({ length: segments }, (_, i) => {
        const d = (i + 1) / (segments + 1);
        const brightness = Math.floor(30 - d * 25);
        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -depth * d, 0]}>
            <ringGeometry args={[radius * 0.93, radius * 0.97, 48]} />
            <meshBasicMaterial color={`rgb(${brightness}, ${brightness}, ${brightness})`} />
          </mesh>
        );
      })}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -depth + 0.05, 0]}>
        <circleGeometry args={[radius * 0.98, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
});

export default DeepHole;
