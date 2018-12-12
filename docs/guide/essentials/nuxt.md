# Nuxt plugin

## Plugin creation

To be connected to `vue-injector`, a file with a plugin is to be added to the `plugins` folder.

``` js
``` js
// injector.js
import Vue from 'vue'
import VueInjector from '@scandltd/vue-injector'

Vue.use(VueInjector)
```

## Connection with plugin

Now we have to add the created plugin to the `nuxt` configuration file.

``` js
// nuxt.config.js
...
plugins: [
    ...
    '~/plugins/injector.js'
]
...
```
