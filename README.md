# vue-injector
Dependency Injection for [Vue.js](http://vuejs.org). 

[![Build Status](https://img.shields.io/circleci/project/github/Scandltd/vue-injector/master.svg?longCache=true&style=flat-square)](https://circleci.com/gh/Scandltd/vue-injector)
[![Coverage Status](https://img.shields.io/coveralls/github/Scandltd/vue-injector?style=flat-square)](https://coveralls.io/github/Scandltd/vue-injector)
[![Size](https://img.shields.io/bundlephobia/minzip/@scandltd/vue-injector.svg?style=flat-square)](https://www.npmjs.com/package/@scandltd/vue-injector)
[![Downloads](https://img.shields.io/npm/dt/@scandltd/vue-injector.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/@scandltd/vue-injector)
[![Version](https://img.shields.io/npm/v/@scandltd/vue-injector.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/@scandltd/vue-injector)
[![License](https://img.shields.io/npm/l/@scandltd/vue-injector.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/@scandltd/vue-injector)

> This is vue-injector which works only with Vue 2.0

### Introduction

Vue Injector — Dependency Injection library for [Vue.js](https://ru.vuejs.org/). Includes the following:

- Dependency injection for components
- Construction of the injected services
- Accessibility of Vue application from a service
- Utilization of decorators for convenient operation

Get started with the [documentation](https://vue-injector.netlify.com/guide/), or play with the [examples](https://github.com/Scandltd/vue-injector/tree/master/examples) (see how to run them below).

### Install

```bash 
$ npm install @scandltd/vue-injector core-js
```

> :warning:
[ECMAScript stage 1 decorators](https://github.com/wycats/javascript-decorators/blob/master/README.md).
If you use Babel, [@babel/plugin-proposal-decorators](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-decorators) is needed.
If you use TypeScript, enable `--experimentalDecorators` and `--emitDecoratorMetadata` flags.

Vue-injector requires a modern JavaScript engine with support for:

- [Reflect](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
- [Reflect Metadata](https://rbuckton.github.io/reflect-metadata/)
- [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

If your environment doesn't support one of these you will need to import a shim or [polyfill](https://github.com/zloirock/core-js/).

```js
// polifill.js

import 'core-js/features/reflect';
import 'core-js/features/promise';
import 'core-js/features/map';
```

> :warning: **The `reflect` polyfill should be imported only once in your entire application** because the Reflect object is meant to be a global singleton.

### Example

This is a small example of using the `vue-injector` to create an `http` service using Observables:

```js
// component/todoList.js

/** ... */

/** 
 *  Class-style Vue components:
 *  
 *  @Component
 *  class TodoListComponent extends Vue {
 *    @Inject(Http) httpClient;
 *  }
 *  
 *  
 *  Typescript:
 *  
 *  @Component
 *  class TodoListComponent extends Vue {
 *    @Inject httpClient: Http;
 *  }
 *  
 */

import Http from '../services/http';

export default {
  name: 'TodoList',
  providers: {
    httpClient: Http
  },
  created() {
    this.httpClient
      .get(URL)
      /** any pipes */
      .subscribe(
        this.taskHandler
      )
  },
  methods: {
    taskHandler(tasks) {
      /** ... */
    }
  }
}

/** ... */

```

```js
// services/setup.js

import Vue from 'vue';
import { VueInjector } from '@scandltd/vue-injector';

Vue.use(VueInjector);

export default new VueInjector();

```

```js
// main.js

import injector from './services/setup';

/** ... */

const root = new Vue({
  /** ... */
  injector
});

```

```js
// services/client.js

import axios from 'axios';
import { Injectable } from '@scandltd/vue-injector';

@Injectable({
  useFactory: () => axios.create(/** ... */)
})
class Client {}

export default Client;

```

```js
// services/http.js

import { Injectable, Inject } from '@scandltd/vue-injector';
import * as Observable from 'rxjs/internal/observable/fromPromise';
import { map } from 'rxjs/operators';

import Client from './Client';

@Injectable
class Http {
  @Inject(Client) client;

  observableFactory(promise) {
    return Observable
      .fromPromise(promise)
      .pipe(
        map(({ data }) => data)
      );
  }
  
  /** ... */

  get(url, params) {
    return this.observableFactory(
      this.client.get(url, { params })
    );
  }
}

export default Http

```


### Development Setup

``` bash
# install deps
yarn install

# build dist files
yarn build

# serve examples at localhost:8080
yarn dev

# lint & run all tests
yarn test

# serve docs at localhost:8080
yarn docs
```

## License

[GPL-2.0](https://opensource.org/licenses/GPL-2.0)

Copyright (c) 2018-present Scandltd


