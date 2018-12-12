# Getting Started

::: tip Note
We will be using [ES2015](https://github.com/lukehoban/es6features) in the code samples in the guide.

Also, all examples will be using the full version of Vue to make on-the-fly template compilation possible. See more details [here](https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only).
:::

::: tip **Required**
[ECMAScript stage 1 decorators](https://github.com/wycats/javascript-decorators/blob/master/README.md).
If you use Babel, [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) is needed.
If you use TypeScript, enable `--experimentalDecorators` flag.
:::

Using DI with Vue Injector is dead simple. Here’s a basic example:

## HTML

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/@scandltd/vue-injector/dist/vue-injector.js"></script>

<div id="app">
  <h1>First Application!</h1>
  <p>
    <!-- the registered component is to be illustrated here -->
    <logger/>
  </p>
</div>
```

## JavaScript

``` js
// 0. When using modular system (for ex. through vue-cli),
//  import Vue and VueInjector, and then call `Vue.use(VueInjector)`.

// 1. Construct injector instance
const injector = new VueInjector()

// 2. Construct and mount a application’s root instance.
// Make sure you transferred the instance of the plugin using the option
// `injector`, so the application accommodates its existence.
const app = new Vue({
  injector
}).$mount('#app')

// Your application works! ;)
```

Now you can construct services and inject them into components of the application.

``` js
import { Injectable, Inject } from '@scandltd/vue-injector'

// Register a new service
@Injectable
class LogService extends Inject {}
```

``` html
<template>
    // Enter the name of the service
    {{ LogService.name }}
</template>
```

``` js
import LogService from 'logger'

// Inject dependency into the component.
Vue.component('logger', {
  name: 'logger',
  providers: {
    LogService
  }
})
```

By incorporating the injector, we ensure its accessibility through `this.$injector`, as well as ensure assessability of the injected services within any component through `this.<ServiceName>`:

```js
// Home.vue
export default {
  computed: {
    logger () {
      // Soon we'll discuss the `get` purpose
      return this.$injector.get(LogService)
    }
  }
}
```

In documentation, we’ll often refer to `injector` instance. Note that `this.$injector`is still the same `injector`.
