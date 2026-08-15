// The original effect samples three real scanned plates (a moire interference
// pattern, fine grain, sparse dust) pulled out of a Photoshop file. We don't
// have those assets here, so these are procedural stand-ins with the same
// role: a structured interference field, per-pixel noise, and sparse bright
// specks. 256x256 (power-of-two) so WebGL1 can tile them with gl.REPEAT.

const SIZE = 256;

function makeCanvas(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  return { canvas, ctx };
}

/** Two overlapping angled line gratings, beating against each other. */
export function buildMoirePlate(): HTMLCanvasElement {
  const { canvas, ctx } = makeCanvas();
  const img = ctx.createImageData(SIZE, SIZE);
  const a1 = (28 * Math.PI) / 180;
  const a2 = (4 * Math.PI) / 180;
  const p1 = 9;
  const p2 = 13;
  const c1 = Math.cos(a1);
  const s1 = Math.sin(a1);
  const c2 = Math.cos(a2);
  const s2 = Math.sin(a2);

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const proj1 = x * c1 + y * s1;
      const proj2 = x * c2 + y * s2;
      const v1 = 0.5 + 0.5 * Math.sin((2 * Math.PI * proj1) / p1);
      const v2 = 0.5 + 0.5 * Math.sin((2 * Math.PI * proj2) / p2);
      const v = Math.min(1, Math.max(0, (v1 * v2 - 0.08) * 1.7));
      const i = (y * SIZE + x) * 4;
      const byte = Math.round(v * 255);
      img.data[i] = byte;
      img.data[i + 1] = byte;
      img.data[i + 2] = byte;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/** Fine per-pixel monochrome noise. */
export function buildGrainPlate(): HTMLCanvasElement {
  const { canvas, ctx } = makeCanvas();
  const img = ctx.createImageData(SIZE, SIZE);
  for (let i = 0; i < img.data.length; i += 4) {
    const byte = Math.round(Math.random() * 255);
    img.data[i] = byte;
    img.data[i + 1] = byte;
    img.data[i + 2] = byte;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/** Sparse bright specks on a near-black field. */
export function buildDustPlate(): HTMLCanvasElement {
  const { canvas, ctx } = makeCanvas();
  const img = ctx.createImageData(SIZE, SIZE);
  for (let i = 0; i < img.data.length; i += 4) {
    const isSpeck = Math.random() < 0.015;
    const byte = isSpeck ? Math.round(140 + Math.random() * 115) : Math.round(Math.random() * 8);
    img.data[i] = byte;
    img.data[i + 1] = byte;
    img.data[i + 2] = byte;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}
