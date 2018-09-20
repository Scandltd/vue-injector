# Установка

## Скачивание напрямую / CDN

[https://unpkg.com/@scandltd/vue-injector@1.0.0/dist/vue-injector.js](https://unpkg.com/@scandltd/vue-injector@1.0.0/dist/vue-injector.js)

<!--email_off-->
[Unpkg.com](https://unpkg.com) предоставляет CDN-ссылки для NPM-пакетов. Ссылка выше всегда указывает на самую последнюю версию Vue-router на NPM. Вы можете также использовать конкретную версию, используя ссылки вида  `https://unpkg.com/@scandltd/vue-injector@1.0.0/dist/vue-injector.js`.
<!--/email_off-->

Подключите `vue-router` после Vue, и установка произойдёт автоматически:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-injector.js"></script>
```

## npm

``` bash
npm install @scandltd/vue-injector
```

При использовании модульной системы, необходимо явно обозначить использование инжектора при помощи `Vue.use()`:

``` js
import Vue from 'vue'
import VueInjector from '@scandltd/vue-injector'

Vue.use(VueInjector)
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
