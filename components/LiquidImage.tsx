"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uHover;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uImageSize;
varying vec2 vUv;

// Noise function
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
float noise(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  // Object-cover logic
  vec2 ratio = vec2(
    min((uResolution.x / uResolution.y) / (uImageSize.x / uImageSize.y), 1.0),
    min((uResolution.y / uResolution.x) / (uImageSize.y / uImageSize.x), 1.0)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
  
  // Calculate distortion based on noise and time
  float n = noise(uv * 10.0 + uTime * 1.5);
  float n2 = noise(uv * 20.0 - uTime * 1.0);
  
  // Distort UVs more organically
  vec2 distortedUv = uv + vec2(n * 0.05, n2 * 0.05) * uHover;
  
  // Add chromatic aberration on hover edges
  float r = texture2D(uTexture, distortedUv + vec2(0.005 * uHover)).r;
  float g = texture2D(uTexture, distortedUv).g;
  float b = texture2D(uTexture, distortedUv - vec2(0.005 * uHover)).b;
  
  gl_FragColor = vec4(r, g, b, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

function Scene({ src, isHovered }: { src: string, isHovered: boolean }) {
  const texture = useTexture(src);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uImageSize: { value: new THREE.Vector2(texture.image?.width || 1, texture.image?.height || 1) }
    }),
    [texture, size]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      const targetHover = isHovered ? 1.0 : 0.0;
      materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uHover.value,
        targetHover,
        0.05
      );
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function LiquidImage({ src, className = "" }: { src: string, className?: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={className} 
      style={{ position: "relative", overflow: "hidden" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        <React.Suspense fallback={null}>
          <Scene src={src} isHovered={isHovered} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
