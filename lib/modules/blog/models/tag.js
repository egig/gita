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

var TagModel = function (_Model) {
  _inherits(TagModel, _Model);

  function TagModel() {
    _classCallCheck(this, TagModel);

    return _possibleConstructorReturn(this, (TagModel.__proto__ || Object.getPrototypeOf(TagModel)).apply(this, arguments));
  }

  _createClass(TagModel, [{
    key: 'insertIfNotExists',
    value: function insertIfNotExists(tagLabels) {
      var _this3 = this;

      var _this = this;
      var tagPromises = [];

      var _loop = function _loop(i) {

        tagPromises.push(_this3.knex('tags').first().where('label', tagLabels[i]).then(function (tag) {
          if (tag) {
            return tag.id; // return id
          }

          return _this.knex('tags').insert({
            label: tagLabels[i]
          }).then(function (a) {
            return a[0]; // return inserted id
          });
        }));
      };

      for (var i = 0; i < tagLabels.length; i++) {
        _loop(i);
      }
      return this.knex.Promise.all(tagPromises);
    }
  }, {
    key: 'getOneByLabel',
    value: function getOneByLabel(label) {
      return this.knex('tags').first().where('label', label);
    }
  }, {
    key: 'getOneById',
    value: function getOneById(id) {
      return this.knex('tags').first().where('id', id);
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      return this.knex('tags').select('*');
    }
  }, {
    key: 'insert',
    value: function insert(t) {
      return this.knex('tags').insert(t);
    }
  }, {
    key: 'update',
    value: function update(id, t) {
      return this.knex('tags').where('id', id).update(t);
    }
  }, {
    key: 'delete',
    value: function _delete(ids) {
      return this.knex('tags').whereIn('id', ids).delete();
    }
  }]);

  return TagModel;
}(_model2.default);

exports.default = TagModel;
module.exports = exports['default'];