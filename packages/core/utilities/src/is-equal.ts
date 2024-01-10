export default function isEqual<T>(a: T, b: T): boolean {
  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === 'object' &&
    typeof b === 'object' &&
    a != null &&
    b != null) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    if (Array.isArray(a) && Array.isArray(b)) {
      for (let i = 0; i < aKeys.length; i++) if (a[i] !== b[i]) return false;
    } else {
      for (const key of aKeys) if (bKeys.includes(key) === false) return false;
    }

    return true;
  }

  return a === b;
}
