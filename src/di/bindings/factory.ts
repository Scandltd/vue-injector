import { Provider } from './provider';
import { assert } from '../../util/warn';
import { ERROR_MESSAGE } from '../../enums/messages';

export class Factory implements Provider {
  getService (service: Function) {
    const result = service();

    if (result) {
      return result;
    } else {
      throw assert(false, ERROR_MESSAGE.ERROR_006);
    }
  }
}
