"use client";

// Arcade pixel type — the engine. Framework-free WebGL1 class: owns the
// context, the mask upload, the rAF loop and the eased pointer.
//
// Ported for the changelog splash: the resolution-cycling ("gallery card")
// behaviour and its `./cycle` module are dropped (a passive splash never
// calls setCycling), and the three texture plates are generated procedurally
// (textures.ts) instead of loaded from external images, so there's no asset
// or network dependency.

import { ARCADE_FRAG, FULL_VERT } from "./shaders";
import { makeArcadeField } from "./text-mask";
import { buildDustPlate, buildGrainPlate, buildMoirePlate } from "./textures";
import { COLORWAYS, DEFAULTS, FONT_CSS, LEVELS_IN, VIBRANCE, type ArcadeParams, type Colorway } from "./params";

function toFloats(c: Colorway): number[] {
  return [...c.ground, ...c.ink, ...c.paper, ...c.fringe];
}

const UNIFORMS = [
  "uField", "uResolution", "uAspect", "uTime",
  "uThreshold", "uTexture", "uMoire", "uGrain", "uDust", "uSeparation", "uCursor", "uCursorOn", "uSwim", "uParallax", "uPull",
  "uMoireScale", "uGrainScale", "uDustScale",
  "uGround", "uInk", "uPaper", "uFringe",
  "uLevels", "uVibrance",
] as const;

export class Arcade {
  private host: HTMLElement;
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private prog: WebGLProgram | null = null;
  private loc: Record<string, WebGLUniformLocation | null> = {};
  private quad: WebGLBuffer | null = null;
  private tex: WebGLTexture | null = null;

  private moire: WebGLTexture | null = null;
  private grain: WebGLTexture | null = null;
  private dust: WebGLTexture | null = null;

  readonly params: ArcadeParams = { ...DEFAULTS };

  private w = 0;
  private h = 0;
  private dpr = 1;
  private fontFamily = `${FONT_CSS}, sans-serif`;

  private cur = toFloats(COLORWAYS[DEFAULTS.colorway]);
  private idx = DEFAULTS.colorway;

  private cx = 0.5;
  private cy = 0.5;
  private on = 0;
  private onTarget = 0;
  private shX = 0;
  private shY = 0;

  private liveShadow: [number, number] = [...DEFAULTS.keylineOffset];

  private raf = 0;
  private running = false;
  private awake = false;
  private painted = false;
  private destroyed = false;
  private t0 = performance.now();
  private last = 0;

  private builtW = 0;
  private builtH = 0;
  private builtWord = "";
  private builtKey = "";
  private builtFont = "";
  private buildScheduled = 0;

  ok = false;

  constructor(host: HTMLElement, fontFamily?: string) {
    this.host = host;
    if (fontFamily) this.fontFamily = fontFamily;
    this.canvas = document.createElement("canvas");
    Object.assign(this.canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
      opacity: "0",
      transition: "opacity 400ms ease",
    });
    host.appendChild(this.canvas);

    const gl = this.canvas.getContext("webgl", { alpha: false, antialias: false, premultipliedAlpha: false });
    if (!gl) return;
    this.gl = gl;

    try {
      this.prog = this.build(FULL_VERT, ARCADE_FRAG);
    } catch (err) {
      console.error("[Arcade] shader build failed:", err);
      this.gl = null;
      return;
    }
    for (const u of UNIFORMS) this.loc[u] = gl.getUniformLocation(this.prog, u);

    this.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(this.prog, "aPosition");
    gl.useProgram(this.prog);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Procedural stand-ins for the three PSD plates — generated once, synchronously.
    this.moire = this.uploadPlate(buildMoirePlate());
    this.grain = this.uploadPlate(buildGrainPlate());
    this.dust = this.uploadPlate(buildDustPlate());

    this.resize();
    void this.buildFieldNow();

    this.canvas.addEventListener("pointermove", this.onMove);
    this.canvas.addEventListener("pointerleave", this.onLeave);

