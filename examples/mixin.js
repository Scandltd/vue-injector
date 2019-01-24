import JSONFormatter from 'json-formatter-js'

export default {
  methods: {
    code (obj, target) {
      const formatter = new JSONFormatter(Object.assign(obj, obj.constructor, Object.getPrototypeOf(obj)))
      target.appendChild(formatter.render())
    }
  }
}
