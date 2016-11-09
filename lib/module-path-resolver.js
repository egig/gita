'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path');

var _isRelative = function _isRelative(filename) {
  return filename.indexOf('./') === 0 || filename.indexOf('../') === 0;
};

var ModulePathResolver = function () {
  function ModulePathResolver(root) {
    _classCallCheck(this, ModulePathResolver);

    this._root = root;
  }

  _createClass(ModulePathResolver, [{
    key: 'resolve',
    value: function resolve(m) {

      if (path.isAbsolute(m)) {
        return m;
      }

      if (_isRelative(m)) {
        return path.resolve(this._root, m);
      }

      // @todo ensure this return path across OS
      return require.resolve(m);
    }
  }]);

  return ModulePathResolver;
}();

module.exports = ModulePathResolver;