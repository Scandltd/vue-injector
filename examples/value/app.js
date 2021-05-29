import { Injectable } from '@scandltd/vue-injector';

/** 0. Setup vue injector */
import app from '../demo.setup';

/** 1. Create services */
@Injectable({
  useValue: 'TOKEN'
})
class TokenService {}

/** 2. Define components */
app.component('VueInjector', {
  name: 'TokenComponent',
  providers: {
    $TOKEN: TokenService
  },
  template:
    '<div class="block"></div>',
  mounted() {
    this.demo(this.$TOKEN);
  }
});

/** 3. Mount root instance. */
app.mount('#app');
