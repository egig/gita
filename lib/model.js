"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = function Model(options) {
  _classCallCheck(this, Model);

  this.knex = options.knex;
};

exports.default = Model;
module.exports = exports["default"];