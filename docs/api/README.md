---
sidebar: auto
---

# API

## `@Injectable`

`@Injectable` — is a decorator used for a service declaration. By default, a created service includes `Vue` application that can be found in `vm` properties. It is also possible to inject an updated services to an on-going one and add a context needed.

`@Injectable` must be specified for a service you create.

### import

- type: `Array<Service>`
- unnecessary

  Sometimes you need to include injected dependencies into a service you create. In such case, you can specify dependencies with the help of properties of the `import` decorator.

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

- type: `any`
- unnecessary

  Installation of additional context for a service is available through `context` property.

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
  When creating a service you must expand the `Inject` class that defines general properties of all services.

  ``` js
    @Injectable
    class UserService extends Inject {}
  ```
### name

- type: `string`

  Name of an on-going service.

### isVueService

- type: `boolean`

- by default: `true`

  Shows if an object is a service.

### vm

- тип: `Vue instance`

  Корневой экземпляр Vue, в который внедряется `injector`.


## `VueInjector`

### app

- type: `Vue instance`

  Root instance of Vue, in which `injector` is incorporated.

### provider

- type: `Provider`

  Provider that makes services in the form of [Provider](#provider-2) objects available.

### initComponent

Signature:

``` js
initComponent(component: Component)
```

Injection of services specified in the `providers` properties into components.  

### get

Signature:

``` js
get(service: Inject)
```

Rolls back an instance of the requested service. If there is no instance yet, creates it and injects into the root instance of Vue.

## `Provider`

**Object (Provider)** registers services and provides access to them.

Object `Provider` is immutable. Each registration of a component will include the creation of the services needed.

### app

  - type: `Vue instance`

    Root instance of Vue, in which `injector` is incorporated.

### services

  - type: `Map<typeof Inject, Inject>`

    Object that include key/value pairs of the connected services. If there are no specifications, an empty object will be a value.


### initComponent

Signature:

``` js
initComponent(component: Component)
```

Injection of the specified in a `providers` properties services into component. 

### registerService

Сигнатура:

``` js
registerService(target: InjectedObject, name: string, Service: typeof InjectableClass)
```

Внедрение в сервиса в указаный объект. Возврощает экземпляр сервиса.

### get

Signature:

``` js
get(service: Inject)
```

Rolls back an instance of the requested service. If there is no instance yet, creates it and injects into the root instance of Vue.

## Integration for components

There are two methods you can use to inject dependencies:
 - using `providers` component properties
 - using decorator `@Service`

 ``` js
    import { Injectable, Inject, Service } from 'vue-injector'

    @Injectable
    class LogService extends Inject {}

    // Using property `providers`
    default {
        providers: {
            LogService
        }
    }

    // Using decorator
    @Component
    class Component extends Vue {
        @Service(LogService) service;
    }
 ```

## Injection of properties for components

Such properties are injecting in each child component, sending an instance of DI to a root instance as a `injector` option.

- **this.$injector**

  Instance of injector.

- **this.< ServiceName >**

  Provided services. These properties are read-only.
