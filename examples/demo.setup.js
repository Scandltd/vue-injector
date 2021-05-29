import { createApp, defineComponent } from 'vue';
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

/** 3. Create the provider */
app.use(plugin, {
  root: [RootService]
});

export default app;
