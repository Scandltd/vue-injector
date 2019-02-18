import { InjectableConstructor } from '../decorators/injectable';
import { InjectedObject } from '../../../types';
import { Provider } from './provider';

interface Binding {
  bind (strategy: Provider, binging: InjectableConstructor, name: string): this;
  to (target: InjectedObject): boolean;
}

export class ServiceBinding implements Binding {
  private binging: InjectableConstructor = null;
  private name: string = null;
  private strategy: Provider = null;

  bind (strategy: Provider, binging: InjectableConstructor, name: string): this {
    this.strategy = strategy;
    this.binging = binging;
    this.name = name;

    return this;
  }

  to (target: InjectedObject): boolean {
    if (this.binging) {

      const injectService = this.strategy.getService(this.binging);

      Reflect.defineProperty(target, this.name, {
        enumerable: true,
        configurable: false,
        get: () => injectService
      });
    }

    this.binging = null;

    return true;
  }

  get (): any {
    return this.strategy.getService(this.binging);
  }
}
