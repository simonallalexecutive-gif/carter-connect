/**
 * Format a numeric string with dot separators (French style)
 * e.g. 150000 → 150.000, 1800 → 1.800
 */
export function formatNumberWithDots(value: string): string {
  // Keep only digits
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  // Add dot separators every 3 digits from right
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Strip dots to get raw numeric value
 */
export function unformatNumber(value: string): string {
  return value.replace(/\./g, '');
}

/**
 * Format a French phone number with dots
 * e.g. 0650102030 → 06.50.10.20.30
 * +33650102030 → +33.6.50.10.20.30
 */
export function formatPhoneWithDots(value: string): string {
  // Keep digits and leading +
  const hasPlus = value.startsWith('+');
  const digits = value.replace(/\D/g, '');
  if (!digits) return hasPlus ? '+' : '';

  if (hasPlus) {
    // International format: +33 6 50 10 20 30 → +33.6.50.10.20.30
    const prefix = digits.slice(0, 2); // country code e.g. 33
    const rest = digits.slice(2);
    const pairs = rest.match(/.{1,2}/g) || [];
    return '+' + prefix + '.' + pairs.join('.');
  }

  // Local format: 0650102030 → 06.50.10.20.30
  const pairs = digits.match(/.{1,2}/g) || [];
  return pairs.join('.');
}
