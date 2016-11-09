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

var CategoryModel = function (_Model) {
  _inherits(CategoryModel, _Model);

  function CategoryModel() {
    _classCallCheck(this, CategoryModel);

    return _possibleConstructorReturn(this, (CategoryModel.__proto__ || Object.getPrototypeOf(CategoryModel)).apply(this, arguments));
  }

  _createClass(CategoryModel, [{
    key: 'getOneById',
    value: function getOneById(id) {
      return this.knex('categories').first().where('id', id);
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      return this.knex('categories').select('*');
    }
  }, {
    key: 'insert',
    value: function insert(c) {
      return this.knex('categories').insert(c);
    }
  }, {
    key: 'update',
    value: function update(id, c) {
      return this.knex('categories').where('id', id).update(c);
    }
  }, {
    key: 'delete',
    value: function _delete(ids) {
      return this.knex('categories').whereIn('id', ids).delete();
    }
  }, {
    key: 'getPossibleParents',
    value: function getPossibleParents(id) {
      return this.knex('categories').whereNot({ id: id, parent_id: id }).select('*');
    }
  }]);

  return CategoryModel;
}(_model2.default);

exports.default = CategoryModel;
module.exports = exports['default'];