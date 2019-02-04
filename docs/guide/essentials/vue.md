# Inject Vue instance

Add Vue instance to some service:

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
