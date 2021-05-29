/** 0. Setup vue injector */
import app from '../demo.setup';

/** 1. Create other service */
class OtherService {}

/** 2. Define components */
app.component('VueInjector', {
  name: 'ListComponent',
  providers: {
    $OtherService: OtherService
  },
  template:
    '<div class="block"></div>',
  mounted() {
    this.demo(this.$OtherService);
  }
});

/** 3. Mount root instance. */
app.mount('#app');
