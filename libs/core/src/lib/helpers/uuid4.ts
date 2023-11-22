/**
 * @description Hexadecimal string representing a uuid4 value.
 * The length is exactly 32 characters.
 * Dashes are not allowed.
 * Has to be lowercase.
 * @see https://develop.sentry.dev/sdk/event-payloads/#required-attributes
 */
export function uuid4(): string {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
}
