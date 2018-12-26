export let $Vue;

export function install (Vue) {
  if ((install as any).installed && $Vue === Vue) return;
  (install as any).installed = true;

  $Vue = Vue;

  const isDef = v => v !== undefined;

  const registerInstance = (vm, callVal?) => {
    let i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.providers)) {
        this._providers = this.$options.providers;
      }

      if (isDef(this.$options.injector)) {
        this._injectorRoot = this;
        this._injector = this.$options.injector;
        this._injector.init(this);
      } else {
        this._injectorRoot = (this.$parent && this.$parent._injectorRoot) || this;
        this._injectorRoot._injector.initComponent(this);
      }

      registerInstance(this, this);
    },
    destroyed () {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$injector', {
    get () {
      return this._injectorRoot._injector;
    }
  });
}
