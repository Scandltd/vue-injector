import { ERROR_MESSAGE } from '../enums/messages';

export function assert (condition: any, message: string) {
  if (!condition) {
    throw new Error(`${ERROR_MESSAGE.ERROR_000} ${message}`);
  }
}

export function warn (condition: any, message: string) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(`${ERROR_MESSAGE.ERROR_000} ${message}`);
  }
}

export function isError (err: any): boolean {
  return Object.prototype.toString.call(err).indexOf('Error') > -1;
}
