// Arcade pixel type — the shader. Paints the three-channel mask (face / white
// halo / black keyline), then a printed surface (moire + grain + dust) over
// everything, including the letters — that's what keeps the white faces
// looking as printed as the ground instead of like flat vector on a photo.

export const FULL_VERT = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const ARCADE_FRAG = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uField;       // R = face, G = white halo, B = black keyline
uniform vec2  uResolution;
uniform float uAspect;
uniform float uTime;

uniform sampler2D uMoire;
uniform sampler2D uGrain;
uniform sampler2D uDust;
uniform float uTexture;
uniform float uSeparation;
uniform vec2  uCursor;
uniform float uCursorOn;
uniform float uSwim;
uniform float uParallax;
uniform float uPull;
uniform vec2  uMoireScale;
uniform vec2  uGrainScale;
uniform vec2  uDustScale;
uniform float uThreshold;

uniform vec3  uGround;
uniform vec3  uInk;
uniform vec3  uPaper;
uniform vec3  uFringe;

uniform vec2  uLevels;
uniform float uVibrance;

float hash(vec2 p){
  p = mod(p, 137.0);
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float hardLight(float base, float blend){
  return blend < 0.5
    ? 2.0 * base * blend
    : 1.0 - 2.0 * (1.0 - base) * (1.0 - blend);
}
float linearLight(float base, float blend){
  return clamp(base + 2.0 * blend - 1.0, 0.0, 1.0);
}
vec3 levels(vec3 c, float lo, float hi){
  return clamp((c - lo) / max(hi - lo, 0.0001), 0.0, 1.0);
}
vec3 vibrance(vec3 c, float amt){
  float mx = max(c.r, max(c.g, c.b));
  float mn = min(c.r, min(c.g, c.b));
  float sat = mx - mn;
  float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
  return mix(vec3(lum), c, 1.0 + amt * (1.0 - sat));
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv * vec2(uAspect, 1.0);

  vec2 fromMid = uCursor - vec2(0.5, 0.5);
  float grip = 1.0 - smoothstep(0.0, 0.75, length(fromMid * vec2(uAspect, 1.0)));
  vec2 pull = fromMid * uPull * grip * uCursorOn;

  vec2 toCur = (uCursor - uv) * uCursorOn * uParallax + pull;
  float face = texture2D(uField, uv - toCur * 0.35).r;
  float halo = texture2D(uField, uv - toCur * 0.70).g;
  float key  = texture2D(uField, uv - toCur * 1.00).b;

  vec3 col = uGround;

  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col *= mix(1.0, 0.86, smoothstep(uThreshold, uThreshold - 0.35, lum));

  col = mix(col, uInk, key);
  col = mix(col, uPaper, halo);
  col = mix(col, uInk, face);

  vec2 mUV = uv * uMoireScale;
  vec2 dUV = uv * uDustScale;

  float swimD = length((uv - uCursor) * vec2(uAspect, 1.0));
  float swimAmt = smoothstep(0.22, 0.0, swimD) * uCursorOn * uSwim;
  float a = swimAmt * 0.055;
  float cs = cos(a), sn = sin(a);
  vec2 about = uCursor * uMoireScale;
  vec2 rel = mUV - about;
  vec2 mUV2 = about + vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs);
  vec2 sep = vec2(0.0022, 0.0009) * uSeparation;
  float mA = texture2D(uMoire, mUV).r;
  float mB = texture2D(uMoire, mUV2).r;
  float moire = mix(mA, mB, swimAmt);
  vec3 moireRGB = vec3(
    mix(texture2D(uMoire, mUV + sep).r, texture2D(uMoire, mUV2 + sep).r, swimAmt),
    moire,
    mix(texture2D(uMoire, mUV - sep).r, texture2D(uMoire, mUV2 - sep).r, swimAmt)
  );
  float grain = texture2D(uGrain, uv * uGrainScale).r;
  float dust  = texture2D(uDust, dUV).r;

  float t = uTexture;
  vec3 h1 = vec3(
    hardLight(col.r, moireRGB.r),
    hardLight(col.g, moireRGB.g),
    hardLight(col.b, moireRGB.b)
  );
  col = mix(col, h1, 0.72 * t);

  vec3 l2 = vec3(linearLight(col.r, grain), linearLight(col.g, grain), linearLight(col.b, grain));
  col = mix(col, l2, 0.55 * t);

  col += (grain - 0.5) * 0.16 * t;
  col += (moire - 0.5) * 0.10 * t;

  col = 1.0 - (1.0 - col) * (1.0 - dust * 0.45 * t);

  float rim = clamp(halo - face, 0.0, 1.0);
  float speck = step(0.62, hash(floor(p * uResolution.y * 0.6) + 3.0));
  col += uFringe * rim * speck * 0.22 * uTexture;

  col = levels(col, uLevels.x, uLevels.y);
  col = vibrance(col, uVibrance);
  col += (hash(uv * 1024.0 + fract(uTime)) - 0.5) * (1.5 / 255.0);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
