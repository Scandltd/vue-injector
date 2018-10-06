/*!
  * @scandltd/vue-injector v1.0.2
  * (c) 2018 Scandltd
  * @license GPL-2.0
  */
var _Vue = void 0;

function install(Vue) {
  if (install.installed && _Vue === Vue) { return; }
  install.installed = true;

  _Vue = Vue;

  var isDef = function isDef(v) {
    return v !== undefined;
  };

  var registerInstance = function registerInstance(vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate() {
      if (isDef(this.$options.providers)) {
        this._providers = this.$options.providers;
      }

      if (isDef(this.$options.injector)) {
        this._injectorRoot = this;
        this._injector = this.$options.injector;
        this._injector.init(this);
      } else {
        this._injectorRoot = this.$parent && this.$parent._injectorRoot || this;
        this._injectorRoot._injector.initComponent(this);
      }

      registerInstance(this, this);
    },
    destroyed: function destroyed() {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$injector', {
    get: function get() {
      return this._injectorRoot._injector;
    }
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error('[@scandltd/vue-injector] ' + message);
  }
}

var inBrowser = typeof window !== 'undefined';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Inject = function Inject() {
  classCallCheck(this, Inject);
};

var Provider = function () {
  function Provider(app) {
    classCallCheck(this, Provider);

    this.app = app;
    this.services = new Map();
  }

  createClass(Provider, [{
    key: '_injectService',
    value: function _injectService(target, imports) {
      imports.forEach(function (Inject$$1) {
        var injectServiceName = Inject$$1.name;

        if (!Object.hasOwnProperty.call(target, injectServiceName) && Inject$$1.service) {
          Reflect.defineProperty(target, injectServiceName, {
            enumerable: true,
            get: function get$$1() {
              return Inject$$1.service;
            }
          });
        }
      });
    }
  }, {
    key: '_checkObject',
    value: function _checkObject(obj) {
      return !Array.isArray(obj) && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
    }
  }, {
    key: 'registerComponent',
    value: function registerComponent(component) {
      var _this = this;

      if (component.hasOwnProperty('_providers')) {
        var providers = component._providers;

        if (providers && this._checkObject(providers)) {
          Object.keys(providers).forEach(function (name) {
            if (providers && providers.hasOwnProperty(name)) {
              _this.registerService(component, name, providers[name]);
            }
          });
        } else {
          assert(false, 'providers not object');
        }
      }
    }
  }, {
    key: 'registerService',
    value: function registerService(target, name, Service) {
      var _this2 = this;

      if (!this.services.has(Service) && Service.name === 'Injectable') {
        this.services.set(Service, new Service(this.app));
      }

      var provider = this.services.get(Service);

      if (provider && provider instanceof Inject) {
        if (provider.import) {
          if (this._checkObject(provider.import)) {
            var services = Object.keys(provider.import).map(function (name) {
              var service = _this2.registerService(provider, name, provider.import[name]);

              return {
                name: name,
                service: service
              };
            }).filter(function (inject) {
              return inject.service instanceof Inject;
            });

            this._injectService(provider, services);
          } else {
            assert(false, 'providers not object');
          }
        }

        this._injectService(target, [{
          name: name,
          service: provider
        }]);

        return provider;
      }

      assert(false, 'no decorator Injectable or extends Inject');
    }
  }, {
    key: 'get',
    value: function get$$1(Servise) {
      if (!this.services.has(Servise)) {
        var provider = this.registerService(this.app, Servise.getName(), Servise);

        if (provider && provider instanceof Inject) {
          this.services.set(Servise, provider);
        }
      }

      return this.services.get(Servise);
    }
  }]);
  return Provider;
}();

function injectableFactory(target) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return function (_target) {
    inherits(Injectable, _target);
    createClass(Injectable, null, [{
      key: 'getName',
      value: function getName() {
        return target.name;
      }
    }]);

    function Injectable(root) {
      classCallCheck(this, Injectable);

      Reflect.defineProperty(target.prototype, 'name', {
        enumerable: false,
        get: function get$$1() {
          return target.name;
        }
      });

      if (options && options.hasOwnProperty('context')) {
        Reflect.defineProperty(target.prototype, 'context', {
          enumerable: false,
          get: function get$$1() {
            return options.context;
          }
        });
      }

      if (options && options.hasOwnProperty('import')) {
        Reflect.defineProperty(target.prototype, 'import', {
          enumerable: false,
          get: function get$$1() {
            return options.import;
          }
        });
      }

      Reflect.defineProperty(target.prototype, 'vm', {
        enumerable: false,
        get: function get$$1() {
          return root;
        }
      });

      var _this = possibleConstructorReturn(this, (Injectable.__proto__ || Object.getPrototypeOf(Injectable)).call(this));

      _this.isVueService = true;
      return _this;
    }

    return Injectable;
  }(target);
}

function Injectable(options) {
  if (typeof options === 'function') {
    return injectableFactory(options);
  }
  return function (Service) {
    return injectableFactory(Service, options);
  };
}

function createDecorator(factory) {
  return function (target, key, index) {
    var Ctor = typeof target === 'function' ? target : target.constructor;
    if (!Ctor.__decorators__) {
      Ctor.__decorators__ = [];
    }
    if (typeof index !== 'number') {
      index = undefined;
    }
    Ctor.__decorators__.push(function (options) {
      return factory(options, key, index);
    });
  };
}

function Service(service) {
  return createDecorator(function (componentOptions, k, index) {
    (componentOptions.providers || (componentOptions.providers = {}))[k] = service;
  });
}

var VueInjector = function () {
  function VueInjector() {
    classCallCheck(this, VueInjector);

    this.app = null;
    this.provider = null;
    this.apps = [];
  }

  createClass(VueInjector, [{
    key: 'init',
    value: function init(app) {
      process.env.NODE_ENV !== 'production' && assert(install.installed, 'not installed. Make sure to call `Vue.use(VueInjector)` ' + 'before creating root instance.');

      this.apps.push(app);

      // main app already initialized.
      if (this.app) {
        return;
      }

      this.app = app;
      this.provider = new Provider(this.app);
    }
  }, {
    key: 'initComponent',
    value: function initComponent(component) {
      this.provider && this.provider.registerComponent(component);
    }
  }, {
    key: 'get',
    value: function get$$1(Provider$$1) {
      return this.provider && this.provider.get(Provider$$1);
    }
  }]);
  return VueInjector;
}();


VueInjector.install = install;
VueInjector.version = '1.0.2';

if (inBrowser && window.Vue) {
  window.Vue.use(VueInjector);
}

export default VueInjector;
export { Injectable, Inject, Service };
