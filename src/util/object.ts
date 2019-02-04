export function checkObject (obj: any): boolean {
  return !Array.isArray(obj) && typeof obj === 'object' && obj !== null;
}
