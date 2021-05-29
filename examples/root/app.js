/** 0. Setup vue injector */
import app from '../demo.setup';

/** 1. Define components */
app.component('VueInjector', {
  name: 'RootComponent',
  template:
    '<div class="block"></div>',
  mounted() {
    /** root service implementation in `../demo.setup` */
    this.demo(this.RootService);
  }
});

/** 3. Mount root instance. */
app.mount('#app');
