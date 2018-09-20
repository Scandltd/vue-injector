import { assert, isError, warn } from '../../../src/util/warn'

describe('warn', () => {
  it('assert false', () => {
    expect(() => assert(false, 'error text')).toThrowError('[@scandltd/vue-injector] error text')
  })

  it('assert true', () => {
    expect(() => assert(true, 'error text')).not.toThrow()
  })

  it('isError true', () => {
    const error = new Error()

    expect(isError(error)).toBe(true)
  })

  it('isError false', () => {
    const error = {}

    expect(isError(error)).toBe(false)
  })

  describe('console', () => {
    beforeEach(() => {
      spyOn(console, 'warn')
    })

    it('warn true', () => {
      warn(true, 'error text')
      expect(console.warn).toHaveBeenCalledTimes(0)
    })

    it('warn false', () => {
      warn(false, 'error text')
      expect(console.warn).toHaveBeenCalledWith('[@scandltd/vue-injector] error text')
    })
  })
})
