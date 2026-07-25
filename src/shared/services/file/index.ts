export function getBaseName(file: File): string {
  const { name } = file;
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name || "document";
}