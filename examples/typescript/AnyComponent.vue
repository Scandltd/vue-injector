<template>
  <div class="block">
    <div class="service-name">{{ service.name }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { Injectable, Inject } from '@scandltd/vue-injector';

import JSONFormatter from 'json-formatter-js';

@Injectable
class AnyService {}

@Component
export default class AnyComponent extends Vue {
  @Inject(AnyService) service: AnyService;

  mounted () {
    const formatter = new JSONFormatter(this.service);
    this.$el.appendChild(formatter.render());
  }
}
</script>
