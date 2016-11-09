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

var PostModel = function (_Model) {
  _inherits(PostModel, _Model);

  function PostModel() {
    _classCallCheck(this, PostModel);

    return _possibleConstructorReturn(this, (PostModel.__proto__ || Object.getPrototypeOf(PostModel)).apply(this, arguments));
  }

  _createClass(PostModel, [{
    key: 'setCategories',
    value: function setCategories(postId, categories) {
      var _this = this;
      return this.knex('posts_categories').where('post_id', postId).delete().then(function () {
        var q = [];
        for (var i = 0; i < categories.length; i++) {
          q.push(_this.knex('posts_categories').insert({ post_id: postId, category_id: categories[i] }));
        }
        return _this.knex.Promise.all(q);
      });
    }
  }, {
    key: 'setTags',
    value: function setTags(postId, tagIds) {
      var _this = this;
      return this.knex('posts_tags').where('post_id', postId).delete().then(function () {
        var q = [];
        for (var i = 0; i < tagIds.length; i++) {
          q.push(_this.knex('posts_tags').insert({ post_id: postId, tag_id: tagIds[i] }));
        }
        return _this.knex.Promise.all(q);
      });
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      var _this = this;
      return this.knex('posts').select('*').then(function (posts) {

        if (!posts) {
          return callback(null, []);
        }

        var pmss = [];

        var _loop = function _loop(i) {

          var p = posts[i];

          pmss.push(_this.knex('users').first().where('id', p.author_id).then(function (u) {
            p.author = u;
            return p;
          }));
        };

        for (var i = 0; i < posts.length; i++) {
          _loop(i);
        }

        return _this.knex.Promise.all(pmss);
      });
    }
  }, {
    key: 'getOneById',
    value: function getOneById(id) {
      var _this = this;
      return this.knex('posts').first().where('id', id).then(function (post) {
        return _this.knex('posts_categories').where('post_id', id).select('*').then(function (pc) {

          var categoryIds = [];
          for (var i = 0; i < pc.length; i++) {
            categoryIds.push(pc[i].category_id);
          }

          post.categoryIds = categoryIds;

          return _this.knex('posts_tags').where('post_id', id).then(function (pt) {

            var tagIds = [];
            for (var _i = 0; _i < pt.length; _i++) {
              tagIds.push(pt[_i].tag_id);
            }

            return _this.knex('tags').whereIn('id', tagIds).then(function (tags) {

              post.tags = tags;
              return _this.knex.Promise.resolve(post);
            });
          });
        });
      });
    }
  }, {
    key: 'insert',
    value: function insert(p) {
      return this.knex('posts').insert(p);
    }
  }, {
    key: 'update',
    value: function update(id, p, callback) {
      var _this = this;
      this.knex('posts').where('id', id).update(p).then(function () {
        callback();
      });
    }
  }, {
    key: 'delete',
    value: function _delete(ids) {
      var _this = this;
      return this.knex('posts_tags').whereIn('post_id', ids).delete().then(function () {
        return _this.knex('posts_categories').whereIn('post_id', ids).delete().then(function () {
          return _this.knex('posts').whereIn('id', ids).delete();
        });
      });
    }
  }]);

  return PostModel;
}(_model2.default);

exports.default = PostModel;
module.exports = exports['default'];