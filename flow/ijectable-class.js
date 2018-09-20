import { Inject } from '../src/di/inject'

declare interface InjectableClass extends Inject {
  constructor (root: GlobalAPI): Inject;
}

declare type InjectedObject = GlobalAPI | Component | Inject
