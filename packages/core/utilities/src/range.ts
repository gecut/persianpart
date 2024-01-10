export function range(count: number): Array<number> {
  return Array.from({ length: count }, (_, i) => i + 1);
}
