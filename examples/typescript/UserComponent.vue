<template>
  <div class="block"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { Injectable, Inject } from '@scandltd/vue-injector';

@Injectable
class UserService {}

@Component
export default class UserComponent extends Vue {
  @Inject userService: UserService;

  mounted () {
    (<any>this).demo(this.userService);
  }
}
</script>
