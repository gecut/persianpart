export default function clamp(min: number, current: number, max: number) {
  return Math.min(max, Math.max(min, current));
}
