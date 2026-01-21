/**
 * Vector similarity utilities for embedding comparisons.
 * Used to compute semantic similarities in the ML pipeline.
 */

/**
 * Computes the dot product of two vectors.
 * @param a First vector
 * @param b Second vector
 * @returns Sum of element-wise products
 */
export function dot(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

/**
 * Computes the magnitude (Euclidean norm) of a vector.
 * @param a Vector
 * @returns Square root of dot(a, a)
 */
export function magnitude(a: number[]): number {
  return Math.sqrt(dot(a, a));
}

/**
 * Computes the cosine similarity between two vectors.
 * @param a First vector
 * @param b Second vector
 * @returns Cosine similarity in range [-1, 1], or 0 if either magnitude is 0
 */
export function cosine(a: number[], b: number[]): number {
  const magA = magnitude(a);
  const magB = magnitude(b);

  if (magA === 0 || magB === 0) {
    return 0;
  }

  return dot(a, b) / (magA * magB);
}
