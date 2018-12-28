var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function injectableFactory(target, options) {
    if (options === void 0) { options = {}; }
    return /** @class */ (function (_super) {
        __extends(Injectable, _super);
        function Injectable(root) {
            var _this = _super.call(this, root) || this;
            _this.isVueService = true;
            _this.name = target.name;
            _this.context = options.context || null;
            _this.import = options.import || null;
            _this.vm = root;
            return _this;
        }
        Injectable.getName = function () {
            return target.name;
        };
        return Injectable;
    }(target));
}
export function Injectable(options) {
    if (typeof options === 'function') {
        return injectableFactory(options);
    }
    return function (target) {
        return injectableFactory(target, options);
    };
}
//# sourceMappingURL=injectable.js.map