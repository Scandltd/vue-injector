import Vue from 'vue';
import { Injectable } from '@scandltd/vue-injector';

/** 0. Setup vue injector */
import('../demo.setup');

/** 1. Create services */
@Injectable({
  useValue: 'TOKEN'
})
class TokenService {}

/** 2. Define components */
Vue.component('VueInjector', {
  name: 'TokenComponent',
  providers: {
    $TOKEN: TokenService
  },
  template:
    '<div class="block"></div>',
  mounted() {
    this.demo(this.$TOKEN);
  }
});
