export function ensureArray(input: string | string[]): string[] {
  return Array.isArray(input) ? input : [input];
}
