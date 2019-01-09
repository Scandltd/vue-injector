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
class UserService extends Inject {
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

useFactory: (vm: Vue, imports: { [string]: Inject }) => {
    return new Logger(vm, imports)
}
```

Также использование фабрики может быть полезно для запрета доступа к приложению из сервиса:

``` js
@Injectable({
    useFactory: () => new UserService()
})
class UserService extends Inject {}
```

В этом примере инстанс севиса `UserService` не имеет доступа к `Vue` и внедренным сервисам.