---
sidebar: auto
---

# Справочник API

## `@Injectable`

`@Injectable` — это декоратор предназначенный для объявления сервиса. По умолчанию в созданном сервисе в свойстве `vm` доступно приложение `Vue`. Кроме того, существует возможность внедрить дополненные сервисы в текущий и добавить собственный контекст.

`@Injectable` должен быть обязательно указан для создаваемого сервиса.

### import

- тип: `Array<Service>`
- не обязательный

  Иногда может потребоваться, чтобы создаваемый сервис также имел встраиваемые зависимости внутри себя, в этом случае вы можете указать зависимости с помощью свойства декоратора `import`.

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

### context

- тип: `any`
- не обязательный

  Установка дополнительного контекста для сервиса. Доступен через свойство `context`.

  ``` js
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

## `Inject`
  При создании сервиса необходимо расширить класс `Inject`. Определяет общие свойства всех сервисов.

  ``` js
    @Injectable
    class UserService extends Inject {}
  ```
### name

- тип: `string`

  Имя текущего сервиса.

### isVueService

- тип: `boolean`

- по умолчанию: `true`

  Показывает является ли объект сервисом.

### vm

- тип: `Vue instance`

  Корневой экземпляр Vue, в который внедряется `injector`.


## `VueInjector`

### app

- тип: `Vue instance`

  Корневой экземпляр Vue, в который внедряется `injector`.

### provider

- тип: `Provider`

  Провайдер предоставляющий доступ к сервисам в виде [объекта Provider](#provider-2).

### initComponent

Сигнатура:

``` js
initComponent(component: Component)
```

Внедрение в компонент указанных в свойстве `providers` сервисов.

### get

Сигнатура:

``` js
get(service: Inject)
```

Возвращает экземпляр запрашиваемого сервиса. Создает экземпляр, если его еще не существует, и внедряет его в корневой экземпляр Vue.

## `Provider`

**Объект (Provider)** регистрирует сервисы и предоставляет к ним доступ.

Объект `Provider` иммутабелен. Каждая регистрация компонента будет создавать необходимые ему сервисы.

### app

  - тип: `Vue instance`

    Корневой экземпляр Vue, в который внедряется `injector`.

### services

  - тип: `Map<typeof Inject, Inject>`

    Объект, который содержит пары ключ/значение подключенных сервисов. Если параметров нет, то значением будет пустой объект.


### initComponent

Сигнатура:

``` js
initComponent(component: Component)
```

Внедрение в компонент указанных в свойстве `providers` сервисов.

### registerService

Сигнатура:

``` js
registerService(target: InjectedObject, name: string, Service: typeof InjectableClass)
```

Внедрение в сервиса в указаный объект. Возврощает экземпляр сервиса.

### get

Сигнатура:

``` js
get(service: Inject)
```

Возвращает экземпляр запрашиваемого сервиса. Создает экземпляр, если его еще не существует, и внедряет его в корневой экземпляр Vue.

## Интеграция в компоненты

Для внедрении зависимости можно использовать два метода:
 - используя свойство компронента `providers`
 - используя декаратор `@Service`

 ``` js
    import { Injectable, Inject, Service } from '@scandltd/vue-injector'

    @Injectable
    class LogService extends Inject {}

    // Используя свойство `providers`
    default {
        providers: {
            LogService
        }
    }

    // Используя декаратор
    @Component
    class Component extends Vue {
        @Service(LogService) service;
    }
 ```

## Внедряемые в компоненты свойства

Эти свойства внедряются в каждый дочерний компонент, передавая экземпляр DI в корневой экземпляр в качестве опции `injector`.

- **this.$injector**

  Экземпляр инжектора.

- **this.< ServiceName >**

  Предоставляемые сервисы. Эти свойства только для чтения.



