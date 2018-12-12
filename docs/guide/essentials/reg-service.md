# Service Registration

## Default service construction

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