    this.ok = true;
  }

  /** Upload a (power-of-two) canvas as a REPEATing texture. */
  private uploadPlate(canvas: HTMLCanvasElement): WebGLTexture | null {
    const gl = this.gl;
    if (!gl) return null;
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    return t;
  }

  private build(vs: string, fs: string): WebGLProgram {
    const gl = this.gl!;
    const c = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(sh) || "compile failed");
      }
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, c(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, c(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) || "link failed");
    }
    return prog;
  }

  private onMove = (e: PointerEvent) => {
    const r = this.canvas.getBoundingClientRect();
    this.cx = (e.clientX - r.left) / r.width;
    this.cy = 1 - (e.clientY - r.top) / r.height;
    this.onTarget = 1;
    this.wake();
  };

  private onLeave = () => {
    this.onTarget = 0;
    this.wake();
  };

  private wake() {
    if (this.awake && !this.running) this.start();
    else if (!this.running) this.render();
  }

  setParams(p: Partial<ArcadeParams>) {
    const rebuild =
      (p.word !== undefined && p.word !== this.params.word) ||
      (p.cols !== undefined && p.cols !== this.params.cols) ||
      (p.halo !== undefined && p.halo !== this.params.halo) ||
      (p.keyline !== undefined && p.keyline !== this.params.keyline) ||
      (p.keylineOffset !== undefined && p.keylineOffset.join() !== this.params.keylineOffset.join()) ||
      (p.italic !== undefined && p.italic !== this.params.italic);
    Object.assign(this.params, p);
    if (p.colorway !== undefined) this.setColorway(p.colorway);
    if (rebuild) this.scheduleBuild();
    this.wake();
  }

  setColorway(i: number) {
    const n = ((i % COLORWAYS.length) + COLORWAYS.length) % COLORWAYS.length;
    this.idx = n;
    this.params.colorway = n;
    this.cur = toFloats(COLORWAYS[n]);
    this.wake();
  }

  resize() {
    const r = this.host.getBoundingClientRect();
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = r.width;
    this.h = r.height;
    const cw = Math.max(1, Math.round(this.w * this.dpr));
    const ch = Math.max(1, Math.round(this.h * this.dpr));
    if (this.canvas.width !== cw || this.canvas.height !== ch) {
      this.canvas.width = cw;
      this.canvas.height = ch;
      this.gl?.viewport(0, 0, cw, ch);
      this.scheduleBuild();
    }
  }

  private paramKey(): string {
    const p = this.params;
    const sh = p.magnet ? this.liveShadow : p.keylineOffset;
    return `${p.word}|${p.cols}|${p.halo}|${p.keyline}|${sh.join(",")}|${p.italic}`;
  }

  private maskSize(): [number, number] {
    const MAX_W = 1600;
    const mw = Math.max(2, Math.min(MAX_W, Math.round(this.w * this.dpr)));
    const mh = Math.max(2, Math.round(mw * (this.h / Math.max(1, this.w))));
    return [mw, mh];
  }

  private scheduleBuild() {
    if (!this.gl || this.destroyed) return;
    const [mw, mh] = this.maskSize();
    if (
      mw === this.builtW &&
      mh === this.builtH &&
      this.params.word === this.builtWord &&
      this.builtKey === this.paramKey() &&
      this.fontFamily === this.builtFont
    ) {
      return;
    }
    if (this.buildScheduled) return;
    const run = () => {
      this.buildScheduled = 0;
      void this.buildFieldNow();
    };
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    this.buildScheduled = ric ? ric(run, { timeout: 200 }) : window.setTimeout(run, 0);
  }

  buildSync() {
    const gl = this.gl;
    if (!gl || this.destroyed) return;
    const [mw, mh] = this.maskSize();
    this.uploadMask(mw, mh);
  }

  private uploadMask(mw: number, mh: number) {
    const gl = this.gl;
    if (!gl || this.destroyed) return;
    this.builtW = mw;
    this.builtH = mh;
    this.builtWord = this.params.word;
    this.builtKey = this.paramKey();
    this.builtFont = this.fontFamily;

    const art = makeArcadeField({
      word: this.params.word,
      cols: this.params.cols,
      halo: this.params.halo,
      keyline: this.params.keyline,
      keylineOffset: this.params.magnet ? this.liveShadow : this.params.keylineOffset,
      italic: this.params.italic,
      w: mw,
      h: mh,
      fontFamily: this.fontFamily,
    });
    if (!this.tex) this.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, art);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  }

  private async buildFieldNow() {
    const gl = this.gl;
    if (!gl || this.destroyed) return;
    if (this.buildScheduled) {
      const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (cic) cic(this.buildScheduled);
      else window.clearTimeout(this.buildScheduled);
      this.buildScheduled = 0;
    }
    const [mw, mh] = this.maskSize();
    this.uploadMask(mw, mh);
    if (!this.running) this.render();
  }

  start() {
    if (!this.ok) return;
    this.awake = true;
    if (this.running) return;
    this.running = true;
    this.last = 0;
    this.resize();
    const loop = (now: number) => {
      if (!this.running) return;
      this.frame(now);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.awake = false;
    this.pause();
  }

  private pause() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private frame(now: number) {
    this.last = now;
    this.on += (this.onTarget - this.on) * 0.12;
    this.stepMagnet();
    this.render();
  }

  private stepMagnet() {
    const p = this.params;
    if (!p.magnet) return;
    const reach = p.keylineOffset[0] + p.magnetReach;
    const tx = -(this.cx - 0.5) * 2 * reach * this.on;
    const ty = (this.cy - 0.5) * 2 * reach * this.on;
    this.shX += (tx - this.shX) * 0.14;
    this.shY += (ty - this.shY) * 0.14;

    const base = p.keylineOffset;
    const nx = Math.round(base[0] + this.shX);
    const ny = Math.round(base[1] + this.shY);
    if (nx !== this.liveShadow[0] || ny !== this.liveShadow[1]) {
      this.liveShadow = [nx, ny];
      this.buildSync();
    }
  }

  renderStill() {
    this.resize();
    void this.buildFieldNow();
    this.canvas.addEventListener("pointermove", this.onMove);
    this.canvas.addEventListener("pointerleave", this.onLeave);
    this.render();
  }

  private render() {
    const gl = this.gl;
    if (!gl || !this.prog || !this.tex) return;
    const p = this.params;

    gl.useProgram(this.prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.uniform1i(this.loc.uField, 0);
    gl.uniform2f(this.loc.uResolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.loc.uAspect, this.w / Math.max(1, this.h));
    gl.uniform1f(this.loc.uTime, (performance.now() - this.t0) / 1000);

    gl.uniform1f(this.loc.uThreshold, p.threshold);

    const MOIRE_TILES = 1.0;
    const DUST_TILES = 0.85;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.moire);
    gl.uniform1i(this.loc.uMoire, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.grain);
    gl.uniform1i(this.loc.uGrain, 2);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, this.dust);
    gl.uniform1i(this.loc.uDust, 3);
    const aspect = this.w / Math.max(1, this.h);
    gl.uniform2f(this.loc.uMoireScale, MOIRE_TILES * aspect, MOIRE_TILES);
    gl.uniform2f(this.loc.uGrainScale, aspect * 2.6, 2.6);
    gl.uniform2f(this.loc.uDustScale, DUST_TILES * aspect, DUST_TILES);

    gl.uniform1f(this.loc.uTexture, p.texture);
    gl.uniform1f(this.loc.uSeparation, p.separation);
    gl.uniform2f(this.loc.uCursor, this.cx, this.cy);
    gl.uniform1f(this.loc.uCursorOn, this.on);
    gl.uniform1f(this.loc.uSwim, p.swim);
    gl.uniform1f(this.loc.uParallax, p.parallax);
    gl.uniform1f(this.loc.uPull, p.pull);

    const c = this.cur;
    gl.uniform3f(this.loc.uGround, c[0], c[1], c[2]);
    gl.uniform3f(this.loc.uInk, c[3], c[4], c[5]);
    gl.uniform3f(this.loc.uPaper, c[6], c[7], c[8]);
    gl.uniform3f(this.loc.uFringe, c[9], c[10], c[11]);

    gl.uniform2f(this.loc.uLevels, LEVELS_IN[0], LEVELS_IN[1]);
    gl.uniform1f(this.loc.uVibrance, VIBRANCE);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (!this.painted) {
      this.painted = true;
      this.canvas.style.opacity = "1";
    }

    if (!this.awake && Math.abs(this.on - this.onTarget) < 0.002) this.pause();
  }

  destroy() {
    this.destroyed = true;
    if (this.buildScheduled) {
      const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (cic) cic(this.buildScheduled);
      else window.clearTimeout(this.buildScheduled);
      this.buildScheduled = 0;
    }
    this.stop();
    this.canvas.removeEventListener("pointermove", this.onMove);
    this.canvas.removeEventListener("pointerleave", this.onLeave);
    const gl = this.gl;
    if (gl) {
      if (this.tex) gl.deleteTexture(this.tex);
      if (this.moire) gl.deleteTexture(this.moire);
      if (this.grain) gl.deleteTexture(this.grain);
      if (this.dust) gl.deleteTexture(this.dust);
      if (this.quad) gl.deleteBuffer(this.quad);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
    this.canvas.remove();
  }
}
