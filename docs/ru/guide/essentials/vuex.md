# Vuex

## Интеграция

Для использования `vue-injector` в хранилище необходимо передать экземпляр `store` в конструктор плагина:

```js
import { createApp, defineComponent } from 'vue';
import { createStore } from 'vuex';

const root = defineComponent({});
const app = createApp(root);
const store = createStore({});

app.use(store);
app.use(plugin, {
  store,
});
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