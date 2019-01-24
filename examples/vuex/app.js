import Vue from 'vue'
import Vuex from 'vuex'
import VueInjector, { Injectable, Inject } from '@scandltd/vue-injector'
import Code from './../mixin'

Vue.mixin(Code)

// 1. init store
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      // this.$injector.get(Service)
      context.commit('increment')
    }
  }
})

// 2. Use plugin.
// This injects $injector to all injector-enabled child components
Vue.use(VueInjector)

// 3. Create services
@Injectable
class AnyService {}

// 4. Define components
Vue.component('VueInjector', {
  name: 'anyComponent',
  providers: {
    $AnyService: AnyService
  },
  template:
    `<div class="block">
      <div class="service-name">{{ $AnyService.name }}</div>
    </div>`,
  mounted () {
    this.$store.dispatch('increment')
    this.code(this.$AnyService, this.$el)
  }
})

// 5. Create the provider
const injector = new VueInjector({ store })

// 6. Create and mount root instance.
// Make sure to inject the services.
new Vue({
  store,
  injector,
  el: '#app'
})
