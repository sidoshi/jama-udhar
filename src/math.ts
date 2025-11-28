import { create, all } from "mathjs";

const math = create(all, {
  // disable dangerous functions
  matrix: "Array",
});

export function evaluate(expr: string): number {
  return math.evaluate(expr);
}

export function isValid(expr: string): boolean {
  try {
    evaluate(expr);
    return true;
  } catch {
    return false;
  }
}
