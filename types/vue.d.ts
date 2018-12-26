/**
 * Augment the typings of Vue.js
 */

import Vue from "vue";
import VueInjector from "../src/index";
import {Inject} from "../src";

declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}

declare module "vue/types/vue" {
    interface Vue {
        readonly $injector: VueInjector;
        readonly providers: {[key: string]: Inject}
    }
}

declare module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {
        readonly providers?: {[key: string]: Inject}
    }
}

declare global {
    interface Window {
        Vue: typeof Vue
    }
}

