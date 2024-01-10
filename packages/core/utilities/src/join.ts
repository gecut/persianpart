export function join(
  separator = ' ',
  ...values: Array<unknown | undefined | null>
): string {
  values = values.map((value) => String(value));

  return values.join(separator);
}

export function joinObjectValuesDeep(
  separator = ' ',
  object: Record<string, unknown>,
): string {
  const values = Object.values(object)
    .filter((value) => !!value)
    .map((value) => {
      if (typeof value === 'object') {
        return joinObjectValuesDeep(
          separator,
          value as Record<string, unknown>,
        );
      }

      return String(value);
    });

  return values.join(separator);
}
