/* eslint-disable import/no-extraneous-dependencies */
import JSONFormatter from 'json-formatter-js';

export default {
  methods: {
    demo(obj) {
      const props = Object.getOwnPropertyNames(Object.getPrototypeOf(obj || {})).filter((prop) => prop !== 'constructor');

      if (typeof obj === 'object' && obj) {
        props.forEach((prop) => Object.defineProperty(obj, prop, {
          value: obj[prop],
          enumerable: true
        }));
      }

      const formatter = new JSONFormatter(obj);
      this.$el.appendChild(formatter.render());

      // eslint-disable-next-line no-console
      console.log(obj);
    }
  }
};
