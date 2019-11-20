/* eslint-disable max-classes-per-file */
import Vue from 'vue';
import { Injectable, Inject } from '@scandltd/vue-injector';

/** 0. Setup vue injector */
import('../demo.setup');

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
Vue.component('VueInjector', {
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
