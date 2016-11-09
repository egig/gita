'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {

  res.render('@blog/tag/index');
});

router.get('/data', function (req, res) {

  var tM = req.app.model('@blog/tag');
  tM.getAll().then(function (tags) {

    var content = {
      recordsTotal: tags.length,
      recordsFiltered: tags.length,
      data: tags
    };

    res.json(content);
  });
});

router.post('/data', function (req, res) {

  if (req.body.delete) {
    req.app.model('@blog/tag').delete(req.body.tags).then(function () {
      res.json({
        status: 'success',
        message: 'Tags deleted.'
      });
    });
  }
});

router.get('/edit/:id', function (req, res) {
  var id = req.params.id;
  if ('new' == id) {
    var viewData = {
      tag: {
        id: id,
        label: '',
        slug: '',
        description: ''
      }
    };
    res.render('@blog/tag/edit', viewData);
  } else {
    var tM = req.app.model('@blog/tag');
    tM.getOneById(req.params.id).then(function (tag) {
      var viewData = {
        tag: tag
      };

      res.render('@blog/tag/edit', viewData);
    });
  }
});

router.post('/save', function (req, res) {

  // validation
  req.checkBody('tag[label]', 'Label should not be empty').notEmpty();
  req.checkBody('tag[slug]', 'Slug should not be empty').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    var responseBody = {
      errorType: 'validation',
      errors: errors
    };
    res.json(responseBody, 400);
    return;
  }

  var postData = req.body.tag;

  var tM = req.app.model('@blog/tag');

  if ('new' === postData.id) {
    var insertData = {
      label: postData.label,
      slug: postData.slug,
      description: postData.description
    };

    tM.insert(insertData).then(function (a) {
      var response = {
        id: a[0],
        status: 'success',
        message: "Tag saved"
      };

      res.json(response);
    });
  } else {
    var updateData = {
      label: postData.label,
      slug: postData.slug,
      description: postData.description
    };

    tM.update(postData.id, updateData).then(function (a) {
      var response = {
        id: postData.id,
        status: 'success',
        message: "Tag saved"
      };

      res.json(response);
    });
  }
});

module.exports = router;