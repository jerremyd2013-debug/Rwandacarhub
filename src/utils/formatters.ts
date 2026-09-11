export function formatRwf(amount: number): string {
  return new Intl.NumberFormat('en-RW', {
    maximumFractionDigits: 0
  }).format(amount) + ' RWF';
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatKm(km: number): string {
  return new Intl.NumberFormat('en-RW', {
    maximumFractionDigits: 0
  }).format(km) + ' km';
}

export function formatPrice(priceRwf: number, priceUsd: number, currency: 'RWF' | 'USD'): string {
  if (currency === 'USD') {
    return formatUsd(priceUsd);
  }
  return formatRwf(priceRwf);
}
