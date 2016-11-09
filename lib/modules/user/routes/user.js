'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();


/* GET users listing. */
router.get('/', function (req, res) {

  var knex = req.app.get('knex');

  knex('users').select('*').then(function (users) {
    res.render('@user/index', {
      users: users
    });
  });
});

router.get('/data', function (req, res) {

  var uM = req.app.model('@user/user');

  uM.getAll().then(function (users) {

    var content = {
      recordsTotal: users.length,
      recordsFiltered: users.length,
      data: users
    };
    res.json(content);
  }).catch(function (e) {
    return console.log(e);
  });
});

router.get('/edit/:id', function (req, res) {
  var id = req.params.id;
  var knex = req.app.get('knex');

  knex('groups').select('*').then(function (groups) {

    if (req.params.id === 'new') {
      var user = {
        id: req.params.id,
        username: '',
        realname: '',
        email: '',
        bio: '',
        url: '',
        status: 0,
        groupIds: []
      };

      var viewData = { user: user, groups: groups };

      res.render('@user/edit', viewData);
    } else {

      knex('users').first('*').where('id', id).then(function (user) {

        knex('users_groups').select('*').where('user_id', user.id).then(function (users_groups) {

          var ugids = [];
          for (var i = 0; i < users_groups.length; i++) {
            ugids.push(users_groups[i].group_id);
          }

          knex('groups').select('*').whereIn('id', ugids).then(function (ug) {

            user.groups = ug;
            user.groupIds = [];

            for (var i = 0; i < user.groups.length; i++) {
              user.groupIds.push(user.groups[i].id);
            }

            res.render('@user/edit', { user: user, groups: groups });
          });
        });
      });
    }
  });
});

router.post('/save', function (req, res) {
  var u = req.body.user;

  // validation
  req.checkBody('user[username]', 'Username should not be empty').notEmpty();
  req.checkBody('user[email]', 'Email should not be empty').notEmpty().isEmail();
  req.checkBody('user[realname]', 'Realname should not be empty').notEmpty();

  if (u.id === 'new') {
    req.checkBody('user[password]', 'Password should not be empty').notEmpty();
  }

  var errors = req.validationErrors();
  if (errors) {
    var responseBody = {
      errorType: 'validation',
      errors: errors
    };
    res.json(responseBody, 400);
    return;
  }

  // @todo validation
  var knex = req.app.get('knex');

  var postDataGroups = u.groups || [];

  if (u.id === 'new') {
    knex('users').insert({
      username: u.username,
      email: u.email,
      password: _bcryptNodejs2.default.hashSync(u.password),
      realname: u.realname,
      url: u.url,
      bio: u.bio,
      status: u.status
    }).then(function (a) {

      if (!postDataGroups.length) {
        return res.json({ id: a[0], status: 'success', message: "Users saved" });
      }

      knex('users_groups').where('user_id', a[0]).delete().then(function () {

        var quaries = [];
        for (var i = 0; i < postDataGroups.length; i++) {
          quaries.push(knex('users_groups').insert({ user_id: a[0], group_id: postDataGroups[i] }));
        }

        knex.Promise.all(quaries).then(function () {
          res.json({ id: a[0], status: 'success', message: "Users saved" });
        });
      });
    });
  } else {
    var user = {
      username: u.username,
      email: u.email,
      realname: u.realname,
      url: u.url,
      bio: u.bio,
      status: u.status
    };

    if (u.password.trim() !== '') {
      user.password = _bcryptNodejs2.default.hashSync(u.password);
    }

    // @todo clean this
    knex('users').where('id', u.id).update(user).then(function (a) {

      if (!postDataGroups.length) {
        return res.json({ id: u.id, status: 'success', message: "Users saved" });
      }

      knex('users_groups').where('user_id', u.id).delete().then(function () {

        var quaries = [];
        for (var i = 0; i < postDataGroups.length; i++) {
          quaries.push(knex('users_groups').insert({ user_id: u.id, group_id: postDataGroups[i] }));
        }

        knex.Promise.all(quaries).then(function () {
          res.json({ id: u.id, status: 'success', message: "Users saved" });
        });
      });
    });
  }
});

router.post('/delete', function (req, res) {
  var u = req.body.user;

  // @todo validation
  var knex = req.app.get('knex');
  knex('users').whereIn('id', req.body.users).del().then(function () {
    res.json({ status: 'success', message: "Users deleted" });
  });
});

router.get('/profile', function (req, res) {

  var user = req.user;
  var knex = req.app.get('knex');

  knex('groups').select('*').then(function (groups) {

    knex('users_groups').select('*').where('user_id', user.id).then(function (users_groups) {

      var ugids = [];
      for (var i = 0; i < users_groups.length; i++) {
        ugids.push(users_groups[i].group_id);
      }

      knex('groups').select('*').whereIn('id', ugids).then(function (ug) {

        user.groups = ug;
        user.groupIds = [];

        for (var i = 0; i < user.groups.length; i++) {
          user.groupIds.push(user.groups[i].id);
        }

        res.render('@user/profile', { user: user, groups: groups });
      });
    });
  });
});

module.exports = router;