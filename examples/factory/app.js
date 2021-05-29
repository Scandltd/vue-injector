/* eslint-disable max-classes-per-file */
import { Injectable, Inject } from '@scandltd/vue-injector';

/** 0. Setup vue injector */
import app from '../demo.setup';

/** 1. Some kind of 3rd HTTP client */
class Client {
  get() {
    /** ... */
  }
}

/** 2. Create client service wrapper */
@Injectable({
  useFactory: () => new Client()
})
class ClientService {}

/** 3. Create internal Http service */
@Injectable
class HttpService {
  @Inject(ClientService) client;

  get() {
    this.client.get();
  }
}

/** 4. Define components */
app.component('VueInjector', {
  name: 'TodoComponent',
  providers: {
    $Http: HttpService
  },
  template:
    '<div class="block"></div>',
  mounted() {
    this.demo(this.$Http);
  }
});

/** 5. Mount root instance. */
app.mount('#app');
