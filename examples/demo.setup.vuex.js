import Vue from 'vue';
import Vuex from 'vuex';
import { VueInjector } from '@scandltd/vue-injector';

import Demo from './demo.mixin';

/** Use mixin for showing injectable object */
Vue.mixin(Demo);

/** 1. Use plugins. */
Vue.use(VueInjector);
Vue.use(Vuex);

/** 2. Create vuex store. */
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count += 1;
    }
  },
  actions: {
    increment(context) {
      // this.$injector.get(Service)
      context.commit('increment');
    }
  }
});

/** 3. Create the provider */
const injector = new VueInjector({
  store
});

/** 4. Create and mount root instance. */
export default new Vue({
  el: '#app',
  store,
  injector
});
