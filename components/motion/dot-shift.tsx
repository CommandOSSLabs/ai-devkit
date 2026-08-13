"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uSpeed;
  uniform float uScale;
  uniform vec3 uColor;
  uniform float uSize;
  uniform float uBlur;

  varying vec2 vUv;

  float hash13(vec3 p3) {
    p3  = fract(p3 * .1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
  }

  vec3 getPattern(vec3 dir, float time) {
    dir += time * vec3(0.03, 0.01, 0.0);
    vec3 v = abs(mod(dir * 50.0, 2.0) - 1.0);
    vec3 pat = 3.0 * v * cos(hash13(floor(dir * 800.0)));
    return pat;
  }

  void main() {
    vec2 uv = (vUv * uResolution - 0.5 * uResolution) / uResolution.y;
    vec3 dir = normalize(vec3(uv * uScale, 1.0));
    float time = uTime * uSpeed;

    vec3 pat = getPattern(dir, time);
    float density = max(0.0, (1.5 * uSize) - dot(pat, vec3(1.0, 1.0, 0.5)));

    vec3 col = uColor * density * 3.0;

    float alpha = smoothstep(0.0, uBlur, density);

    gl_FragColor = vec4(col, alpha);
  }
`;

interface SceneProps {
  speed: number;
  scale: number;
  color: string;
  size: number;
  blur: number;
}

const Scene: React.FC<SceneProps> = ({
  speed,
  scale,
  color,
  size: dotSize,
  blur,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uColor: { value: new THREE.Color(color) },
      uSize: { value: dotSize },
      uBlur: { value: blur },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(
        size.width,
        size.height,
      );
      materialRef.current.uniforms.uSpeed.value = speed;
      materialRef.current.uniforms.uScale.value = scale;
      materialRef.current.uniforms.uColor.value.set(color);
      materialRef.current.uniforms.uSize.value = dotSize;
      materialRef.current.uniforms.uBlur.value = blur;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

export interface DotShiftProps {
  speed?: number;
  scale?: number;
  color?: string;
  size?: number;
  blur?: number;
  className?: string;
}

const DotShift: React.FC<DotShiftProps> = ({
  speed = 0.5,
  scale = 0.6,
  color = "#FF9FFC",
  size = 0.6,
  blur = 0.5,
  className = "",
}) => {
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene
          speed={speed}
          scale={scale}
          color={color}
          size={size}
          blur={blur}
        />
      </Canvas>
    </div>
  );
};

export default DotShift;
