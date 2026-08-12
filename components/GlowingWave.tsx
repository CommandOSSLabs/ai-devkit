"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export interface GlowingWaveProps {
  /** Travel speed of the wave */
  speed?: number;
  /** Height of the primary swell */
  swell?: number;
  /** Frequency of the primary swell */
  swellFrequency?: number;
  /** Height of the secondary ripple */
  ripple?: number;
  /** Frequency of the secondary ripple */
  rippleFrequency?: number;
  /** Height of the noise riding on the crest */
  chop?: number;
  /** Scale of the noise riding on the crest */
  chopScale?: number;
  /** Vertical placement of the wave, 0 is centred */
  waterline?: number;
  /** Softness of the fill edge */
  edgeSoftness?: number;
  /** How far the fill gradient reaches below the crest */
  depth?: number;
  /** Brightness of the crest line */
  glow?: number;
  /** Width of the crest line */
  glowWidth?: number;
  /** Brightness of the surrounding halo relative to the crest */
  halo?: number;
  /** Width of the surrounding halo */
  haloWidth?: number;
  /** How far the iridescence overrides the plain gradient, 0 to 1 */
  richness?: number;
  /** Number of colour bands through the fill */
  colorFrequency?: number;
  /** Vividness of the colour bands */
  saturation?: number;
  /** How far the hue travels away from hotColor, 0 to 0.5 */
  spread?: number;
  /** Strength of the noise that bends the colour bands */
  swirl?: number;
  /** Scale of the noise that bends the colour bands */
  swirlScale?: number;
  /** Film grain strength, 0 to 1 */
  grain?: number;
  /** Grain cell size in CSS pixels */
  grainSize?: number;
  /** Deep colour under the wave */
  color?: string;
  /** Colour of the crest and its glow */
  hotColor?: string;
  /** Panel backdrop, or "transparent" to show the page through */
  backgroundColor?: string;
  /** Master alpha */
  opacity?: number;
  /** Let the pointer raise the crest */
  cursorInteraction?: boolean;
  /** How high the pointer lifts the crest */
  cursorLift?: number;
  /** How wide the pointer lifts the crest */
  cursorReach?: number;
  /** Freeze the animation */
  paused?: boolean;
  /** Scale back resolution when the frame budget slips */
  adaptiveQuality?: boolean;
  /** Frame rate the quality meter aims to hold */
  targetFps?: number;
  /** Upper device pixel ratio bound */
  dpr?: number;
  className?: string;
  children?: ReactNode;
}

const waveVertex = `
varying vec2 vPlane;

void main() {
  vPlane = uv;
  gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
}
`;

