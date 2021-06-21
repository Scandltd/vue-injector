# Vuex

## Integration

To use `vue-injector` in the store, you must pass the `Store` instance to the plugin constructor:

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