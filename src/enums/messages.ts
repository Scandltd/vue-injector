export enum ERROR_MESSAGE {
  ERROR_000 = '[@scandltd/vue-injector]:',
  ERROR_001 = '@injectable can take only one parameter either {names}',
  ERROR_002 = 'function "message". Parameters in a string do not match those in array: ',
  ERROR_003 = 'not installed. Make sure to call `Vue.use(VueInjector)` before creating root instance.',
  ERROR_004 = 'providers are not objects',
  ERROR_005 = 'no decorator Injectable',
  ERROR_006 = 'useFactory invalid return',
  ERROR_007 = 'invalid useValue',
  ERROR_008 = '{name} invalid type useFactory: must be \'function\'',
  ERROR_009 = '{method} is not a function'
}

export enum WARNING_MESSAGE {
  WARNING_000 = 'Wrong service registration. Service name: {name}.\n'
    + '@injectable can take only one parameter either useFactory or useValue, but got {options}'
}

export function message(str: string, arg: Object = {}): string {
  let newStr = str;
  const spareParameters = Reflect.ownKeys(arg).filter((val) => str.match(new RegExp(`{${String(val)}}`)) === null);

  if (spareParameters.length) {
    console.warn(ERROR_MESSAGE.ERROR_002 + spareParameters);
  }

  Object.keys(arg).forEach((key) => {
    const regex = new RegExp(`{${key}}`);
    newStr = str.replace(regex, arg[key]);
  });

  return newStr;
}
