export var $Vue;
export function install(Vue) {
    if (install.installed && $Vue === Vue)
        return;
    install.installed = true;
    $Vue = Vue;
    var isDef = function (v) { return v !== undefined; };
    var registerInstance = function (vm, callVal) {
        var i = vm.$options._parentVnode;
        if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
            i(vm, callVal);
        }
    };
    Vue.mixin({
        beforeCreate: function () {
            if (isDef(this.$options.providers)) {
                this._providers = this.$options.providers;
            }
            if (isDef(this.$options.injector)) {
                this._injectorRoot = this;
                this._injector = this.$options.injector;
                this._injector.init(this);
            }
            else {
                this._injectorRoot = (this.$parent && this.$parent._injectorRoot) || this;
                this._injectorRoot._injector.initComponent(this);
            }
            registerInstance(this, this);
        },
        destroyed: function () {
            registerInstance(this);
        }
    });
    Object.defineProperty(Vue.prototype, '$injector', {
        get: function () {
            return this._injectorRoot._injector;
        }
    });
}
//# sourceMappingURL=install.js.map