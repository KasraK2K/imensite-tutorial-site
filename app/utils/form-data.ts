function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getStringField(body: unknown, field: string): string {
  if (!isRecord(body)) return '';
  const value = body[field];
  return typeof value === 'string' ? value.trim() : '';
}

export function getStringArrayField(body: unknown, field: string): string[] {
  if (!isRecord(body)) return [];
  const value = body[field];
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string');
  }
  return typeof value === 'string' && value ? [value] : [];
}
