import OurVue, { VueConstructor } from 'vue';
import { assert } from './util/warn';

export function install(Vue: VueConstructor) {
  if ((install as any).installed) return;
  (install as any).installed = true;

  if (OurVue !== Vue) {
    throw assert(false, 'Multiple instances of Vue detected');
  }

  const isDef = (v) => v !== undefined;

  if (Vue.$injectorInstalled) return;
  Vue.$injectorInstalled = true;

  Vue.mixin({
    beforeCreate() {
      if (isDef(this.$options.providers)) {
        this.providers = this.$options.providers;
      }

      if (isDef(this.$options.injector)) {
        Object.defineProperty(this, '$injector', {
          configurable: false,
          writable: false,
          value: Vue.observable(this.$options.injector)
        });

        this.$injector.init(this);
      } else {
        Object.defineProperty(this, '$injector', {
          configurable: false,
          writable: false,
          value: (this.$parent && this.$parent.$injector) || this
        });

        if (this.$injector && this.$injector.initComponent && typeof this.$injector.initComponent === 'function') {
          this.$injector.initComponent(this);
        }
      }
    }
  });
}
