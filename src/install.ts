/* eslint-disable import/no-mutable-exports */
export let $Vue;

export function install(Vue) {
  if ((install as any).installed && $Vue === Vue) return;
  (install as any).installed = true;

  $Vue = Vue;

  const isDef = (v) => v !== undefined;

  Vue.mixin({
    beforeCreate() {
      if (isDef(this.$options.providers)) {
        this._providers = this.$options.providers;
      }

      if (isDef(this.$options.injector)) {
        this._injectorRoot = this;
        this._injector = this.$options.injector;
        this._injector.init(this);
      } else {
        this._injectorRoot = (this.$parent && this.$parent._injectorRoot) || this;
        if (this._injectorRoot._injector) this._injectorRoot._injector.initComponent(this);
      }
    }
  });

  Object.defineProperty(Vue.prototype, '$injector', {
    get() {
      return this._injectorRoot && this._injectorRoot._injector;
    }
  });

  // use simple mergeStrategies to prevent _injectorRoot instance lose '__proto__'
  const strats = Vue.config.optionMergeStrategies;
  // eslint-disable-next-line func-names
  strats._injectorRoot = function (parentVal, childVal) {
    return childVal === undefined
      ? parentVal
      : childVal;
  };
}
