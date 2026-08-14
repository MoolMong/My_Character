import { deflateSync, inflateSync } from "node:zlib";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Source coordinates on character-frame-idle.png. This box contains only the
// ahoge above the head; flood removal makes every connected backdrop pixel
// transparent while retaining the source artwork's antialiased edge pixels.
const crop = { x: 456, y: 166, width: 92, height: 112 };
const source = fileURLToPath(new URL("../src/assets/character-frame-idle.png", import.meta.url));
const output = fileURLToPath(new URL("../src/assets/character-hair-ahoge.png", import.meta.url));

const signature = Buffer.from("89504e470d0a1a0a", "hex");
const bytes = readFileSync(source);
if (!bytes.subarray(0, 8).equals(signature)) throw new Error("Source is not a PNG");

let offset = 8;
let width;
let height;
let colorType;
const idat = [];
while (offset < bytes.length) {
  const length = bytes.readUInt32BE(offset);
  const type = bytes.toString("ascii", offset + 4, offset + 8);
  const data = bytes.subarray(offset + 8, offset + 8 + length);
  if (type === "IHDR") {
    width = data.readUInt32BE(0);
    height = data.readUInt32BE(4);
    if (data[8] !== 8 || data[12] !== 0) throw new Error("Expected an 8-bit, non-interlaced PNG");
    colorType = data[9];
  } else if (type === "IDAT") idat.push(data);
  else if (type === "IEND") break;
  offset += length + 12;
}

const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 0;
if (!channels) throw new Error(`Unsupported PNG color type: ${colorType}`);
const packed = inflateSync(Buffer.concat(idat));
const stride = width * channels;
const pixels = Buffer.alloc(width * height * channels);
let input = 0;
for (let y = 0; y < height; y += 1) {
  const filter = packed[input++];
  const row = pixels.subarray(y * stride, (y + 1) * stride);
  for (let x = 0; x < stride; x += 1) {
    const raw = packed[input++];
    const left = x >= channels ? row[x - channels] : 0;
    const up = y ? pixels[(y - 1) * stride + x] : 0;
    const upperLeft = y && x >= channels ? pixels[(y - 1) * stride + x - channels] : 0;
    if (filter === 0) row[x] = raw;
    else if (filter === 1) row[x] = (raw + left) & 255;
    else if (filter === 2) row[x] = (raw + up) & 255;
    else if (filter === 3) row[x] = (raw + Math.floor((left + up) / 2)) & 255;
    else if (filter === 4) {
      const estimate = left + up - upperLeft;
      const pa = Math.abs(estimate - left);
      const pb = Math.abs(estimate - up);
      const pc = Math.abs(estimate - upperLeft);
      row[x] = (raw + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upperLeft)) & 255;
    } else throw new Error(`Unsupported PNG filter: ${filter}`);
  }
}

const rgba = Buffer.alloc(crop.width * crop.height * 4);
for (let y = 0; y < crop.height; y += 1) {
  for (let x = 0; x < crop.width; x += 1) {
    const sourceIndex = ((crop.y + y) * width + crop.x + x) * channels;
    const targetIndex = (y * crop.width + x) * 4;
    rgba[targetIndex] = pixels[sourceIndex];
    rgba[targetIndex + 1] = pixels[sourceIndex + 1];
    rgba[targetIndex + 2] = pixels[sourceIndex + 2];
    rgba[targetIndex + 3] = channels === 4 ? pixels[sourceIndex + 3] : 255;
  }
}

// Separate the ahoge from the larger hair mass it touches at its root. The
// polygon follows the source outline and deliberately ends inside that root,
// so the runtime sprite cannot drag pixels from the crown along with it.
const ahogeMask = [[5, 7], [46, 5], [70, 18], [80, 36], [79, 62], [68, 76], [60, 91], [57, 108], [47, 103], [52, 87], [57, 65], [55, 43], [43, 30], [8, 28]];
const insideMask = (x, y) => {
  let inside = false;
  for (let i = 0, j = ahogeMask.length - 1; i < ahogeMask.length; j = i, i += 1) {
    const [xi, yi] = ahogeMask[i];
    const [xj, yj] = ahogeMask[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
for (let y = 0; y < crop.height; y += 1) {
  for (let x = 0; x < crop.width; x += 1) {
    if (!insideMask(x + 0.5, y + 0.5)) rgba[(y * crop.width + x) * 4 + 3] = 0;
  }
}

// Only erase pale, near-neutral pixels connected to the crop boundary. Dark
// outlines and peach/brown hair pixels are therefore never selected.
const seen = new Uint8Array(crop.width * crop.height);
const queue = [];
const enqueue = (x, y) => {
  if (x < 0 || y < 0 || x >= crop.width || y >= crop.height) return;
  const point = y * crop.width + x;
  if (seen[point]) return;
  const i = point * 4;
  const r = rgba[i];
  const g = rgba[i + 1];
  const b = rgba[i + 2];
  if (Math.min(r, g, b) < 226 || Math.max(r, g, b) - Math.min(r, g, b) > 18) return;
  seen[point] = 1;
  queue.push([x, y]);
};
for (let x = 0; x < crop.width; x += 1) { enqueue(x, 0); enqueue(x, crop.height - 1); }
for (let y = 0; y < crop.height; y += 1) { enqueue(0, y); enqueue(crop.width - 1, y); }
for (let q = 0; q < queue.length; q += 1) {
  const [x, y] = queue[q];
  rgba[(y * crop.width + x) * 4 + 3] = 0;
  enqueue(x - 1, y); enqueue(x + 1, y); enqueue(x, y - 1); enqueue(x, y + 1);
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = (c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1) >>> 0;
  return c;
});
const chunk = (type, data) => {
  const name = Buffer.from(type);
  let crc = 0xffffffff;
  for (const byte of Buffer.concat([name, data])) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  const result = Buffer.alloc(data.length + 12);
  result.writeUInt32BE(data.length, 0);
  name.copy(result, 4);
  data.copy(result, 8);
  result.writeUInt32BE((crc ^ 0xffffffff) >>> 0, data.length + 8);
  return result;
};

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(crop.width, 0);
ihdr.writeUInt32BE(crop.height, 4);
ihdr.set([8, 6, 0, 0, 0], 8);
const scanlines = Buffer.alloc((crop.width * 4 + 1) * crop.height);
for (let y = 0; y < crop.height; y += 1) rgba.copy(scanlines, y * (crop.width * 4 + 1) + 1, y * crop.width * 4, (y + 1) * crop.width * 4);
writeFileSync(output, Buffer.concat([signature, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(scanlines, { level: 9 })), chunk("IEND", Buffer.alloc(0))]));
console.log(`Wrote ${output} from ${source} crop ${JSON.stringify(crop)}`);
