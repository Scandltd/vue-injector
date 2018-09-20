/**
 * Augment the typings of Vue.js
 */

import Vue from "vue";
import VueInjector, { Inject } from "./index";

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