import { create, all } from "mathjs";

const math = create(all, {
  // disable dangerous functions
  matrix: "Array",
});

function preprocessExpression(expr: string) {
  // Step 1: Strip commas
  let processed = expr.replace(/,/g, "");

  // Step 2: Handle Indian shorthand notation
  // k (thousand) = 1,000
  // l/L (lakh) = 100,000
  // cr/Cr (crore) = 10,000,000
  processed = processed.replace(
    /(\d+\.?\d*)(k|l|cr)/gi,
    (_match: string, num: string, suffix: string) => {
      const number = parseFloat(num);
      const lowerSuffix = suffix.toLowerCase();

      let multiplier;
      if (lowerSuffix === "k") {
        multiplier = 1000;
      } else if (lowerSuffix === "l") {
        multiplier = 100000;
      } else if (lowerSuffix === "cr") {
        multiplier = 10000000;
      } else {
        throw new Error("Unknown suffix");
      }

      return (number * multiplier).toString();
    }
  );

  return processed;
}

export function evaluate(expr: string): number {
  const preprocessed = preprocessExpression(expr);
  return math.evaluate(preprocessed);
}

export function isValid(expr: string): boolean {
  try {
    evaluate(expr);
    return true;
  } catch {
    return false;
  }
}
