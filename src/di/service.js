function createDecorator(factory) {
    return function (target, key) {
        var Ctor = typeof target === 'function'
            ? target
            : target.constructor;
        if (!Ctor.__decorators__) {
            Ctor.__decorators__ = [];
        }
        Ctor.__decorators__.push(function (options) {
            return factory(options, key);
        });
    };
}
export function Service(service) {
    return createDecorator(function (componentOptions, k) {
        (componentOptions.providers || (componentOptions.providers = {}))[k] = service;
    });
}
//# sourceMappingURL=service.js.map