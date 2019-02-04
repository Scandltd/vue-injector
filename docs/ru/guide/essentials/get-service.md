# Получение сервиса

::: tip Примечание
В примерах ниже будем использовать сервис для логирования:

``` js
import { Injectable } from '@scandltd/vue-injector'

@Injectable
class LogService {}
```
:::

## Указание зависимостей компонента

Для внедрения зависимости в компонент можно использовать два метода:

- Указать необходимые сервисы в свойстве компонента `providers`.
- Использовать декоратор `@Inject`.

### `Providers`

``` js
export default {
  providers: {
    LogService
  }
})
```

### `@Inject`

``` js
import { Inject } from '@scandltd/vue-injector'

export default {
  @Inject(LogService) logger
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
