import { createDecorator } from '../../util/decorator';

export function Inject (service): PropertyDecorator {
  return createDecorator(function (target, keyProp) {
    (target.providers || (target.providers = {}))[keyProp] = service;
  });
}
