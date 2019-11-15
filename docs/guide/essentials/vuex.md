# Vuex

## Integration

To use `vue-injector` in the store, you must pass the `Store` instance to the plugin constructor:

```js
import Vue from 'vue'
import Vuex from 'vuex'
import { VueInjector } from '@scandltd/vue-injector'

Vue.use(Vuex)
Vue.use(VueInjector)

const store = new Vuex.Store()

const injector = new VueInjector({ store })

new Vue({
  store,
  injector,
  el: '#app'
})
```

After that `$injector` will be available in the context of actions:

```js
 ...
 actions: {
    increment () {
      this.$injector.get(Service);
    }
  },
 ...
```