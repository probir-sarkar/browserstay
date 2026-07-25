export function getBaseName(file: File): string {
  const { name } = file;
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name || "document";
}

export function getFileExtension(file: File): string {
  const { name } = file;
  const dot = name.lastIndexOf(".");
  if (dot === -1 || dot === name.length - 1) throw new Error("File has no extension");
  return name.slice(dot + 1);
}
