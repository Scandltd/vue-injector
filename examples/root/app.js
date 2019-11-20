import Vue from 'vue';

/** 0. Setup vue injector */
import('../demo.setup');

/** 1. Define components */
Vue.component('VueInjector', {
  name: 'RootComponent',
  template:
    '<div class="block"></div>',
  mounted() {
    /** root service implementation in `../demo.setup` */
    this.demo(this.RootService);
  }
});
