import Vue from 'vue';
import { VueInjector } from '@scandltd/vue-injector';

import AnyComponent from './AnyComponent.vue';

// 1. Use plugin.
// This injects $injector to all injector-enabled child components
Vue.use(VueInjector);


// 2. Create the provider
const injector = new VueInjector();

// 3. Create and mount root instance.
// Make sure to inject the services.
new Vue({
  el: '#app',
  injector,
  components: {
    VueInjector: AnyComponent
  }
});
