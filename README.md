# vue-injector
Dependency Injection for [Vue.js](http://vuejs.org). 

[![Build Status](https://img.shields.io/circleci/project/github/Scandltd/vue-injector/master.svg?longCache=true&style=flat-square)](https://circleci.com/gh/Scandltd/vue-injector)
[![Size](https://img.shields.io/bundlephobia/min/@scandltd/vue-injector.svg)](https://www.npmjs.com/package/@scandltd/vue-injector)
[![Downloads](https://img.shields.io/npm/dt/@scandltd/vue-injector.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/@scandltd/vue-injector)
[![Version](https://img.shields.io/npm/v/@scandltd/vue-injector.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/@scandltd/vue-injector)
[![License](https://img.shields.io/npm/l/@scandltd/vue-injector.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/@scandltd/vue-injector)

> This is vue-injector which works only with Vue 2.0

### Introduction

**Required**: [ECMAScript stage 1 decorators](https://github.com/wycats/javascript-decorators/blob/master/README.md).
If you use Babel, [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) is needed.
If you use TypeScript, enable `--experimentalDecorators` flag.

##### Examples
You can look at the examples [here](https://github.com/Scandltd/vue-injector/tree/master/examples).

##### Installation

``` js
npm i @scandltd/vue-injector
```

##### Import module

``` js
import VueInjector, { Injectable, Inject } from '@scandltd/vue-injector'
```

### Example
##### Use plugin
This injects `$injector` to all injector-enabled child components:

``` js
Vue.use(VueInjector)
```

Create the provider:

``` js
const injector = new VueInjector()
```

Create and mount root instance. Make sure to inject the `injector`:

``` js
new Vue({
  injector,
  template: `<div id="app"></div>`
}).$mount('#app')
```
##### Create services
Now can to create any services using `@Injectable` decorator and `Inject` class:

``` js
@Injectable
class AnyService extends Inject {}

class Inject {
  isVueService: boolean;
  name: string;
  vm: VueRoot;
  context: Any
}
```

Use `import` property for injection other services:

``` js
@Injectable({
  import: {
    AnyService
  }
})
class OtherService extends Inject {}
```

Use `context` property for set other context:

``` js
@Injectable({
  context: {}
})
class AnyService extends Inject {}
```

##### Global providers in components
Define `VueInjector` instance with arguments. Providers fall into the instance of all component:

``` js
@Injectable
class AnyService extends Inject {}

@Injectable
class OtherService extends Inject {}

const injector = new VueInjector(AnyService, OtherService)

new Vue({
    injector
}).$mount('#app')
```

``` js
Vue.component('ServiceComponent', {
  name: 'ServiceComponent',
  template: '<h1>{{ AnyService.name }} {{ OtherService.name }}</h1>'
})
```

##### Providers in components
Define components with `providers`. Providers fall into the instance of the component:

``` js
Vue.component('ServiceComponent', {
  name: 'ServiceComponent',
  providers: {
    $AnyService: AnyService
  },
  template: '<h1>{{ $AnyService.name }}</h1>'
})
```

It is possible to add the service to the component using the `@Service` decorator:

``` js
import Component from 'vue-class-component'
import { Service } from '@scandltd/vue-injector'

@Component()
class AnyComponent extends Vue {
  @Service(AnyService) service;
}
```

Define components with `$injector`:

``` js
this.$injector.get(ServiceClass)
```

### Nuxt plugin
#### Create plugin
Add a plug-in file to the plugins folder:
``` js
// injector.js
import Vue from 'vue'
import VueInjector from 'vue-injector'

Vue.use(VueInjector)
```
#### Use plugin
Now let's add the created plugin to the nuxt configuration file:
``` js
// nuxt.config.js
...
plugins: [
    ...
    '~/plugins/injector.js'
]
...
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


