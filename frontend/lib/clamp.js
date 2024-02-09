export default function clamp(value, minLimit, maxLimit) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return minLimit;
  }
  return Math.min(Math.max(Number(value), minLimit), maxLimit);
}
