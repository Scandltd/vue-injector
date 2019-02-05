---
sidebar: auto
---

# API

## `@Injectable`

`@Injectable` — is a decorator used for a service declaration. By default, the created service includes `Vue` application that can be found in `vm` properties. It is also possible to inject the updated service to an on-going one and add a context needed.

`@Injectable` must be specified for a service you create.

### useFactory

- type: `function`
- unnecessary
  
  Signature:
  
  ``` js
  useFactory(() => any)
  ```
  
  Using a factory to build a service.

  ``` js
  class Logger { ... }
  
  @Injectable({
      useFactory: () => new Logger()
  })
  class UserService {}
  ```
  
  Restricting access to the application from the service.
  
    ``` js
    @Injectable({
        useFactory: () => new UserService()
    })
    class UserService {}
    ```
### useValue

- type: `any`
- unnecessary
  
  Signature:

  
  Using a value to build a service.

  ``` js
  @Injectable({
      useValue: 'someValue'
  })
  class UserService {}
  ```

## `InjectableConstructor`
 
### name

- type: `string`

  Name of an on-going service.

### isVueService

- type: `boolean`

- by default: `true`

  Shows if an object is a service.

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
get(service: InjectableConstructor)
```

Rolls back an instance of the requested service. If there is no instance yet, creates it and injects into the root instance of Vue.

## `Provider`

**Object (Provider)** registers services and provides access to them.

Object `Provider` is immutable. Each registration of a component will include the creation of the services needed.

### app

  - type: `Vue instance`

    Root instance of Vue, in which `injector` is incorporated.

### services

  - type: `Map<typeof InjectableConstructor, any>`

    Object that includes key/value pairs of the connected services. If there are no specifications, an empty object will be a value.


### initComponent

Signature:

``` js
initComponent(component: Component)
```

Injection of the specified in the `providers` properties services into the component. 

### registerService

Signature:

``` js
registerService(target: InjectedObject, name: string, Service: InjectableConstructor)
```

Injection of the service into the specified object. Returns an instance of the service.

### get

Signature:

``` js
get(service: Inject)
```

Rolls back an instance of the requested service. If there is no instance yet, creates it and injects into the root instance of Vue.

## Integration for components

There are two methods you can use to inject dependencies:
 - using `providers` component properties
 - using decorator `@Inject`

 ``` js
    import { Injectable, Service } from 'vue-injector'

    @Injectable
    class LogService {}

    // Using property `providers`
    default {
        providers: {
            LogService
        }
    }

    // Using decorator
    @Component
    class Component extends Vue {
        @Inject(LogService) service;
    }
 ```

## Injection of properties for components

Such properties are injecting in each child component, sending an instance of DI to a root instance as an `injector` option.

- **this.$injector**

  Instance of injector.

- **this.< ServiceName >**

  Provided services. These properties are read-only.
