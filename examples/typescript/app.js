import Vue from 'vue';
import VueInjector from '@scandltd/vue-injector';
import AnyComponent from './AnyComponent.vue';
// 1. Use plugin.
// This injects $injector to all injector-enabled child components
Vue.use(VueInjector);
// 2. Create the provider
var injector = new VueInjector();
// 3. Create and mount root instance.
// Make sure to inject the services.
new Vue({
    injector: injector,
    components: {
        AnyComponent: AnyComponent
    },
    template: "\n    <div id=\"app\">\n      <any-component/>\n    </div>\n  "
}).$mount('#app');
//# sourceMappingURL=app.js.map