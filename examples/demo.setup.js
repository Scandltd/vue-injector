import Vue from 'vue';
import { VueInjector, Injectable } from '@scandltd/vue-injector';

import Demo from './demo.mixin';

/** Use mixin for showing injectable object */
Vue.mixin(Demo);

/** 1. Use plugins. */
Vue.use(VueInjector);

/** 2. Create root service */
@Injectable
class RootService {}

/** 3. Create the provider */
const injector = new VueInjector({
  root: [RootService]
});

/** 4. Create and mount root instance. */
export default new Vue({
  el: '#app',
  injector
});
