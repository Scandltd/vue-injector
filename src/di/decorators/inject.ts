import { createDecorator } from '../../util/decorator';

export function Inject(service): PropertyDecorator {
  return createDecorator((target, keyProp) => {
    (target.providers || (target.providers = {}))[keyProp] = service;
  });
}
