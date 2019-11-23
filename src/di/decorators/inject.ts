import { createDecorator } from '../../util/decorator';
import { METADATA } from '../../enums/metadata';
import { ERROR_MESSAGE } from '../../enums/messages';
import { assert } from '../../util/warn';

function decoratorFactory(service: any): PropertyDecorator {
  return createDecorator((target: any, keyProp: string) => {
    (target.providers || (target.providers = {}))[keyProp] = service;
  });
}

export function Inject(option: any, key?: string): any | PropertyDecorator {
  if (typeof option === 'function') {
    return decoratorFactory(option);
  }

  const service = Reflect.getMetadata(METADATA.TS_TYPE, option, key);

  if (service === undefined) {
    throw assert(false, ERROR_MESSAGE.ERROR_010);
  }

  decoratorFactory(service)(option, key);
}
