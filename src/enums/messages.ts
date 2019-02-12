export enum ERROR_MESSAGE {
  ERROR_000 = '[@scandltd/vue-injector]:',
  ERROR_001 = '@injectable can take only one parameter either FACTORY or VALUE',
  ERROR_002 = 'function "message". Parameters in a string do not match those in array: ',
  ERROR_003 = 'not installed. Make sure to call `Vue.use(VueInjector)` before creating root instance.',
  ERROR_004 = 'providers are not objects',
  ERROR_005 = 'no decorator Injectable',
  ERROR_006 = 'FACTORY invalid return',
  ERROR_007 = 'invalid VALUE',
  ERROR_008 = '{name} invalid type: must be \'function\''
}

export enum WARNING_MESSAGE {
  WARNING_000 = 'Wrong service registration. Service name: {name}.\n' +
    '@injectable can take only one parameter either FACTORY or VALUE, but got {options}'
}

export function message (str: string, arg: Object = {}): string {
  let spareParameters = Reflect.ownKeys(arg).filter((val) => {
    return null === str.match(new RegExp(`{${String(val)}}`));
  });

  if (spareParameters.length) {
    console.warn(ERROR_MESSAGE.ERROR_002 + spareParameters);
  }

  Object.keys(arg).forEach((key) => {
    let regex = new RegExp(`{${key}}`);
    str = str.replace(regex, arg[key]);
  });

  return str;
}
