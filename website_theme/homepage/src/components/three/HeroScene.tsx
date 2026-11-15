import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// Brand palette for the 3D scene (mirrors the design tokens in styles.css)
const C = {
  green: "#2f7d4a",
  greenDeep: "#1f4d33",
  red: "#d23a2f",
  blue: "#2f6fc4",
  ocean: "#3b82d6",
  sun: "#f3c24b",
  paper: "#fbf6e8",
  purple: "#7a6fb8",
};

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function useGlobeTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, "#5aa0e8");
    g.addColorStop(0.5, C.ocean);
    g.addColorStop(1, "#245fae");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 512);
    const rnd = seeded(42);
    const blobs: [number, number, number][] = [
      [180, 170, 110], [260, 330, 70], [520, 160, 90], [560, 300, 80], [760, 190, 130], [840, 360, 60], [430, 420, 50],
    ];
    for (const [x, y, r] of blobs) {
      for (let i = 0; i < 26; i++) {
        ctx.fillStyle = i % 3 === 0 ? "#3f9a5b" : "#4fae6a";
        ctx.beginPath();
        ctx.arc(x + (rnd() - 0.5) * r * 1.4, y + (rnd() - 0.5) * r * 0.9, r * (0.25 + rnd() * 0.35), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 2;
    for (let i = 1; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (512 / 8) * i);
      ctx.lineTo(1024, (512 / 8) * i);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);
}

function Globe() {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useGlobeTexture();
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += Math.min(d, 0.05) * 0.25;
  });
  return (
    <group>
      <mesh ref={ref} castShadow>
        <sphereGeometry args={[1.25, 64, 64]} />
        <meshStandardMaterial map={tex} roughness={0.45} metalness={0.05} />
      </mesh>
      {/* Orbit arc like the logo's blue swoosh */}
      <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[1.75, 0.05, 16, 120, Math.PI * 1.5]} />
        <meshStandardMaterial color={C.blue} roughness={0.3} />
      </mesh>
      {/* Red flag ribbon */}
      <mesh rotation={[Math.PI / 2.1, -0.6, 0.4]}>
        <torusGeometry args={[1.45, 0.09, 16, 100, Math.PI * 0.7]} />
        <meshStandardMaterial color={C.red} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Book({ color, position, rotation }: { color: string; position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
      <group position={position} rotation={rotation}>
        <RoundedBox args={[0.9, 0.18, 0.65]} radius={0.03} castShadow>
          <meshStandardMaterial color={color} roughness={0.5} />
        </RoundedBox>
        <mesh position={[0.04, 0, 0]}>
          <boxGeometry args={[0.84, 0.13, 0.6]} />
          <meshStandardMaterial color={C.paper} roughness={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

function Pencil({ position, rotation, color }: { position: [number, number, number]; rotation: [number, number, number]; color: string }) {
  return (
    <Float speed={2.6} rotationIntensity={1} floatIntensity={1.4}>
      <group position={position} rotation={rotation}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.9, 6]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.53, 0]}>
          <coneGeometry args={[0.06, 0.16, 6]} />
          <meshStandardMaterial color="#f0d2a0" />
        </mesh>
        <mesh position={[0, 0.59, 0]}>
          <coneGeometry args={[0.022, 0.05, 6]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.062, 0.062, 0.1, 12]} />
          <meshStandardMaterial color="#e88aa0" />
        </mesh>
      </group>
    </Float>
  );
}

function GradCap({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1.6} rotationIntensity={0.8} floatIntensity={1}>
      <group position={position} rotation={[0.3, 0.6, -0.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.95, 0.05, 0.95]} />
          <meshStandardMaterial color={C.greenDeep} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.3, 0.34, 0.28, 24]} />
          <meshStandardMaterial color={C.greenDeep} roughness={0.6} />
        </mesh>
        <mesh position={[0.32, -0.14, 0.32]}>
          <cylinderGeometry args={[0.015, 0.015, 0.32, 6]} />
          <meshStandardMaterial color={C.sun} />
        </mesh>
        <mesh position={[0.32, -0.32, 0.32]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={C.sun} />
        </mesh>
      </group>
    </Float>
  );
}

function Star({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += Math.min(d, 0.05) * 1.2;
  });
  return (
    <Float speed={3} floatIntensity={2}>
      <mesh ref={ref} position={position} scale={scale}>
        <octahedronGeometry args={[0.14, 0]} />
        <meshStandardMaterial color={C.sun} emissive={C.sun} emissiveIntensity={0.35} roughness={0.3} />
      </mesh>
    </Float>
  );
}

function Rig() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, d) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(d, 0.05);
    g.rotation.y += (state.pointer.x * 0.35 - g.rotation.y) * (1 - Math.exp(-3 * dt));
    g.rotation.x += (-state.pointer.y * 0.2 - g.rotation.x) * (1 - Math.exp(-3 * dt));
  });
  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
        <Globe />
      </Float>
      <Book color={C.red} position={[-2.1, 0.9, 0.2]} rotation={[0.4, 0.5, 0.3]} />
      <Book color={C.purple} position={[2.0, -0.9, 0.4]} rotation={[-0.3, -0.4, -0.2]} />
      <Book color={C.green} position={[-1.8, -1.2, 0.6]} rotation={[0.2, -0.8, 0.5]} />
      <Pencil color={C.sun} position={[2.2, 1.1, -0.2]} rotation={[0, 0, -0.8]} />
      <Pencil color={C.blue} position={[-2.5, -0.1, -0.6]} rotation={[0.3, 0, 0.9]} />
      <GradCap position={[0.4, 1.85, 0.3]} />
      <Star position={[1.3, 1.5, 0.8]} />
      <Star position={[-1.1, 1.7, -0.4]} scale={0.7} />
      <Star position={[1.7, 0.1, 1]} scale={0.8} />
      <Star position={[-0.9, -1.8, 0.5]} scale={0.9} />
    </group>
  );
}

export default function HeroScene() {
  const [ready, setReady] = useState(false);
  return (
    <div className="h-full w-full" data-scene-ready={ready ? "true" : undefined}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => requestAnimationFrame(() => setReady(true))}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 5, 5]} intensity={1.6} castShadow />
        <pointLight position={[-4, -2, 3]} intensity={18} color={C.sun} />
        <Environment resolution={128}>
          <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
          <Lightformer intensity={1} color="#bfe3c8" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
          <Lightformer intensity={1} color="#cfe0ff" position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[20, 1, 1]} />
        </Environment>
        <Rig />
        <ContactShadows position={[0, -2.4, 0]} opacity={0.25} scale={10} blur={2.5} far={4} />
      </Canvas>
    </div>
  );
}
