import { Injectable, Inject } from '@scandltd/vue-injector';

/** 0. Setup vue injector */
import app from '../demo.setup';

/** 1. Create services */
@Injectable
class LogService {
  @Inject(app) vm;
}

/** 2. Define components */
app.component('VueInjector', {
  name: 'TransportComponent',
  providers: {
    $logger: LogService
  },
  template:
    '<div class="block"></div>',
  mounted() {
    this.demo(this.$logger);
  }
});

/** 3. Mount root instance. */
app.mount('#app');
