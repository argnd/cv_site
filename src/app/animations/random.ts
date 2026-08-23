/** Random float in [min, max). */
export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
