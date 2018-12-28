import Vue from 'vue';
import VueInjector from '@scandltd/vue-injector';

import AnyComponent from './AnyComponent.vue';

// 1. Use plugin.
// This injects $injector to all injector-enabled child components
Vue.use(VueInjector as any);


// 2. Create the provider
const injector = new VueInjector();

// 3. Create and mount root instance.
// Make sure to inject the services.
new Vue({
  injector,
  components: {
    AnyComponent
  },
  template: `
    <div id="app">
      <any-component/>
    </div>
  `
}).$mount('#app');
