/* eslint-disable import/no-extraneous-dependencies */
import JSONFormatter from 'json-formatter-js';

export default {
  methods: {
    demo(obj) {
      const formatter = new JSONFormatter(obj);
      this.$el.appendChild(formatter.render());

      console.log(obj);
    }
  }
};
