<template>
  <div class="block"></div>
</template>

<script lang="ts">
import { Vue, Options} from 'vue-class-component';

import { Injectable, Inject } from '@scandltd/vue-injector';

@Injectable
class UserService {
  log() {
    /** ... */
  }
}

@Options({})
export default class UserComponent extends Vue {
  @Inject userService: UserService;

  mounted () {
    this.demo1(this.userService);
  }
}
</script>
