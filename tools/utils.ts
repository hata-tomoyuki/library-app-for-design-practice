import path from "path";
import fs from "fs";

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function lowercaseFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

export function writeFile(filePath: string, content: string) {
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, content);

  console.log(`File written: ${filePath}`);
}
