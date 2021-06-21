# Установка

## Скачивание напрямую / CDN

[https://unpkg.com/@scandltd/vue-injector@1.0.0/dist/vue-injector.js](https://unpkg.com/@scandltd/vue-injector@1.0.0/dist/vue-injector.js)

<!--email_off-->
[Unpkg.com](https://unpkg.com) предоставляет CDN-ссылки для NPM-пакетов. Ссылка выше всегда указывает на самую последнюю версию Vue-injector на NPM. Вы можете также использовать конкретную версию с помощью ссылок вида `https://unpkg.com/@scandltd/vue-injector@1.0.0/dist/vue-injector.js`.
<!--/email_off-->

Подключите `vue-injector` после Vue, и установка произойдёт автоматически:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-injector.js"></script>
```

## npm

``` bash
npm install @scandltd/vue-injector@next core-js
```

Vue-injector requires a modern JavaScript engine with support for:

- [Reflect](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
- [Reflect Metadata](https://rbuckton.github.io/reflect-metadata/)
- [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

If your environment doesn't support one of these you will need to import a shim or [polyfill](https://github.com/zloirock/core-js/) .

::: warning Required
**The `reflect-metadata` polyfill should be imported only once in your entire application** because the Reflect object is meant to be a global singleton.
:::

При использовании модульной системы необходимо явно обозначить использование инжектора при помощи `Vue.use()`:

``` js
import { createApp } from 'vue';
import { VueInjector } from '@scandltd/vue-injector';

const app = createApp(root);

app.use(plugin);

app.mount('#app')
```

Это не требуется при подключении через глобальный тег `script`.

## Версия для разработки

Если вы хотите использовать самую новую dev-сборку `vue-injector`, то придётся вручную склонировать репозиторий с GitHub и запустить сборку:

``` bash
git clone https://github.com/Scandltd/vue-injector.git node_modules/@scandltd/vue-injector
cd node_modules/@scandltd/vue-injector
npm install
npm run build
```
