export const METADATA = {
  TYPE: Symbol('inject:type'),
  VALUE: Symbol('inject:value'),
  NAME: Symbol('inject:name'),
  SERVICE: Symbol('inject:service'),
  TS_TYPE: 'design:type'
};

export enum FACTORY_TYPES {
    useFactory = 'useFactory',
    useValue = 'useValue'
}
