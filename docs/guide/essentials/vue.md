# Inject Vue instance

Add Vue instance to some service:

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
