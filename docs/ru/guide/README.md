# Начало работы

::: warning Зависимости
[ECMAScript stage 1 decorators](https://github.com/wycats/javascript-decorators/blob/master/README.md).
Если вы используете Babel, необходим [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy).
Если вы используете TypeScript, включите флаг `--experimentalDecorators`.
:::

::: tip Примечание
Мы будем использовать синтаксис [ES2015](https://github.com/lukehoban/es6features) в примерах кода в этом руководстве.

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
// 0. Если используем модульную систему (например через vue-cli), 
// импортируем Vue и VueInjector и затем вызываем `Vue.use(VueInjector)`.

// 1. Создаём экземпляр инжектора
// new VueInjector({ store, root: [Service] })
const injector = new VueInjector()

// 2. Создаём и монтируем корневой экземпляр приложения.
// Убедитесь, что передали экземпляр плагина в опции
// `injector`, чтобы позволить приложению знать о его наличии.
const app = new Vue({
  injector
}).$mount('#app')

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