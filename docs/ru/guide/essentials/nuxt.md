# Nuxt plugin

## Создание плагина

Добавим в папку `plugins` файл плагина для подключения `vue-injector`.

``` js
``` js
// injector.js
import Vue from 'vue'
import { VueInjector } from '@scandltd/vue-injector'

Vue.use(VueInjector)
```

## Подключение плагина

Теперь добавим созданный плагин в конфигурационный файл `nuxt`.

``` js
// nuxt.config.js
...
plugins: [
    ...
    '~/plugins/injector.js'
]
...
```