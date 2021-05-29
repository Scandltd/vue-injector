import { Injectable } from '@scandltd/vue-injector';

/** 0. Setup vue app with injector */
import app from '../demo.setup';

/** 1. Create services */
@Injectable
class LogService {
  log() {
    /** ... */
  }
}

/** 2. Define component */
app.component('vue-injector', {
  providers: {
    $Logger: LogService
  },
  template:
    '<div class="block"></div>',
  mounted() {
    this.demo(this.$Logger);
  }
});

/** 4. Mount root instance. */
app.mount('#app');
