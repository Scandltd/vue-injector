import JSONFormatter from 'json-formatter-js'

export default {
  methods: {
    code (obj, target) {
      const formatter = new JSONFormatter(obj)
      target.appendChild(formatter.render())
    }
  }
}
