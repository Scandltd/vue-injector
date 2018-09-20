# Получение сервиса

::: tip Примечание
В примерах ниже будем использовать сервис для логирования:

``` js
import { Injectable, Inject } from '@scandltd/vue-injector'

@Injectable
class LogService extends Inject {}
```
:::

## Указание зависимостей компонента

Для внедрения зависимости в компонент можно использовать два метода:

- Указать необходимые сервисы в свойстве компонента `providers`.
- Использовать декоратор `@Service`.

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

## Использование без внедрения зависимости

Иногда при работе с сервисами требуется получить экземпляр сервиса без внедрения его в компонент.

Для этого мы можем использовать метод `get` экземпляра инжектора:

``` js
export default {
  computed: {
    logger () {
      return this.$injector.get(LogService);
    }
  }
})
```
