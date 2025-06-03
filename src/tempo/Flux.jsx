import React, { useRef } from "react";
import { Canvas, useFrame, extend, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TubeGeometry } from "three";

function FlowTube({ path }) {
  const meshRef = useRef();
  const texture = useLoader(THREE.TextureLoader, "https://threejs.org/examples/textures/water.jpg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.map.offset.x = clock.elapsedTime * 0.5;
    }
  });

  // Tube geometry from curve path
  const tubeGeometry = new THREE.TubeGeometry(path, 100, 0.05, 8, false);

  return (
    <mesh ref={meshRef} geometry={tubeGeometry}>
      <meshStandardMaterial
        map={texture}
        color="cyan"
        transparent={true}
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function App() {
  // Simple curve from -1,0,0 to 1,0,0 with a little arc
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(-0.5, 0.5, 0),
    new THREE.Vector3(0.5, -0.5, 0),
    new THREE.Vector3(1, 0, 0),
  ]);

  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <FlowTube path={curve} />
    </Canvas>
  );
}
