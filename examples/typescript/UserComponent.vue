<template>
  <div class="block"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { Injectable, Inject } from '@scandltd/vue-injector';

import JSONFormatter from 'json-formatter-js';

@Injectable
class UserService {}

@Component
export default class UserComponent extends Vue {
  @Inject(UserService) userService: UserService;

  mounted () {
    (<any>this).demo(this.userService);
  }
}
</script>
