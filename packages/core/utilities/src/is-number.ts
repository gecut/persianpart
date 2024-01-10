export default function isNumber(value: unknown) {
  return (
    (typeof value === 'number' && isFinite(value)) ||
    (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value)))
  );
}
