# Регистрация сервиса

## Создание сервиса по умолчанию

Для создания сервиса используется декоратор `@Injectable`

``` js
import { Injectable } from '@scandltd/vue-injector'

@Injectable
class LogService {}
```


## Внедрение зависимостей

В сервис, так же как и в компонент, возможно внедрить зависимости. Сделать это можно, передав зависимости в декоратор `Inject`.

``` js
@Injectable
class UserService extends Inject {
    @Inject(LogService) LogService;

    constructor () {
        this.LogService.log('Create User service');
    }
}
```

## Использование фабрики

Иногда вам нужно реализовать зависимости от сторонней библиотеки, которая не предназначена для работы с DI. В таких случаях вы можете использовать поставщика фабрики. Это можно сделать, передав фабрику в свойстве `useFactory` декоратора` @ Injectable`.

``` js
class Logger { ... }

@Injectable({
    useFactory: () => new Logger()
})
class UserService extends Inject {}
```

Свойство `useFactory` должно быть функцией с возвращаемым значением. Также в эту функцию передаются экземпляр корневого приложения `Vue` и объект, содержащий встроенные зависимости.

``` js

useFactory: () => {
    return new Logger(vm, imports)
}
```