const waveFragment = `
precision highp float;

varying vec2 vPlane;

uniform vec2 uCanvas;
uniform float uClock;
uniform float uSwell;
uniform float uSwellFreq;
uniform float uRipple;
uniform float uRippleFreq;
uniform float uChop;
uniform float uChopScale;
uniform float uWaterline;
uniform float uEdgeSoft;
uniform float uDepth;
uniform float uGlow;
uniform float uGlowWidth;
uniform float uHalo;
uniform float uHaloWidth;
uniform float uRichness;
uniform float uColorFreq;
uniform float uSaturation;
uniform float uSpread;
uniform float uSwirl;
uniform float uSwirlScale;
uniform float uGrain;
uniform float uGrainSize;
uniform vec3 uInk;
uniform vec3 uHot;
uniform vec3 uBackdrop;
uniform float uBackdropAlpha;
uniform float uOpacity;
uniform float uLift;
uniform float uReach;
uniform float uPointerX;

float spark(vec2 seed) {
  return fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 toHsv(vec3 tone) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 a = mix(vec4(tone.bg, K.wz), vec4(tone.gb, K.xy), step(tone.b, tone.g));
  vec4 b = mix(vec4(a.xyw, tone.r), vec4(tone.r, a.yzx), step(a.x, tone.r));
  float span = b.x - min(b.w, b.y);
  return vec3(abs(b.z + (b.w - b.y) / (6.0 * span + 1e-10)),
              span / (b.x + 1e-10), b.x);
}

vec3 toRgb(vec3 hsv) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 wedge = abs(fract(hsv.xxx + K.xyz) * 6.0 - K.www);
  return hsv.z * mix(K.xxx, clamp(wedge - K.xxx, 0.0, 1.0), hsv.y);
}

float drape(vec2 seed) {
  vec2 cell = floor(seed);
  vec2 slice = fract(seed);
  vec2 ease = slice * slice * (3.0 - 2.0 * slice);
  float a = spark(cell);
  float b = spark(cell + vec2(1.0, 0.0));
  float c = spark(cell + vec2(0.0, 1.0));
  float d = spark(cell + vec2(1.0, 1.0));
  return mix(mix(a, b, ease.x), mix(c, d, ease.x), ease.y);
}

void main() {
  float aspect = uCanvas.x / max(uCanvas.y, 1.0);
  vec2 p = vPlane - 0.5;
  p.x *= aspect;

  float t = uClock;

  float crest = sin(p.x * uSwellFreq + t) * uSwell;
  crest += sin(p.x * uRippleFreq - t * 0.7) * uRipple;
  crest += (drape(p * uChopScale + t * 0.5) - 0.5) * 2.0 * uChop;
  crest += uWaterline;

  float span = max(uReach, 0.001);
  crest += exp(-pow((p.x - uPointerX) / span, 2.0)) * uLift;

  float rift = p.y - crest;

  float soft = max(uEdgeSoft, 0.0005);
  float body = smoothstep(soft, -soft, rift);
  vec3 base = mix(uInk, uHot, smoothstep(-max(uDepth, 0.001), 0.0, rift));

  float bend = (drape(p * uSwirlScale + t * 0.2) - 0.5) * 2.0 * uSwirl;
  float band = rift * uColorFreq + t * 0.5 + bend;
  float sweep = sin(band);
  float lift = 0.5 + 0.5 * sin(band * 0.5 + t * 0.3);

  vec3 hsv = toHsv(uHot);
  hsv.x = fract(hsv.x + sweep * uSpread);
  hsv.y = clamp(hsv.y * uSaturation, 0.0, 1.0);
  hsv.z = clamp(hsv.z * (0.6 + 0.55 * lift), 0.0, 1.0);
  vec3 rich = toRgb(hsv);
  vec3 skin = mix(base, rich, clamp(uRichness, 0.0, 1.0));

  float edge = abs(rift);
  float rim = (1.0 - smoothstep(0.0, max(uGlowWidth, 0.0005), edge)) * uGlow;
  float mist = (1.0 - smoothstep(0.0, max(uHaloWidth, 0.0005), edge)) * uGlow *
               uHalo;

  float cover = clamp(body + rim + mist, 0.0, 1.0);
  vec3 lit = skin * body + rich * (rim + mist);

  vec2 cell = floor(vPlane * uCanvas / max(uGrainSize, 1.0));
  float speck = spark(cell + floor(uClock * 24.0)) - 0.5;
  lit += speck * uGrain * cover;
  lit = max(lit, vec3(0.0));

  float rest = uBackdropAlpha * (1.0 - cover);
  gl_FragColor = vec4(lit + uBackdrop * rest, cover + rest) * uOpacity;
}
`;

const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, value));

const subscribeToScreen = (notify: () => void) => {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia("(min-resolution: 2dppx)");
  media.addEventListener("change", notify);
  window.addEventListener("resize", notify);
  return () => {
    media.removeEventListener("change", notify);
    window.removeEventListener("resize", notify);
  };
};

const readScreenDpr = () =>
  typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;

const isClear = (paint: string) =>
  paint === "transparent" || paint === "none" || paint === "";

interface PointerState {
  x: number;
  active: boolean;
}

interface WaveFieldProps {
  speed: number;
  swell: number;
  swellFrequency: number;
  ripple: number;
  rippleFrequency: number;
  chop: number;
  chopScale: number;
  waterline: number;
  edgeSoftness: number;
  depth: number;
  glow: number;
  glowWidth: number;
  halo: number;
  haloWidth: number;
  richness: number;
  colorFrequency: number;
  saturation: number;
  spread: number;
  swirl: number;
  swirlScale: number;
  grain: number;
  grainSize: number;
  color: string;
  hotColor: string;
  backgroundColor: string;
  opacity: number;
  cursorInteraction: boolean;
  cursorLift: number;
  cursorReach: number;
  paused: boolean;
  adaptiveQuality: boolean;
  targetFps: number;
  readPointer: () => PointerState;
}

