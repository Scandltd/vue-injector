# vue-injector
Dependency Injection for [Vue.js](http://vuejs.org). 

[![Build Status](https://img.shields.io/circleci/project/Scandltd/vue-injector/master.svg?longCache=true&style=flat-square)](https://circleci.com/gh/Scandltd/vue-injector)
[![Version](https://img.shields.io/npm/dt/@scandltd/vue-injector.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/@scandltd/vue-injector)
[![Version](https://img.shields.io/npm/v/@scandltd/vue-injector.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/@scandltd/vue-injector)
[![License](https://img.shields.io/npm/l/@scandltd/vue-injector.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/@scandltd/vue-injector)

> This is vue-injector which works only with Vue 2.0

### Introduction

**Required**: [ECMAScript stage 1 decorators](https://github.com/wycats/javascript-decorators/blob/master/README.md).
If you use Babel, [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) is needed.
If you use TypeScript, enable `--experimentalDecorators` flag.

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
  vm: Context;
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

Define components with `$injector`:

``` js
this.$injector.get(ServiceClass)
```

If you use the `vue-class-component`, it is possible to add the service to the component using the `@Service` decorator:

``` js
@Component()
class AnyComponent extends Vue {
  @Service(AnyService) service;
}
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


