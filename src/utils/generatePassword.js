/**
 * Generate a random password
 * @param {number} length - Length of the password (default: 12)
 * @param {string} charset - Character set to use (default: alphanumeric)
 * @returns {string} Generated password
 */
export function generatePassword(length = 12, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

