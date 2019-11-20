/* eslint-disable max-classes-per-file */
import Vue from 'vue';
import Component from 'vue-class-component';

import { Injectable, Inject } from '@scandltd/vue-injector';

/** 0. Setup vue injector */
import('../demo.setup');

/** 1. Create services */
@Injectable
class LogService {}

/** 2. Define components */
@Component({
  template:
    '<div class="block"></div>'
})
class MenuComponent extends Vue {
  @Inject(LogService) logger;

  mounted() {
    this.demo(this.logger);
  }
}

Vue.component('VueInjector', MenuComponent);
