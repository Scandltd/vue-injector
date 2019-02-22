import { assert, isError, warn } from '../../../src/util/warn';
import { ERROR_MESSAGE, message } from '../../../src/enums/messages';

describe('warn', () => {
  it('assert false', () => {
    expect(() => assert(false, 'error text')).toThrowError(`${ERROR_MESSAGE.ERROR_000} error text`);
  });

  it('assert true', () => {
    expect(() => assert(true, 'error text')).not.toThrow();
  });

  it('isError true', () => {
    const error = new Error();

    expect(isError(error)).toBe(true);
  });

  it('isError false', () => {
    const error = {};

    expect(isError(error)).toBe(false);
  });

  describe('console', () => {
    beforeEach(() => {
      spyOn(console, 'warn');
    });

    it('error message', () => {

      message('', { name: 'name' });

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(`${ERROR_MESSAGE.ERROR_002}name`);
    });

    it('empty message', () => {
      expect(message('test')).toEqual('test');
    });

    it('warn true', () => {
      warn(true, 'error text');
      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    it('warn false', () => {
      warn(false, 'error text');
      expect(console.warn).toHaveBeenCalledWith(`${ERROR_MESSAGE.ERROR_000} error text`);
    });
  });
});
