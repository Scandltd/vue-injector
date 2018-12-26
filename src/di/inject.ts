import Vue from 'vue';
import { InjectableClass } from '../../types';

export class Inject {

  static getName: () => string;
  readonly isVueService: boolean;
  readonly name: string;
  readonly vm: Vue;

  import: { [key: string]: typeof InjectableClass };
}
