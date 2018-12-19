# Service use

::: tip Note
Examples below are based on using a logging service:

``` js
import { Injectable, Inject } from '@scandltd/vue-injector'

@Injectable
class LogService extends Inject {}
```
:::

## Specifying dependencies for components

There are two methods you can use to inject dependency into a component:

- By specifying required services in the `providers` component property.
- By using decorator `@Service`.

### `Providers`

``` js
export default {
  providers: {
    LogService
  }
})
```

### `@Service`

``` js
import { Service } from '@scandltd/vue-injector'

export default {
  @Service(LogService) logger
})
```

## Usage without dependency injection

While working with services, sometimes you need to get an instance of a service without injecting it into a component.

In such cases, we can use `get` method for the instance of the injector:

``` js
export default {
  computed: {
    logger () {
      return this.$injector.get(LogService);
    }
  }
})
```
