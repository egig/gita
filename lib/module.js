'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path');

var Module = function () {
  function Module(app) {
    _classCallCheck(this, Module);
  }

  _createClass(Module, [{
    key: '_getDir',
    value: function _getDir() {
      if (typeof this.dirname === 'undefined') {
        throw "Module is not yet initialized";
      }

      return this.dirname;
    }
  }, {
    key: 'getName',
    value: function getName() {
      throw "Module do not have 'getName' method.";
    }
  }, {
    key: 'getModelPath',
    value: function getModelPath() {
      return path.join(this._getDir(), 'models');
    }
  }, {
    key: 'getViewPath',
    value: function getViewPath() {
      return path.join(this._getDir(), 'views');
    }
  }, {
    key: 'getRoutesPath',
    value: function getRoutesPath() {
      return path.join(this._getDir(), 'routes');
    }
  }, {
    key: 'getRoutes',
    value: function getRoutes() {

      try {
        return require(this.getRoutesPath());
      } catch (e) {
        // do nothing, routes is not required

      } finally {
        // do nothing, routes is not required
      }
    }
  }, {
    key: 'getPublicPath',
    value: function getPublicPath() {
      return path.join(this._getDir(), 'public');
    }
  }, {
    key: 'getMigrationPath',
    value: function getMigrationPath() {
      return path.join(this._getDir(), 'migrations');
    }
  }, {
    key: 'getSeedPath',
    value: function getSeedPath() {
      return path.join(this._getDir(), 'seeds');
    }
  }]);

  return Module;
}();

exports.default = Module;
module.exports = exports['default'];