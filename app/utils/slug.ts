const unsafeCharacters = /[^\p{Letter}\p{Number}]+/gu;
const repeatedSeparators = /-+/g;

export function createSlug(value: string): string {
  return value
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase('fa')
    .replace(unsafeCharacters, '-')
    .replace(repeatedSeparators, '-')
    .replace(/^-|-$/g, '');
}
