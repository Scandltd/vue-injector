import Vue from 'vue';
import { VueInjector } from '@scandltd/vue-injector';

import UserComponent from './UserComponent.vue';

import Demo from '../demo.mixin';

/** Use mixin for showing injectable object */
Vue.mixin(Demo);

/** 1. Use plugins. */
Vue.use(VueInjector);

/** 2. Create the provider */
const injector = new VueInjector();

/** 4. Create and mount root instance. */
export default new Vue({
  el: '#app',
  injector,
  components: {
    VueInjector: UserComponent
  }
});
