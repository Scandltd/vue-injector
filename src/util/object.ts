import { warn } from './warn';

export function checkObject (obj: any): boolean {
  return !Array.isArray(obj) && typeof obj === 'object' && obj !== null;
}

export function checkGetName (provider: any): boolean {
  if (Object.hasOwnProperty.call(provider, 'getName') && typeof provider.getName === 'function') {
    return true;
  } else {
    warn(false, 'no decorator Injectable or extends Inject');
    return false;
  }
}
