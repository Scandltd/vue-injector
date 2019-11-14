/* eslint-disable max-classes-per-file */
import Vue from 'vue';
import VueInjector, { Injectable, Inject } from '@scandltd/vue-injector';
import Code from '../mixin';

Vue.mixin(Code);

// 1. Use plugin.
// This injects $injector to all injector-enabled child components
Vue.use(VueInjector);

// 2. Create services
@Injectable
class Service {}

@Injectable({
  useValue: 'anyValue'
})
class AnyService {
  @Inject(Service) service;
}

// 3. Define components
Vue.component('VueInjector', {
  name: 'anyComponent',
  providers: {
    $AnyService: AnyService
  },
  template:
    '<div class="block"></div>',
  mounted() {
    this.code(this.$AnyService, this.$el);
  }
});

// 4. Create the provider
const injector = new VueInjector();

// 5. Create and mount root instance.
// Make sure to inject the services.
new Vue({
  el: '#app',
  injector
});
