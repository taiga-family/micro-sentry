export function safeJoin(input: unknown[], delimiter = ' '): string {
  if (!Array.isArray(input)) {
    return '';
  }

  return input
    .map((value) => {
      try {
        return String(value);
      } catch (e) {
        return '';
      }
    })
    .filter((v) => v !== '')
    .join(delimiter);
}
