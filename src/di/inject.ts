import Vue from 'vue';

export interface InjectConstructor {
  new (root: Vue): InjectInterface;
}

export interface InjectInterface {
  readonly isVueService: boolean;
  readonly name: string;

  readonly context: Object;
  readonly vm: Vue;

  import: { [key: string]: any };
}

export class Inject implements InjectInterface {
  readonly isVueService: boolean;
  readonly name: string;
  readonly vm: Vue;
  readonly context: Object;

  import: { [key: string]: typeof Inject };

  static getName (): string {
    return this.name;
  }
}
