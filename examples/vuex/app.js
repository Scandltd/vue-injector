/* eslint-disable no-param-reassign */
import Vue from 'vue';
import { Injectable } from '@scandltd/vue-injector';

/** 0. Setup vue injector */
import('../demo.setup.vuex');

// 3. Create services
@Injectable
class StoreService {}

// 4. Define components
Vue.component('VueInjector', {
  name: 'anyComponent',
  providers: {
    $StoreService: StoreService
  },
  template:
    '<div class="block"></div>',
  mounted() {
    this.$store.dispatch('increment');
    this.demo(this.$StoreService);
  }
});
