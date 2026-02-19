/**
 * Formats a number as a currency string.
 * @param amount - The number to format.
 * @param currency - The currency code (default: 'NGN').
 * @returns A formatted currency string.
 */
export const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount).replace('NGN', '₦').replace('₦ ', '₦');
};
