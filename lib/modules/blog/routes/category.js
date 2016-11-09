'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {

  res.render('@blog/category/index');
});

router.get('/data', function (req, res) {
  var knex = req.app.get('knex');

  knex('categories').select('*').then(function (categories) {

    var content = {
      recordsTotal: categories.length,
      recordsFiltered: categories.length,
      data: categories
    };

    res.json(content);
  });
});

router.post('/data', function (req, res) {

  if (req.body.delete) {
    req.app.model('@blog/category').delete(req.body.categories).then(function () {
      res.json({
        status: 'success',
        message: 'Categories deleted.'
      });
    });
  }
});

router.get('/edit/:id', function (req, res) {

  var id = req.params.id;
  var cM = req.app.model('@blog/category');

  if ('new' == id) {

    cM.getAll().then(function (parents) {
      var viewData = {
        category: {
          id: id,
          label: '',
          slug: '',
          description: ''
        },
        parent_options: parents
      };
      res.render('@blog/category/edit', viewData);
    });
  } else {
    cM.getOneById(req.params.id).then(function (category) {

      cM.getPossibleParents(req.params.id).then(function (parents) {
        var viewData = {
          category: category,
          parent_options: parents
        };

        res.render('@blog/category/edit', viewData);
      });
    });
  }
});

router.post('/save', function (req, res) {

  // validation
  req.checkBody('category[label]', 'Label should not be empty').notEmpty();
  req.checkBody('category[slug]', 'Slug should not be empty').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    var responseBody = {
      errorType: 'validation',
      errors: errors
    };
    res.json(responseBody, 400);
    return;
  }

  var postData = req.body.category;

  var cM = req.app.model('@blog/category');

  if ('new' === postData.id) {
    var insertData = {
      label: postData.label,
      slug: postData.slug,
      description: postData.description,
      parent_id: postData.parent
    };

    cM.insert(insertData).then(function (a) {
      var response = {
        id: a[0],
        status: 'success',
        message: "Category saved"
      };

      res.json(response);
    });
  } else {
    var updateData = {
      label: postData.label,
      slug: postData.slug,
      description: postData.description,
      parent_id: postData.parent
    };

    cM.update(postData.id, updateData).then(function (a) {
      var response = {
        id: postData.id,
        status: 'success',
        message: "Category saved"
      };

      res.json(response);
    });
  }
});

module.exports = router;