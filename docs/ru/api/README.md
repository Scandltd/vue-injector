---
sidebar: auto
---

# Справочник API

## `@Injectable`

`@Injectable` — это декоратор, предназначенный для объявления сервиса. По умолчанию в созданном сервисе в свойстве `vm` доступно приложение `Vue`. Кроме того, существует возможность внедрить дополненные сервисы в текущий и добавить собственный контекст.

`@Injectable` должен быть обязательно указан для создаваемого сервиса.
    
### useFactory

- тип: `function`
- не обязательный
  
  Сигнатура:
  
  ``` js
  useFactory() => any
  ```
  
  Использование фабрики для построения сервиса.

  ``` js
  class Logger { ... }
  
  @Injectable({
      useFactory: () => new Logger()
  })
  class UserService extends Inject {}
  ```

## `InjectableConstructor`

### name

- тип: `string`

  Имя текущего сервиса.

### isVueService

- тип: `boolean`

- по умолчанию: `true`

  Показывает, является ли объект сервисом.

## `VueInjector`

### app

- тип: `Vue instance`

  Корневой экземпляр Vue, в который внедряется `injector`.

### provider

- тип: `Provider`

  Провайдер, предоставляющий доступ к сервисам в виде [объекта Provider](#provider-2).

### initComponent

Сигнатура:

``` js
initComponent(component: Component)
```

Внедрение в компонент указанных в свойстве `providers` сервисов.

### get

Сигнатура:

``` js
get(service: InjectableConstructor)
```

Возвращает экземпляр запрашиваемого сервиса. Создает экземпляр, если его еще не существует, и внедряет его в корневой экземпляр Vue.

## `Provider`

**Объект (Provider)** регистрирует сервисы и предоставляет к ним доступ.

Объект `Provider` иммутабелен. Каждая регистрация компонента будет создавать необходимые ему сервисы.

### app

  - тип: `Vue instance`

    Корневой экземпляр Vue, в который внедряется `injector`.

### services

  - тип: `Map<typeof InjectableConstructor, any>`

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
registerService(target: InjectedObject, name: string, Service: InjectableConstructor)
```

Внедрение сервиса в указаный объект. Возвращает экземпляр сервиса.

### get

Сигнатура:

``` js
get(service: InjectableConstructor)
```

Возвращает экземпляр запрашиваемого сервиса. Создает экземпляр, если его еще не существует, и внедряет его в корневой экземпляр Vue.

## Интеграция в компоненты

Для внедрении зависимости можно использовать два метода:
 - используя свойство компонента `providers`
 - используя декоратор `@Service`

 ``` js
    import { Injectable, Inject } from '@scandltd/vue-injector'

    @Injectable
    class LogService {}

    // Используя свойство `providers`
    default {
        providers: {
            LogService
        }
    }

    // Используя декоратор
    @Component
    class Component extends Vue {
        @Inject(LogService) service;
    }
 ```

## Внедряемые в компоненты свойства

Эти свойства внедряются в каждый дочерний компонент, передавая экземпляр DI в корневой экземпляр в качестве опции `injector`.

- **this.$injector**

  Экземпляр инжектора.

- **this.< ServiceName >**

  Предоставляемые сервисы. Эти свойства только для чтения.



