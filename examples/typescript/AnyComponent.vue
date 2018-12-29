<template>
  <div class="block">
    <div class="service-name">{{ service.name }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { Injectable, Inject, Service } from '@scandltd/vue-injector';

import JSONFormatter from 'json-formatter-js';

@Injectable
class AnyService extends Inject {}

@Component
export default class AnyComponent extends Vue {
  @Service(AnyService) service: AnyService;

  mounted () {
    const formatter = new JSONFormatter(this.service);
    this.$el.appendChild(formatter.render());
  }
}
</script>
