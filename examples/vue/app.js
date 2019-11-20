import Vue from 'vue';
import { Injectable, Inject } from '@scandltd/vue-injector';

/** 0. Setup vue injector */
import('../demo.setup');

/** 1. Create services */
@Injectable
class LogService {
  @Inject(Vue) vm;
}

/** 2. Define components */
Vue.component('VueInjector', {
  name: 'TransportComponent',
  providers: {
    $logger: LogService
  },
  template:
    '<div class="block"></div>',
  mounted() {
    this.demo(this.$logger);
  }
});
