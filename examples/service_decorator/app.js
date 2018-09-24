import Vue from 'vue'
import VueInjector, { Injectable, Inject, Service } from '@scandltd/vue-injector'
import Code from './../mixin'
import Component from 'vue-class-component'

Vue.mixin(Code)

// 1. Use plugin.
// This injects $injector to all injector-enabled child components
Vue.use(VueInjector)

// 2. Create services

@Injectable
class AnyService extends Inject {}

// 3. Define components

@Component({
  template:
    `<div class="block">
      <div class="service-name">{{ service.name }}</div>
    </div>`
})
class AnyComponent extends Vue {
  @Service(AnyService) service;

  mounted () {
    this.code(this.service, this.$el)
  }
}

Vue.component('anyComponent', AnyComponent)

// 4. Create the provider
const injector = new VueInjector()

// 5. Create and mount root instance.
// Make sure to inject the services.
new Vue({
  injector,
  template: `
    <div id="app">
      <any-component/>
    </div>
  `
}).$mount('#app')