const WaveField = ({
  speed,
  swell,
  swellFrequency,
  ripple,
  rippleFrequency,
  chop,
  chopScale,
  waterline,
  edgeSoftness,
  depth,
  glow,
  glowWidth,
  halo,
  haloWidth,
  richness,
  colorFrequency,
  saturation,
  spread,
  swirl,
  swirlScale,
  grain,
  grainSize,
  color,
  hotColor,
  backgroundColor,
  opacity,
  cursorInteraction,
  cursorLift,
  cursorReach,
  paused,
  adaptiveQuality,
  targetFps,
  readPointer,
}: WaveFieldProps) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const clock = useRef(0);
  const glide = useRef({ x: 0, lift: 0 });
  const budget = useRef({ frames: 0, span: 0, wins: 0 });
  const { gl, size } = useThree();

  const uniforms = useMemo(
    () => ({
      uCanvas: { value: new THREE.Vector2(1, 1) },
      uClock: { value: 0 },
      uSwell: { value: 0.15 },
      uSwellFreq: { value: 3 },
      uRipple: { value: 0.08 },
      uRippleFreq: { value: 6 },
      uChop: { value: 0.04 },
      uChopScale: { value: 2 },
      uWaterline: { value: 0 },
      uEdgeSoft: { value: 0.1 },
      uDepth: { value: 0.6 },
      uGlow: { value: 0.6 },
      uGlowWidth: { value: 0.05 },
      uHalo: { value: 0.35 },
      uHaloWidth: { value: 0.2 },
      uRichness: { value: 0.35 },
      uColorFreq: { value: 2 },
      uSaturation: { value: 0.9 },
      uSpread: { value: 0.04 },
      uSwirl: { value: 1 },
      uSwirlScale: { value: 1.5 },
      uGrain: { value: 0.05 },
      uGrainSize: { value: 2 },
      uInk: { value: new THREE.Color("#0d2666") },
      uHot: { value: new THREE.Color("#ff6633") },
      uBackdrop: { value: new THREE.Color("#0a0a0a") },
      uBackdropAlpha: { value: 1 },
      uOpacity: { value: 1 },
      uLift: { value: 0 },
      uReach: { value: 0.25 },
      uPointerX: { value: 0 },
    }),
    [],
  );

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uInk.value.set(color);
    material.uniforms.uHot.value.set(hotColor);
    const clear = isClear(backgroundColor);
    material.uniforms.uBackdropAlpha.value = clear ? 0 : 1;
    if (!clear) material.uniforms.uBackdrop.value.set(backgroundColor);
  }, [color, hotColor, backgroundColor]);

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;

    const beat = Math.min(delta, 0.05);
    if (!paused) clock.current += beat * speed;

    const ratio = gl.getPixelRatio();
    const set = material.uniforms;
    set.uCanvas.value.set(size.width * ratio, size.height * ratio);
    set.uClock.value = clock.current;
    set.uSwell.value = swell;
    set.uSwellFreq.value = swellFrequency;
    set.uRipple.value = ripple;
    set.uRippleFreq.value = rippleFrequency;
    set.uChop.value = chop;
    set.uChopScale.value = chopScale;
    set.uWaterline.value = waterline;
    set.uEdgeSoft.value = edgeSoftness;
    set.uDepth.value = depth;
    set.uGlow.value = glow;
    set.uGlowWidth.value = glowWidth;
    set.uHalo.value = halo;
    set.uHaloWidth.value = haloWidth;
    set.uRichness.value = richness;
    set.uColorFreq.value = colorFrequency;
    set.uSaturation.value = saturation;
    set.uSpread.value = spread;
    set.uSwirl.value = swirl;
    set.uSwirlScale.value = swirlScale;
    set.uGrain.value = grain;
    set.uGrainSize.value = Math.max(grainSize, 1) * ratio;
    set.uOpacity.value = opacity;
    set.uReach.value = cursorReach;

    const pointer = readPointer();
    const goal = cursorInteraction && pointer.active ? cursorLift : 0;
    const ease = 1 - Math.exp(-beat * 7);
    glide.current.x += (pointer.x - glide.current.x) * ease;
    glide.current.lift += (goal - glide.current.lift) * ease;
    set.uPointerX.value = glide.current.x;
    set.uLift.value = glide.current.lift;

    if (!adaptiveQuality) return;
    const meter = budget.current;
    meter.frames += 1;
    meter.span += delta;
    if (meter.span < 0.75) return;
    const fps = meter.frames / meter.span;
    meter.frames = 0;
    meter.span = 0;
    const roof = Math.min(window.devicePixelRatio || 1, 2);
    if (fps < targetFps * 0.85 && ratio > 0.75) {
      meter.wins = 0;
      gl.setPixelRatio(Math.max(0.75, ratio * 0.75));
    } else if (fps > targetFps * 0.98 && ratio < roof) {
      meter.wins += 1;
      if (meter.wins >= 3) {
        meter.wins = 0;
        gl.setPixelRatio(Math.min(roof, ratio * 1.25));
      }
    } else {
      meter.wins = 0;
    }
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={waveVertex}
        fragmentShader={waveFragment}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        premultipliedAlpha
      />
    </mesh>
  );
};

