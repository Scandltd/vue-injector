# Service Registration

## Default Service Construction

For the construction of the service decorator `@Injectable` and basic class `Inject`

``` js
import { Injectable, Inject } from '@scandltd/vue-injector'

@Injectable
class LogService extends Inject {}
```

## Context Injection

Context that will be available in the `context` properties can be imported to the decorator `@Injectable`.

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

## Dependency Injection

Dependencies could be injected not only into components, but into a service as well. To do so, you have to import dependencies by choosing `import` in the properties of the decorator `@Injectable`.

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

## Factory Provider

Sometimes you need to inject dependencies from a third-party library that is not designed to work with DI. In cases like this you can use a factory provider. This can be done by passing the factory into the `useFactory` property of the` @ Injectable` decorator.

``` js
class Logger { ... }

@Injectable({
    useFactory: () => new Logger()
})
class UserService extends Inject {}
```
The `useFactory` property must be a function with a return value. Also, an instance of the root application `Vue` and an object containing embedded dependencies are passed to this function.

``` js

useFactory: (vm: Vue, imports: { [string]: Inject }) => {
    return new Logger(vm, imports)
}
```

Also, factory can be used to deny access to the application from the service:

``` js
@Injectable({
    useFactory: () => new UserService()
})
class UserService extends Inject {}
```

In this example, the `UserService` service instance does not have access to` Vue` and provided services.
