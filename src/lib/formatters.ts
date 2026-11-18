/**
 * SmartSpend AI - Indian Rupee (INR) Currency Formatter
 * Complies with:
 *   locale: 'en-IN'
 *   style: 'currency'
 *   currency: 'INR'
 * Output example: ₹1,00,000 or ₹1,00,000.00
 */

export const inrCurrencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const inrCurrencyFormatterNoDecimals = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formats a numeric value into INR currency string.
 * @param amount Number or numeric string
 * @param showDecimals Whether to display 2 decimal places (default: true)
 * @returns e.g. "₹1,00,000.00" or "₹1,00,000"
 */
export const formatINR = (
  amount: number | string | null | undefined,
  showDecimals: boolean = true
): string => {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount ?? 0)) || 0;
  return showDecimals
    ? inrCurrencyFormatter.format(num)
    : inrCurrencyFormatterNoDecimals.format(num);
};

/**
 * Compact Indian currency formatting for chart axes and small labels.
 * e.g., ₹1k, ₹10k, ₹1L, ₹10L, ₹1Cr
 */
export const formatINRAxis = (value: number): string => {
  if (value === 0) return '₹0';
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 10000000) {
    return `${sign}₹${(abs / 10000000).toFixed(1)}Cr`;
  }
  if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(1)}L`;
  }
  if (abs >= 1000) {
    return `${sign}₹${(abs / 1000).toFixed(1)}k`;
  }
  return inrCurrencyFormatterNoDecimals.format(value);
};