export const GlowingWave = ({
  speed = 1,
  swell = 0.15,
  swellFrequency = 3,
  ripple = 0.08,
  rippleFrequency = 6,
  chop = 0.04,
  chopScale = 2,
  waterline = 0,
  edgeSoftness = 0.1,
  depth = 0.6,
  glow = 0.6,
  glowWidth = 0.05,
  halo = 0.35,
  haloWidth = 0.2,
  richness = 0.35,
  colorFrequency = 2,
  saturation = 0.9,
  spread = 0.04,
  swirl = 1,
  swirlScale = 1.5,
  grain = 0.05,
  grainSize = 2,
  color = "#0f172a",
  hotColor = "#c7d2fe",
  backgroundColor = "#0a0a0a",
  opacity = 1,
  cursorInteraction = true,
  cursorLift = 0.12,
  cursorReach = 0.25,
  paused = false,
  adaptiveQuality = true,
  targetFps = 60,
  dpr = 2,
  className,
  children,
}: GlowingWaveProps) => {
  const shell = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerState>({ x: 0, active: false });
  const [awake, setAwake] = useState(true);

  const screenDpr = useSyncExternalStore(
    subscribeToScreen,
    readScreenDpr,
    () => 1,
  );
  const ceiling = Math.min(screenDpr, Math.max(dpr, 0.5));

  const readPointer = useCallback(() => pointer.current, []);

  useEffect(() => {
    const node = shell.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const watcher = new IntersectionObserver(
      ([entry]) => setAwake(entry.isIntersecting),
      { threshold: 0 },
    );
    watcher.observe(node);
    return () => watcher.disconnect();
  }, []);

  useEffect(() => {
    const node = shell.current;
    if (!node || !cursorInteraction) return;

    const track = (event: PointerEvent) => {
      const box = node.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const aspect = box.width / box.height;
      pointer.current.x =
        (clamp((event.clientX - box.left) / box.width, 0, 1) - 0.5) * aspect;
      pointer.current.active = true;
    };

    const release = () => {
      pointer.current.active = false;
    };

    node.addEventListener("pointermove", track);
    node.addEventListener("pointerleave", release);
    return () => {
      node.removeEventListener("pointermove", track);
      node.removeEventListener("pointerleave", release);
    };
  }, [cursorInteraction]);

  return (
    <div ref={shell} className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0">
        <Canvas
          orthographic
          dpr={ceiling}
          frameloop={awake ? "always" : "demand"}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <WaveField
            speed={speed}
            swell={swell}
            swellFrequency={swellFrequency}
            ripple={ripple}
            rippleFrequency={rippleFrequency}
            chop={chop}
            chopScale={chopScale}
            waterline={waterline}
            edgeSoftness={edgeSoftness}
            depth={depth}
            glow={glow}
            glowWidth={glowWidth}
            halo={halo}
            haloWidth={haloWidth}
            richness={richness}
            colorFrequency={colorFrequency}
            saturation={saturation}
            spread={spread}
            swirl={swirl}
            swirlScale={swirlScale}
            grain={grain}
            grainSize={grainSize}
            color={color}
            hotColor={hotColor}
            backgroundColor={backgroundColor}
            opacity={opacity}
            cursorInteraction={cursorInteraction}
            cursorLift={cursorLift}
            cursorReach={cursorReach}
            paused={paused}
            adaptiveQuality={adaptiveQuality}
            targetFps={targetFps}
            readPointer={readPointer}
          />
        </Canvas>
      </div>
      {children ? (
        <div className="relative z-10 h-full w-full">{children}</div>
      ) : null}
    </div>
  );
};

export default GlowingWave;
