'use strict';

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.seed = function (knex, Promise) {
  return knex('users').del().then(function () {
    return Promise.all([
    // Inserts seed entries
    knex('users').insert({
      id: 1, //@todo reference this in user group
      username: 'admin',
      realname: 'Admin Kece',
      bio: 'Admin Kece',
      url: 'http://drafterbit.org',
      email: 'demo@drafterbit.org',
      password: _bcryptNodejs2.default.hashSync('demo'),
      status: 1
    })]);
  });
};