import Vue from 'vue'
import VueInjector, { Injectable, Inject } from '@scandltd/vue-injector'
import Code from './../mixin'

Vue.mixin(Code)

// 1. Use plugin.
// This injects $injector to all injector-enabled child components
Vue.use(VueInjector)

// 2. Create services
@Injectable
class Service extends Inject {}

@Injectable({
  import: {
    Service
  }
})
class AnyService extends Inject {}

// 3. Define components
Vue.component('anyComponent', {
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
            <span class="service-import">{{ $AnyService.Service.name }}</span>
        </div>
      </div>
    </div>`,
  mounted () {
    this.code(this.$AnyService, this.$refs.main)
    this.code(this.$AnyService.Service, this.$refs.import)
  }
})

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
