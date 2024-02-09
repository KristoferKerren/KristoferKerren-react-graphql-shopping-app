export default function formatMoney(amount = 0) {
  const amountFormatted = Number(amount) || 0;

  const minimumFractionDigits = amountFormatted % 100 === 0 ? 0 : 2;

  const formatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
  });

  return formatter.format(amountFormatted / 100);
}
