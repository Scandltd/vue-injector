import { createDecorator } from '../../util/decorator';

export function Inject (service): PropertyDecorator {
  return createDecorator(function (componentOptions, k) {
    (componentOptions.providers || (componentOptions.providers = {}))[k] = service;
  });
}
