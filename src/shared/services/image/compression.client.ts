import * as Comlink from "comlink";
import type { CompressionWorkerApi } from "./compression.worker";

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

export const compressImage: CompressionWorkerApi["compressImage"] = (file, settings) =>
  getApi().compressImage(file, settings);

export function terminateCompressionWorker(): void {
  worker?.terminate();
  worker = undefined;
  api = undefined;
}
