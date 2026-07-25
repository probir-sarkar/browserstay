import * as Comlink from "comlink";
import type { CompressionWorkerApi } from "./compression.worker";
import pLimit from "p-limit";

let worker: Worker | undefined;
let api: Comlink.Remote<CompressionWorkerApi> | undefined;

function getApi(): Comlink.Remote<CompressionWorkerApi> {
  if (!api) {
    worker = new Worker(new URL("./compression.worker.ts", import.meta.url), {
      type: "module"
    });
    api = Comlink.wrap<CompressionWorkerApi>(worker);
  }
  return api;
}

export interface CompressImageInput {
  file: File;
  settings: Parameters<CompressionWorkerApi["compressImageWorker"]>[1];
  id?: string;
}

export interface CompressImageResult {
  input: CompressImageInput;
  result: Awaited<ReturnType<CompressionWorkerApi["compressImageWorker"]>>;
}

/**
 * Compresses multiple images with controlled concurrency using p-limit.
 * Processes up to 4 images in parallel to avoid overwhelming the worker.
 */
export async function compressImages(
  inputs: CompressImageInput[],
  onProgress?: (completed: number, total: number) => void
): Promise<CompressImageResult[]> {
  if (inputs.length === 0) return [];

  const limit = pLimit(4); // Process up to 4 images in parallel
  const results: CompressImageResult[] = [];
  let completed = 0;

  const tasks = inputs.map((input) =>
    limit(async () => {
      const result = await getApi().compressImageWorker(input.file, input.settings);
      completed++;
      onProgress?.(completed, inputs.length);
      return { input, result };
    })
  );

  const taskResults = await Promise.all(tasks);
  results.push(...taskResults);

  return results;
}

export function terminateCompressionWorker(): void {
  worker?.terminate();
  worker = undefined;
  api = undefined;
}
