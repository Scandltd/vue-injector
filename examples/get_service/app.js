import Vue from 'vue';
import { Injectable } from '@scandltd/vue-injector';

/** 0. Setup vue injector */
import('../demo.setup');

/** 1. Create user services */
@Injectable
class UserService {
  users() {
    /** ... */
  }
}

/** 2. Define components */
Vue.component('VueInjector', {
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
