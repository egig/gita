'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _model = require('../../../model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PageModel = function (_Model) {
  _inherits(PageModel, _Model);

  function PageModel() {
    _classCallCheck(this, PageModel);

    return _possibleConstructorReturn(this, (PageModel.__proto__ || Object.getPrototypeOf(PageModel)).apply(this, arguments));
  }

  _createClass(PageModel, [{
    key: 'getOneById',
    value: function getOneById(id) {
      return this.knex('pages').first().where('id', id);
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      return this.knex('pages').select('*');
    }
  }, {
    key: 'insert',
    value: function insert(p) {
      return this.knex('pages').insert(p);
    }
  }, {
    key: 'update',
    value: function update(id, p) {
      return this.knex('pages').where('id', id).update(p);
    }
  }, {
    key: 'delete',
    value: function _delete(ids) {
      return this.knex('pages').whereIn('id', ids).delete();
    }
  }]);

  return PageModel;
}(_model2.default);

exports.default = PageModel;
module.exports = exports['default'];