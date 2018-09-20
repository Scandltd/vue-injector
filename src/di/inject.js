/* @flow */

export class Inject {
  -isVueService: boolean;
  +name: string;
  +vm: GlobalAPI | Object;

  +import: { [key: string]: typeof InjectableClass };

  static getName: () => string
}
