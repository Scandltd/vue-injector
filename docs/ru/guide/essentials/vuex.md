# Vuex

## Интеграция

Для использования `vue-injector` в хранилище необходимо передать экземпляр `store` в конструктор плагина:

```js
import Vue from 'vue'
import Vuex from 'vuex'
import VueInjector from '@scandltd/vue-injector'

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

После чего `$injector` станет доступен в контексте событий:

```js
 ...
 actions: {
    increment () {
      this.$injector.get(Service);
    }
  },
 ...
```