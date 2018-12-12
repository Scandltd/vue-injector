# Installation

## Direct Download / CDN

[https://unpkg.com/@scandltd/vue-injector@1.0.0/dist/vue-injector.js](https://unpkg.com/@scandltd/vue-injector@1.0.0/dist/vue-injector.js)

<!--email_off-->
[Unpkg.com](https://unpkg.com) Provides npm-based CDN links. The above link will always point to the latest release on npm. You can also use a specific version/tag via URLs like:  `https://unpkg.com/@scandltd/vue-injector@1.0.0/dist/vue-injector.js`.
<!--/email_off-->

Include `vue-injector` after Vue and it will install itself automatically:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-injector.js"></script>
```

## npm

``` bash
npm install @scandltd/vue-injector
```

When used with a module system, you must explicitly install the injector via `Vue.use()`:

``` js
import Vue from 'vue'
import VueInjector from '@scandltd/vue-injector'

Vue.use(VueInjector)
```

You don't need to do this when using global `script` tags.

## Dev Build

You will have to clone directly from GitHub and build `vue-injector` yourself if you want to use the latest dev build:

``` bash
git clone https://github.com/Scandltd/vue-injector.git node_modules/@scandltd/vue-injector
cd node_modules/@scandltd/vue-injector
npm install
npm run build
```
