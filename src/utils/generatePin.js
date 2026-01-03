/**
 * Generate a random numeric PIN
 * @param {number} length - The desired length of the PIN. Defaults to 4.
 * @returns {string} Generated PIN as string
 */
export function generatePin(length = 4) {
  if (length < 1) {
    throw new Error('PIN length must be at least 1')
  }
  
  // Generate a random number with the specified number of digits
  const min = Math.pow(10, length - 1)
  const max = Math.pow(10, length) - 1
  const pin = Math.floor(min + Math.random() * (max - min + 1))
  
  return pin.toString().padStart(length, '0')
}

