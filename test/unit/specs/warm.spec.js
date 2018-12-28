import { assert, isError, warn } from '../../../src/util/warn';
describe('warn', function () {
    it('assert false', function () {
        expect(function () { return assert(false, 'error text'); }).toThrowError('[@scandltd/vue-injector] error text');
    });
    it('assert true', function () {
        expect(function () { return assert(true, 'error text'); }).not.toThrow();
    });
    it('isError true', function () {
        var error = new Error();
        expect(isError(error)).toBe(true);
    });
    it('isError false', function () {
        var error = {};
        expect(isError(error)).toBe(false);
    });
    describe('console', function () {
        beforeEach(function () {
            spyOn(console, 'warn');
        });
        it('warn true', function () {
            warn(true, 'error text');
            expect(console.warn).toHaveBeenCalledTimes(0);
        });
        it('warn false', function () {
            warn(false, 'error text');
            expect(console.warn).toHaveBeenCalledWith('[@scandltd/vue-injector] error text');
        });
    });
});
//# sourceMappingURL=warm.spec.js.map