/**
 * formatPhone
 * Strips non-digits from the input; if exactly 10 digits, returns "(123)-456-7890",
 * otherwise returns the original string.
 *
 * @param {string} input
 * @returns {string}
 */
export function formatPhone(input = '') {
  // Remove everything except digits
  const digits = input.replace(/\D/g, '');

  // Only format if there are exactly 10 digits
  if (digits.length !== 10) {
    return input;
  }

  const area   = digits.slice(0, 3);
  const prefix = digits.slice(3, 6);
  const line   = digits.slice(6, 10);

  return `(${area})-${prefix}-${line}`;
}