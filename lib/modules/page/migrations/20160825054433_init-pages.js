'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.createTable('pages', function (table) {
    table.increments();
    table.string('title');
    table.string('slug');
    table.string('layout');
    table.text('content');
    table.boolean('status');
    table.integer('author_id');
    table.dateTime('published_at').notNullable();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at').notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('pages');
};