/** 0. Setup vue app with injector */
import app from '../demo.setup';

import UserComponent from './UserComponent.vue';

app.component('VueInjector', UserComponent);

/** 1. Mount root instance. */
app.mount('#app');
