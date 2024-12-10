const crypto = require("crypto");

/**
 * Generate a random string using the crypto library.
 *
 * @param {number} [length=32] Double the required length of the random string.
 * @returns {string} A hex string, half the length of the `length` parameter
 */
function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

module.exports = generateRandomString;
