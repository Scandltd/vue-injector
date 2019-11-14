/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-classes-per-file */
import Vue from 'vue';
import VueInjector, { Injectable, Inject } from '@scandltd/vue-injector';
import Component from 'vue-class-component';
import Code from '../mixin';

Vue.mixin(Code);

// 1. Use plugin.
// This injects $injector to all injector-enabled child components
Vue.use(VueInjector);

// 2. Create services

@Injectable
class AnyService {}

// 3. Define components

@Component({
  template:
    '<div class="block"></div>'
})
class AnyComponent extends Vue {
  @Inject(AnyService) service;

  mounted() {
    this.code(this.service, this.$el);
  }
}

Vue.component('VueInjector', AnyComponent);

// 4. Create the provider
const injector = new VueInjector();

// 5. Create and mount root instance.
// Make sure to inject the services.
new Vue({
  el: '#app',
  injector
});
