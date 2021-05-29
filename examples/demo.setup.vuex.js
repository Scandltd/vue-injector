import { createApp, defineComponent } from 'vue';
import { createStore } from 'vuex';
import plugin, { Injectable } from '@scandltd/vue-injector';

import Demo from './demo.mixin';

const root = defineComponent({});

/** 0. Create vue app */
const app = createApp(root);

/** 1. Use mixin for showing injectable object */
app.mixin(Demo);

/** 2. Create root service */
@Injectable
class RootService {}

/** 3. Create vuex store. */
const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count += 1;
    }
  },
  actions: {
    increment(context) {
      this.$injector.get(RootService);
      context.commit('increment');
    }
  }
});

app.use(store);

/** 4. Create the provider */
app.use(plugin, {
  store,
  root: [RootService]
});

export default app;
