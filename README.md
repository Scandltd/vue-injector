# vue-injector
Dependency Injection for [Vue.js](http://vuejs.org). 

[![Build Status](https://img.shields.io/circleci/project/github/Scandltd/vue-injector/master.svg?longCache=true&style=flat-square)](https://circleci.com/gh/Scandltd/vue-injector)
[![Size](https://img.shields.io/bundlephobia/min/@scandltd/vue-injector.svg)](https://www.npmjs.com/package/@scandltd/vue-injector)
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

### Example

This is a small example of using the `vue-injector` to create an `http` service using Observables:

```js
// component/todoList.js

/** ... */

/** 
 *  You also can use @Inject(Http) httpClient;
 *  It is possible for class-style Vue components.
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
npm install

# build dist files
npm run build

# serve examples at localhost:8080
npm run dev

# lint & run all tests
npm test

# serve docs at localhost:8080
npm run docs
```

## License

[GPL-2.0](https://opensource.org/licenses/GPL-2.0)

Copyright (c) 2018-present Scandltd


