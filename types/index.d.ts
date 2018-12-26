import Vue, { Component } from "vue";
import {Inject} from "../src";

declare class InjectableClass extends Inject {
    constructor (context: Vue);
}

declare type InjectedObject = Vue | Component | Inject