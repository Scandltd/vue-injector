export enum ERROR_MESSAGE {
  ERROR_TYPE = '[@scandltd/vue-injector]:',
  ERROR_INJECTABLE_OPTIONS_CONFLICT = '@injectable can take only one parameter either {names}',
  ERROR_BUILD_MESSAGE = 'function "message". Parameters in a string do not match those in array: ',
  ERROR_INIT_PLUGIN = 'not installed. Make sure to call `Vue.use(VueInjector)` before creating root instance.',
  ERROR_PROVIDERS_TYPE = 'providers are not objects',
  ERROR_USE_DECORATOR = 'no decorator Injectable',
  ERROR_USE_FACTORY_RETURN = 'useFactory invalid return',
  ERROR_USE_VALUE_RETURN = 'invalid useValue',
  ERROR_USE_FACTORY_TYPE = '{name} invalid type useFactory: must be \'function\'',
  ERROR_EMTY_INJECT_PARAMS = '@inject must get a service as parameter'
}

export enum WARNING_MESSAGE {
  WARNING_000 = 'Wrong service registration. Service name: {name}.\n'
    + '@injectable can take only one parameter either useFactory or useValue, but got {options}'
}

export function message(str: string, arg: Object = {}): string {
  let newStr = str;
  const spareParameters = Reflect.ownKeys(arg).filter((val) => str.match(new RegExp(`{${String(val)}}`)) === null);

  if (spareParameters.length) {
    // eslint-disable-next-line no-console
    console.warn(ERROR_MESSAGE.ERROR_BUILD_MESSAGE + spareParameters);
  }

  Object.keys(arg).forEach((key) => {
    const regex = new RegExp(`{${key}}`);
    newStr = str.replace(regex, arg[key]);
  });

  return newStr;
}
