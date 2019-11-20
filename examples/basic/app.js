import Vue from 'vue';
import { Injectable } from '@scandltd/vue-injector';

/** 0. Setup vue injector */
import('../demo.setup');

/** 1. Create services */
@Injectable
class LogService {
  log() {
    /** ... */
  }
}

/** 2. Define components */
Vue.component('VueInjector', {
  name: 'AvatarComponent',
  providers: {
    $Logger: LogService
  },
  template:
      '<div class="block"></div>',
  mounted() {
    this.demo(this.$Logger);
  }
});
