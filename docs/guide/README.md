# Getting Started

::: warning Required
[ECMAScript stage 2 decorators](https://github.com/tc39/proposal-decorators).
If you use Babel, [@babel/plugin-proposal-decorators](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-decorators) is needed.
If you use TypeScript, enable `--experimentalDecorators` and `--emitDecoratorMetadata` flags.
:::

Vue-injector requires a modern JavaScript engine with support for:

- [Reflect](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
- [Reflect Metadata](https://rbuckton.github.io/reflect-metadata/)
- [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

If your environment doesn't support one of these you will need to import a shim or [polyfill](https://github.com/zloirock/core-js/) .

::: warning Required
**The `reflect` polyfill should be imported only once in your entire application** because the Reflect object is meant to be a global singleton.
:::

Also, all examples will be using the full version of Vue to make on-the-fly template compilation possible. See more details [here](https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only).
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
// When using modular system (for ex. through vue-cli),
// import Vue and VueInjector and then call `app.use(plugin)`.

import { createApp } from 'vue';
import { VueInjector } from '@scandltd/vue-injector';

const app = createApp(root);

app.use(plugin);

app.mount('#app')

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
app.component('logger', {
  name: 'logger',
  providers: {
    LogService
  }
})
```

By incorporating the injector, we ensure its accessibility through `this.$injector`, as well as ensure accessibility of the injected services within any component through `this.<ServiceName>`:

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
