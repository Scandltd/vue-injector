import JSONFormatter from 'json-formatter-js'

export default {
  methods: {
    code (obj, target) {
      const $AnyService = {}

      const propertyNames = Object.getOwnPropertyNames(obj)
        .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(Object.getPrototypeOf(obj))))
      propertyNames.forEach(prop => {
        Reflect.defineProperty($AnyService, prop, {
          enumerable: true,
          get: () => {
            return obj[prop]
          }
        })
      })
      const formatter = new JSONFormatter($AnyService)
      target.append(formatter.render())
    }
  }
}
