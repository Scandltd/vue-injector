# Регистрация сервиса

## Создание сервиса по умолчанию

Для создания сервиса используется декоратор `@Injectable` и базовый класс `Inject`

``` js
import { Injectable, Inject } from '@scandltd/vue-injector'

@Injectable
class LogService extends Inject {}
```

## Внедрение контекста

В декоратор `@Injectable` можно передать контекст, который будет доступен в свойстве `context`.

``` js
import { Injectable, Inject } from '@scandltd/vue-injector'

@Injectable({
    context: {
        hash: '7431dec680c23598e151a36266e9ad5a'
    }
})
class UserService extends Inject {
    constructor () {
        console.log(this.context.hash);
    }
}
```

## Внедрение зависимостей

В сервис, так же как и в компонент, возможно внедрить зависимости. Сделать это можно передав зависимости в свойстве `import` декоратора `@Injectable`.

``` js
@Injectable({
    import: [LogService]
})
class UserService {
    constructor () {
        this.LogService.log('Create User service');
    }
}
```