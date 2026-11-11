/** Catalogue-style label for product and user ids, e.g. 7 → "No. 007" (auto-imported). */
export function catalogNumber(id: number): string {
  return `No. ${String(id).padStart(3, "0")}`;
}
