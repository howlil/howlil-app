export function normalizeTag(value: string): string {
  return value.trim().toLocaleLowerCase('en-US');
}

export function matchesTag(candidate: string, selected: string): boolean {
  return normalizeTag(candidate) === normalizeTag(selected);
}
