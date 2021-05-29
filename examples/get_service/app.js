import { Injectable } from '@scandltd/vue-injector';

/** 0. Setup vue injector */
import app from '../demo.setup';

/** 1. Create user services */
@Injectable
class UserService {
  users() {
    /** ... */
  }
}

/** 2. Define components */
app.component('VueInjector', {
  name: 'UserListComponent',
  template:
    '<div class="block"></div>',
  created() {
    this.$UserService = this.$injector.get(UserService);
  },
  mounted() {
    this.demo(this.$UserService);
  }
});

/** 3. Mount root instance. */
app.mount('#app');
