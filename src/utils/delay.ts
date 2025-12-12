/**
 * Delay utility
 * Provides a simple way to simulate async delays (useful for mock APIs)
 */

/**
 * Wait for a specified number of milliseconds
 * @param ms - Milliseconds to wait
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
