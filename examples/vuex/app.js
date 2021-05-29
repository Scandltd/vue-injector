/* eslint-disable no-param-reassign */
import { Injectable } from '@scandltd/vue-injector';

/** 0. Setup vue injector */
import app from '../demo.setup.vuex';

// 1. Create services
@Injectable
class StoreService {}

// 2. Define components
app.component('VueInjector', {
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

/** 3. Mount root instance. */
app.mount('#app');
