import Vue from 'vue'
import VueInjector, { Injectable, Inject } from '@scandltd/vue-injector'
import Code from './../mixin'

Vue.mixin(Code)

// 1. Use plugin.
// This injects $injector to all injector-enabled child components
Vue.use(VueInjector)

// 2. Create services
@Injectable
class Service {}

@Injectable
class AnyService {
  @Inject(Service) service;

  constructor () {
    console.log('constructor', this.service)
  }
}

// 3. Define components
Vue.component('VueInjector', {
  name: 'anyComponent',
  providers: {
    $AnyService: AnyService
  },
  template:
    `<div>
      <div class="block">
        <div ref="main" class="service">
            <span class="service-name">{{ $AnyService.name }}</span>
        </div>
      </div>
      <div class="block">
        <div ref="import" class="service">
            <span class="service-import">{{ $AnyService.service && $AnyService.service.name }}</span>
        </div>
      </div>
    </div>`,
  mounted () {
    this.code(this.$AnyService, this.$refs.main)
    this.code(this.$AnyService.service, this.$refs.import)
  }
})

// 4. Create the provider
const injector = new VueInjector()

// 5. Create and mount root instance.
// Make sure to inject the services.
new Vue({
  el: '#app',
  injector
})
