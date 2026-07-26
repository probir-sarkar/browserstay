import * as Comlink from "comlink";
import type { ImageWorkerApi } from "./image.worker";
import type { EncodeImageOptions, ResizeWorkerOptions } from "./types";
import pLimit from "p-limit";

let worker: Worker | undefined;
let api: Comlink.Remote<ImageWorkerApi> | undefined;

function getApi(): Comlink.Remote<ImageWorkerApi> {
  if (!api) {
    worker = new Worker(new URL("./image.worker.ts", import.meta.url), {
      type: "module",
    });
    api = Comlink.wrap<ImageWorkerApi>(worker);
  }
  return api;
}

export interface EncodeImageInput {
  file: File;
  options: EncodeImageOptions;
  id?: string;
}

export interface EncodeImageSuccess {
  input: EncodeImageInput;
  result: Awaited<ReturnType<ImageWorkerApi["encodeImageWorker"]>>;
}

/**
 * Encodes multiple images with controlled concurrency using p-limit.
 * Processes up to 4 images in parallel to avoid overwhelming the worker.
 */
export async function encodeImages(
  inputs: EncodeImageInput[],
  onProgress?: (completed: number, total: number) => void
): Promise<EncodeImageSuccess[]> {
  if (inputs.length === 0) return [];

  const limit = pLimit(4);
  let completed = 0;

  const tasks = inputs.map((input) =>
    limit(async () => {
      const result = await getApi().encodeImageWorker(input.file, input.options);
      completed++;
      onProgress?.(completed, inputs.length);
      return { input, result };
    })
  );

  return Promise.all(tasks);
}

export interface ResizeImageInput {
  file: File;
  options: ResizeWorkerOptions;
  id?: string;
}

export type ResizeImageSuccess = EncodeImageSuccess;

export async function resizeImages(
  inputs: ResizeImageInput[],
  onProgress?: (completed: number, total: number) => void
): Promise<ResizeImageSuccess[]> {
  if (inputs.length === 0) return [];

  const limit = pLimit(4);
  let completed = 0;

  const tasks = inputs.map((input) =>
    limit(async () => {
      const result = await getApi().resizeImageWorker(input.file, input.options);
      completed++;
      onProgress?.(completed, inputs.length);
      return { input, result };
    })
  );

  return Promise.all(tasks);
}

export function terminateImageWorker(): void {
  worker?.terminate();
  worker = undefined;
  api = undefined;
}
