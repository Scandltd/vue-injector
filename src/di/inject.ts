import Vue from 'vue';

export interface InjectConstructor {
  new (root: Vue): Inject;
}

export interface Inject {
  readonly isVueService: boolean;
  readonly name: string;

  readonly context: Object;
  readonly vm: Vue;

  import: { [key: string]: any };
}
