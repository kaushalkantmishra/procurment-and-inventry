// Currency utility for UAE Dirham (AED)

export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return 'AED 0';
  
  if (num >= 1000000) {
    return `AED ${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `AED ${(num / 1000).toFixed(1)}K`;
  }
  return `AED ${num.toLocaleString()}`;
};

export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const CURRENCY_SYMBOL = 'AED';
export const CURRENCY_NAME = 'UAE Dirham';