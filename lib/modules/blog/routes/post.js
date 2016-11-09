'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
  res.render('@blog/post/index');
});

router.get('/data', function (req, res) {

  req.app.model('@blog/post').getAll().then(function (posts) {

    var content = {
      recordsTotal: posts.length,
      recordsFiltered: posts.length,
      data: posts
    };

    res.json(content);
  });
});

router.post('/data', function (req, res) {

  if (req.body.delete) {
    var pM = req.app.model('@blog/post');
    pM.delete(req.body.posts).then(function () {
      res.json([]);
    });
  }
});

function _getChilds(parentId, categories) {
  var childs = [];
  for (var i = 0; i < categories.length; i++) {
    if (categories[i].parent_id == parentId) {
      childs.push(categories[i]);
    }
  }

  if (childs.length > 0) {
    for (var _i = 0; _i < childs.length; _i++) {
      childs[_i].childrens = _getChilds(childs[_i].id, categories);
    }
  }

  return childs;
}

router.get('/edit/:id', function (req, res) {

  var cM = req.app.model('@blog/category');
  var tM = req.app.model('@blog/tag');

  cM.getAll().then(function (categories) {

    tM.getAll().then(function (tags) {

      var categoryTree = _getChilds(0, categories);
      var tagOptionArray = [];
      for (var i = 0; i < tags.length; i++) {
        tagOptionArray.push('"' + tags[i].label + '"');
      }

      var viewData = {
        tag_options: '[' + tagOptionArray.join(',') + ']',
        category_options: categoryTree
      };

      if (req.params.id !== 'new') {
        var pM = req.app.model('@blog/post');
        pM.getOneById(req.params.id).then(function (p) {

          var tagArray = [];
          for (var _i2 = 0; _i2 < p.tags.length; _i2++) {
            tagArray.push('"' + p.tags[_i2].label + '"');
          }
          viewData.post = p;
          viewData.tags = '[' + tagArray.join(',') + ']';

          res.render('@blog/post/edit', viewData);
        });
      } else {

        var post = {
          id: req.params.id,
          title: '',
          slug: '',
          content: '',
          published_at: (0, _moment2.default)().format('YYYY-MM-D hh:mm:ss'),
          categoryIds: []
        };

        viewData.post = post;
        viewData.tags = '[]';

        res.render('@blog/post/edit', viewData);
      }
    });
  });
});

router.post('/save', function (req, res) {

  var postData = req.body.post;
  var pM = req.app.model('@blog/post');
  var tM = req.app.model('@blog/tag');

  req.checkBody('post[title]', 'Title should not be empty').notEmpty();
  req.checkBody('post[slug]', 'Slug should not be empty').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    var responseBody = {
      errorType: 'validation',
      errors: errors
    };
    res.json(responseBody, 400);
    return;
  }

  var postDataCat = postData.categories || [];
  var postDataTags = postData.tags || [];

  if (postData.id == 'new') {

    var insertData = {
      title: postData.title,
      content: postData.content,
      slug: postData.slug,
      published_at: postData.published_at,
      created_at: (0, _moment2.default)().format('YYYY-MM-D hh:mm:ss'),
      updated_at: (0, _moment2.default)().format('YYYY-MM-D hh:mm:ss'),
      author_id: req.user.id
    };

    pM.insert(insertData).then(function (a) {
      pM.setCategories(a[0], postDataCat).then(function () {
        // handle post tags
        tM.insertIfNotExists(postDataTags).then(function (tagIds) {
          pM.setTags(a[0], tagIds).then(function () {

            var response = {
              id: a[0],
              message: "Post saved",
              status: "success"
            };

            res.json(response);
          });
        });
      });
    });
  } else {
    var updateData = {
      title: postData.title,
      content: postData.content,
      slug: postData.slug,
      published_at: postData.published_at,
      updated_at: (0, _moment2.default)().format('YYYY-MM-D hh:mm:ss')
    };

    pM.update(postData.id, updateData, function (err) {
      pM.setCategories(postData.id, postDataCat).then(function () {

        tM.insertIfNotExists(postDataTags).then(function (tagIds) {
          pM.setTags(postData.id, tagIds).then(function () {

            var response = {
              id: postData.id,
              message: "Post Updated",
              status: "success"
            };

            res.json(response);
          });
        });
      });
    });
  }
});

module.exports = router;