# Inject Vue instance

Внедрение `Vue` в сервис:

```js
import Vue from 'vue'

@Injectable
class UserService {
    @Inject(Vue) vm;
    
    constructor () {
        console.log(this.vm)
    }
}
```
