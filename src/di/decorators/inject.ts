import { createDecorator } from '../../util/decorator';

export function Inject (service): PropertyDecorator {
  return createDecorator(function (componentOptions, k, descriptor?) {
    if (descriptor) {
      /* TODO: remove this code */
      (descriptor as any).initializer = function () {
        return this.__proto__[k];
      };
    }

    (componentOptions.providers || (componentOptions.providers = {}))[k] = service;
  });
}
