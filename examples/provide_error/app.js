import Vue from 'vue';

/** 0. Setup vue injector */
import('../demo.setup');

/** 1. Create other service */
class OtherService {}

/** 2. Define components */
Vue.component('VueInjector', {
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
