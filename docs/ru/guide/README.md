# Начало работы

::: warning Зависимости
[ECMAScript stage 2 decorators](https://github.com/tc39/proposal-decorators).
Если вы используете Babel, необходим [@babel/plugin-proposal-decorators](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-decorators).
Если вы используете TypeScript, включите флаги `--experimentalDecorators` и `--emitDecoratorMetadata`.
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

Кроме того, все примеры будут использовать полную сборку Vue, чтобы позволить компиляцию шаблонов на лету. Подробнее о различиях сборок читайте [здесь](https://ru.vuejs.org/v2/guide/installation.html#Runtime-Компилятор-vs-Runtime-only).
:::

Использовать DI при помощи Vue Injector очень просто. Пример:

## HTML

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/@scandltd/vue-injector/dist/vue-injector.js"></script>

<div id="app">
  <h1>Первое приложение!</h1>
  <p>
    <!-- отображаем тут зарегистрированный компонент-->
    <logger/>
  </p>
</div>
```

## JavaScript

``` js
// Если используем модульную систему (например через vue-cli), 
// импортируем Vue и VueInjector и затем вызываем `app.use(VueInjector)`.

import { createApp } from 'vue';
import { VueInjector } from '@scandltd/vue-injector';

const app = createApp(root);

app.use(plugin);

app.mount('#app')
// Всё, приложение работает! ;)
```

Теперь мы можем создавать сервисы и внедрять их в компоненты нашего приложения.

``` js
import { Injectable, Inject } from '@scandltd/vue-injector'

// Регистрируем новый сервис
@Injectable
class LogService extends Inject {}
```

``` html
<template>
    // Выведим имя нашего сервиса
    {{ LogService.name }}
</template>
```

``` js
import LogService from 'logger'

// Внедряем зависимость в компонент.
Vue.component('logger', {
  name: 'logger',
  providers: {
    LogService
  }
})
```

Внедряя инжектор, мы сможем получить к нему доступ через `this.$injector`, а также к внедренным сервисам `this.<ServiceName>` внутри любого компонента:

```js
// Home.vue
export default {
  computed: {
    logger () {
      // Мы скоро разберём, что такое `get`
      return this.$injector.get(LogService)
    }
  }
}
```

В документации мы будем часто использовать экземпляр `injector`. Имейте ввиду, что `this.$injector` в точности то же самое, что и `injector`.