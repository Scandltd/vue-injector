# Inject Vue instance

Внедрение `Vue` в сервис:

```js
import app from './setup'

@Injectable
class UserService {
    @Inject(app) vm;
    
    constructor () {
        console.log(this.vm)
    }
}
```
