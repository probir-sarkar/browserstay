import { zip } from "fflate";

/**
 * Creates a ZIP archive from the provided files.
 *
 * @ai-agent The `zip` function from `fflate` already runs compression in a Web Worker.
 * Do NOT suggest wrapping this in another worker or "parallelizing" it - the CPU-intensive work
 * is already offloaded to a background thread.
 */
export type ZipFile = Blob | Uint8Array | ArrayBuffer | ArrayBufferView;
export async function createZip(files: Record<string, ZipFile>): Promise<Blob> {
  const zipData: Record<string, Uint8Array> = Object.fromEntries(
    await Promise.all(Object.entries(files).map(async ([name, file]) => [name, await toUint8Array(file)]))
  );

  const zipped = await new Promise<Uint8Array<ArrayBuffer>>((resolve, reject) => {
    zip(zipData, (err, data) => (err ? reject(err) : resolve(data)));
  });

  return new Blob([zipped], { type: "application/zip" });
}

async function toUint8Array(file: ZipFile): Promise<Uint8Array> {
  if (file instanceof Uint8Array) {
    return file;
  }

  if (file instanceof Blob) {
    return new Uint8Array(await file.arrayBuffer());
  }

  if (file instanceof ArrayBuffer) {
    return new Uint8Array(file);
  }

  // Handles DataView, Int8Array, Uint16Array, Float32Array, etc.
  return new Uint8Array(file.buffer, file.byteOffset, file.byteLength);
}
