import type { ImageFile, ResizeSettings } from "../types";

export async function loadImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

export function calculateTargetDimensions(
  originalWidth: number,
  originalHeight: number,
  settings: ResizeSettings
): { width: number; height: number } {
  let targetWidth = settings.width;
  let targetHeight = settings.height;

  if (settings.maintainAspectRatio) {
    const aspectRatio = originalWidth / originalHeight;

    if (targetWidth && !targetHeight) {
      targetHeight = Math.round(targetWidth / aspectRatio);
    } else if (targetHeight && !targetWidth) {
      targetWidth = Math.round(targetHeight * aspectRatio);
    } else if (targetWidth && targetHeight) {
      const targetAspectRatio = targetWidth / targetHeight;
      if (aspectRatio > targetAspectRatio) {
        targetHeight = Math.round(targetWidth / aspectRatio);
      } else {
        targetWidth = Math.round(targetHeight * aspectRatio);
      }
    }
  }

  return { width: targetWidth, height: targetHeight };
}

export async function createImageFile(file: File): Promise<ImageFile> {
  const preview = URL.createObjectURL(file);
  const dimensions = await loadImageDimensions(file);

  return {
    id: `${file.name}-${file.size}-${Date.now()}`,
    file,
    preview,
    originalWidth: dimensions.width,
    originalHeight: dimensions.height,
  };
}

export function revokeImageFilePreview(file: ImageFile): void {
  URL.revokeObjectURL(file.preview);
}
