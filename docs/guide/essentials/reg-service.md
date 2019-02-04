# Service Registration

## Default Service Construction

For the construction of the service decorator `@Injectable` 

``` js
import { Injectable } from '@scandltd/vue-injector'

@Injectable
class LogService {}
```

## Dependency Injection

Dependencies could be injected not only into components, but into a service as well. To do so, you have to import dependencies by decorator `Inject`.

``` js
@Injectable
class UserService {
    @Inject(LogService) LogService;
    
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
class UserService {}
```
The `useFactory` property must be a function with a return value.

``` js

useFactory: () => {
    return new Logger()
}
```
